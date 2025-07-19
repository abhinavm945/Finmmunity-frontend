"use client";

import { useState, useEffect, useCallback } from "react";
import ProtectedRoute from "../../../components/shared/ProtectedRoute";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import { Conversation, Message, User } from "@/utils/types";
import ConversationList from "../../../components/community/ConversationList";
import ChatWindow from "../../../components/community/ChatWindow";
import { api } from "@/utils/api";
import { useAuth } from "@/hooks/useAuth";
import { useMessageSocket } from "@/hooks/community/useMessageSocket";
import { userAPI } from "@/utils/api";
import { useSocket } from "@/utils/socket";
import { chatAPI } from "@/utils/api";
import { useRouter } from "next/navigation";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [showChatMobile, setShowChatMobile] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchDropdown, setSearchDropdown] = useState(false);
  const { user } = useAuth();
  const socket = useSocket();
  const router = useRouter();
  // Typing state for each conversation
  const [typingConversations, setTypingConversations] = useState<{
    [conversationId: string]: boolean;
  }>({});

  useEffect(() => {
    // Only fetch conversations on initial mount
    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search
  useEffect(() => {
    if (search.trim().length < 2) {
      setSearchResults([]);
      setSearchDropdown(false);
      return;
    }
    setSearchLoading(true);
    const timeout = setTimeout(async () => {
      const res = await userAPI.searchUsers(search.trim());
      let users: User[] = [];
      if (
        res.data &&
        typeof res.data === "object" &&
        "users" in res.data &&
        Array.isArray((res.data as any).users)
      ) {
        users = (res.data as { users: User[] }).users;
      }
      if (res.success && Array.isArray(users)) {
        setSearchResults(users);
        setSearchDropdown(true);
      } else {
        setSearchResults([]);
        setSearchDropdown(false);
      }
      setSearchLoading(false);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  // Start conversation with searched user
  const handleStartConversation = async (user: any) => {
    setSearch("");
    setSearchDropdown(false);
    setSearchResults([]);
    // Prompt for first message
    const message = prompt(`Type your first message to ${user.username}:`);
    if (!message || !message.trim()) return;
    setLoading(true);
    const res = await api.community.messages.startConversation(
      user.id,
      message.trim()
    );
    const conversation = res.data && (res.data as any).conversation;
    if (res.success && conversation) {
      // Add to conversations if not present
      setConversations((prev) => {
        if (prev.some((c) => c.id === conversation.id)) return prev;
        return [conversation, ...prev];
      });
      setSelectedConversation(conversation);
      fetchMessages(conversation.id);
      if (window.innerWidth < 768) setShowChatMobile(true);
    }
    setLoading(false);
  };

  const fetchConversations = async () => {
    setLoading(true);
    const res = await api.community.messages.getConversations();
    const data =
      res.data && (res.data as any).data ? (res.data as any).data : [];
    if (res.success && Array.isArray(data)) {
      setConversations(data);
    } else {
      setConversations([]);
    }
    setLoading(false);
  };

  // When fetching messages, also mark as delivered/read if needed
  const fetchMessages = async (conversationId: string) => {
    setLoading(true);
    const res = await api.community.messages.getConversationMessages(
      conversationId
    );
    const data =
      res.data && (res.data as any).data ? (res.data as any).data : [];
    if (res.success && Array.isArray(data)) {
      setMessages(data);
      if (user) {
        for (const msg of data) {
          if (msg.receiverId === user.id) {
            if (msg.status === "sent") {
              await chatAPI.markMessageDelivered(msg.id);
            }
            if (msg.status === "delivered") {
              await chatAPI.markMessageRead(msg.id);
            }
          }
        }
      }
    } else {
      setMessages([]);
    }
    setLoading(false);
  };

  // Add a function to fetch only the last message in a conversation
  const fetchLastMessage = async (conversationId: string) => {
    const res = await api.community.messages.getLastMessage(conversationId);
    if (
      res.success &&
      res.data &&
      typeof res.data === "object" &&
      "message" in res.data &&
      res.data.message
    ) {
      const lastMsg = res.data.message as Message;
      // If the last message is delivered/read, update all previous messages' statuses
      if (lastMsg.status === "delivered" || lastMsg.status === "read") {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.status !== lastMsg.status && msg.senderId === lastMsg.senderId
              ? { ...msg, status: lastMsg.status }
              : msg
          )
        );
      }
    }
  };

  // In handleSelectConversation, after fetching all messages, fetch the last message once
  const handleSelectConversation = (c: Conversation) => {
    setSelectedConversation(c);
    fetchMessages(c.id);
    fetchLastMessage(c.id); // Fetch only the last message for status
    // Update the URL with both conversation id and user id
    const otherUser = c.participants?.find((u) => u.id !== user?.id);
    if (otherUser) {
      router.push(`/community/messages?id=${c.id}&user=${otherUser.id}`);
    } else {
      router.push(`/community/messages?id=${c.id}`);
    }
    if (window.innerWidth < 768) setShowChatMobile(true);
  };

  const handleBackToList = () => {
    setShowChatMobile(false);
    setSelectedConversation(null);
    setMessages([]);
    // Remove the 'user' param from the URL
    const params = new URLSearchParams(window.location.search);
    params.delete("user");
    router.push(
      `/community/messages${params.toString() ? `?${params.toString()}` : ""}`
    );
  };

  // Real-time socket integration
  useMessageSocket({
    conversationId: selectedConversation?.id || null,
    onNewMessage: async (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });

      setConversations((prev) => {
        const idx = prev.findIndex((c) => c.id === msg.conversationId);
        if (idx === -1) return prev;
        const updated = [...prev];
        const conv = { ...updated[idx] };
        conv.lastMessage = msg;
        // If the conversation is not currently open, increment unreadCount
        if (!selectedConversation || selectedConversation.id !== conv.id) {
          conv.unreadCount = (conv.unreadCount || 0) + 1;
        }
        // Move to top
        updated.splice(idx, 1);
        return [conv, ...updated];
      });

      // Only mark as delivered if the message is for the current user and status is 'sent'
      let delivered = msg.status;
      if (user && msg.receiverId === user.id && msg.status === "sent") {
        await chatAPI.markMessageDelivered(msg.id);
        // Optimistically update the message status to 'delivered' in local state
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, status: "delivered" } : m))
        );
        delivered = "delivered";
      }

      // Mark as read if the chat is open, the message is for the current user, and status is 'delivered' (either originally or just updated)
      if (
        user &&
        msg.receiverId === user.id &&
        selectedConversation &&
        msg.conversationId === selectedConversation.id &&
        delivered === "delivered"
      ) {
        await chatAPI.markMessageRead(msg.id);
      }
    },
    onTyping: (data) => {
      if (data && data.receiverId && data.userId) {
        setTypingConversations((prev) => ({
          ...prev,
          [data.conversationId || data.receiverId]: true,
        }));
      }
    },
    onStopTyping: (data) => {
      if (data && data.receiverId && data.userId) {
        setTypingConversations((prev) => ({
          ...prev,
          [data.conversationId || data.receiverId]: false,
        }));
      }
    },
  });

  // Listen for real-time message status updates (delivered/read ticks)
  useEffect(() => {
    const handler = (data: { messageId: string; status: string }) => {
      setMessages((prev) => {
        const updated = prev.map((msg) =>
          msg.id === data.messageId
            ? { ...msg, status: data.status as Message["status"] }
            : msg
        );
        return updated;
      });

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.lastMessage && conv.lastMessage.id === data.messageId) {
            return {
              ...conv,
              lastMessage: {
                ...conv.lastMessage,
                status: data.status as Message["status"],
              },
            };
          }
          return conv;
        })
      );
    };
    socket.onMessageStatusUpdate(handler);
    return () => {
      socket.off("messageStatusUpdate");
    };
  }, [socket]);

  // Send message handler
  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!selectedConversation) return;
      const res = await api.community.messages.sendMessage(
        selectedConversation.id,
        content
      );
      if (res.success && res.data) {
        setMessages((prev) => [...prev, res.data.message]);
      }
      // Optionally, emit stop typing here
      // setIsTyping(false); // This line was removed as per the edit hint
    },
    [selectedConversation]
  );

  // Send typing event to the other user
  const handleTyping = useCallback(() => {
    if (!selectedConversation || !user) return;
    const otherUser = selectedConversation.participants?.find(
      (u) => u.id !== user.id
    );
    if (!otherUser) return;
    socket.sendTypingStatus({
      userId: user.id,
      username: user.username,
      receiverId: otherUser.id,
    });
    // Typing timeout logic can be handled in ChatWindow or with a separate mechanism if needed
  }, [selectedConversation, user, socket]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      {/* Mobile sidebar overlay (no longer needed with new logic) */}
      <div className="relative max-h-screen md:h-[calc(90vh-90px)] w-full md:max-w-4xl md:mx-auto md:mt-14 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col md:flex-row ring-2 ring-blue-100">
        {/* Sidebar: show on desktop, or on mobile if no conversation is selected */}
        {(selectedConversation === null || window.innerWidth >= 768) && (
          <div className="h-full w-full md:w-4/11 min-w-0 flex flex-col bg-white">
            <ConversationList
              conversations={conversations}
              selectedConversation={selectedConversation}
              onSelect={handleSelectConversation}
              searchValue={search}
              onSearchChange={(e) => setSearch(e.target.value)}
              searchResults={searchResults}
              searchLoading={searchLoading}
              searchDropdown={searchDropdown}
              onUserSelect={handleStartConversation}
              typingConversations={typingConversations}
            />
          </div>
        )}
        {/* Chat window: show on desktop, or on mobile if a conversation is selected */}
        {(selectedConversation !== null || window.innerWidth >= 768) && (
          <div className="flex-1 w-full md:w-7/11 min-w-0 h-full flex bg-white">
            <ChatWindow
              conversation={(() => {
                if (!selectedConversation) return null;
                // backend may return otherParticipant for new conversations
                if (
                  typeof selectedConversation === "object" &&
                  "otherParticipant" in selectedConversation &&
                  selectedConversation.otherParticipant
                ) {
                  return {
                    ...selectedConversation,
                    participants: [
                      user,
                      selectedConversation.otherParticipant,
                    ].filter(Boolean),
                  };
                }
                return selectedConversation;
              })()}
              messages={messages}
              currentUserId={user?.id}
              onSendMessage={handleSendMessage}
              onTyping={handleTyping}
              isTyping={(() => {
                if (!selectedConversation || !user) return false;
                const otherUser = selectedConversation.participants?.find(
                  (u) => u.id !== user.id
                );
                return (
                  typingConversations[
                    selectedConversation.id || otherUser?.id || ""
                  ] || false
                );
              })()}
              onBack={handleBackToList}
            />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
