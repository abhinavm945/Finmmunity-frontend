import React, { useState, useRef, useEffect } from "react";
import Avatar from "../shared/Avatar";
import { Conversation, Message } from "@/utils/types";
import { chatAPI } from "@/utils/api";
import { useRouter } from "next/navigation";

interface ChatWindowProps {
  conversation: Conversation | null;
  messages: Message[];
  currentUserId?: string;
  onSendMessage?: (content: string) => void;
  onTyping?: () => void;
  isTyping?: boolean;
  onBack?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages = [],
  currentUserId = "current-user-id",
  onSendMessage,
  onTyping,
  isTyping,
  onBack,
}) => {
  const [input, setInput] = useState("");
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Get the other participant (not the current user), handle undefined participants
  const other =
    conversation?.participants?.find((u) => u.id !== currentUserId) ?? null;

  useEffect(() => {}, [isTyping, currentUserId, other]);

  // Mark messages as delivered when received
  useEffect(() => {
    if (!messages.length || !currentUserId) return;
    messages.forEach((msg) => {
      if (msg.receiverId === currentUserId && msg.status === "sent") {
        chatAPI.markMessageDelivered(msg.id);
      }
    });
  }, [messages, currentUserId]);

  // Mark latest message as read when chat is focused
  useEffect(() => {
    if (!messages.length || !currentUserId) return;
    const lastMsg = messages[messages.length - 1];
    if (
      lastMsg &&
      lastMsg.receiverId === currentUserId &&
      lastMsg.status === "delivered"
    ) {
      chatAPI.markMessageRead(lastMsg.id);
    }
  }, [messages, currentUserId]);

  // Deduplicate messages by id (keep the latest by createdAt)
  const dedupedMessages = React.useMemo(() => {
    const map = new Map();
    messages.forEach((msg) => {
      if (
        !map.has(msg.id) ||
        new Date(msg.createdAt) > new Date(map.get(msg.id).createdAt)
      ) {
        map.set(msg.id, msg);
      }
    });
    return Array.from(map.values()).sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [messages]);

  // Helper to group messages by date
  const groupMessagesByDate = (
    msgs: Message[]
  ): { [date: string]: Message[] } => {
    const groups: { [date: string]: Message[] } = {};
    msgs.forEach((msg: Message) => {
      const date = new Date(msg.createdAt).toLocaleDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  };
  const grouped = groupMessagesByDate(dedupedMessages);
  const dates = Object.keys(grouped);

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-gray-400 text-center">
          <div className="mb-4">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
              <path
                stroke="#cbd5e1"
                strokeWidth="2"
                d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9Zm-6-2.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm-7.5 7.5c0-2 4-3.1 6-3.1s6 1.1 6 3.1v.4a1 1 0 0 1-1 1H6.5a1 1 0 0 1-1-1v-.4Z"
              />
            </svg>
          </div>
          <p>Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (onTyping) {
      onTyping();
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        if (onTyping) onTyping(); // Optionally emit stop typing here
      }, 2000);
    }
  };

  const handleSend = () => {
    if (input.trim() && onSendMessage) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <section className="flex-1 w-full flex flex-col h-full bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden max-h-screen border rounded-2xl">
      {/* Header */}
      <div className="flex items-center gap-2 md:gap-3 p-2 md:p-4 border-b-1 border-gradient-to-r from-blue-500 to-purple-500 sticky top-0 bg-white z-10 shadow-sm min-h-[56px]">
        <button
          className="mr-2 p-2 rounded-full hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100"
          onClick={onBack}
          aria-label="Back"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="#333" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() =>
            other && router.push(`/community/profile?id=${other.id}`)
          }
        >
          <Avatar image={other?.profilePicture} size="md" />
          <span className="font-extrabold text-sm md:text-base bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {other?.username || "User"}
          </span>
        </div>
        {/* Typing/Online indicator */}
        <span className="ml-2 flex items-center gap-1 text-xs md:text-sm">
          {isTyping ? (
            <span className="flex items-center gap-1 text-blue-500">
              <span>Typing</span>
              <span className="flex gap-0.5">
                <span
                  className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0s" }}
                ></span>
                <span
                  className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></span>
                <span
                  className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></span>
              </span>
            </span>
          ) : (
            <span className="text-green-500">Online</span>
          )}
        </span>
        <span className="ml-auto flex gap-2">
          <button
            className="p-2 rounded-full hover:bg-blue-100 transition"
            title="Call"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                stroke="#6366f1"
                strokeWidth="2"
                d="M6.5 7.5A13.5 13.5 0 0 0 16.5 17.5l2-2a1 1 0 0 1 1.4-.1l2.1 1.7a1 1 0 0 1 .1 1.4l-2.2 2.7c-.4.5-1.1.6-1.6.2A19.5 19.5 0 0 1 4.2 6.2c-.4-.5-.3-1.2.2-1.6l2.7-2.2a1 1 0 0 1 1.4.1l1.7 2.1a1 1 0 0 1-.1 1.4l-2 2Z"
              />
            </svg>
          </button>
          <button
            className="p-2 rounded-full hover:bg-purple-100 transition"
            title="Info"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#a78bfa" strokeWidth="2" />
              <path stroke="#a78bfa" strokeWidth="2" d="M12 8v4m0 4h.01" />
            </svg>
          </button>
        </span>
      </div>
      {/* Messages list with date separators and bubble tails */}
      <div className="flex-1 overflow-y-auto p-2 md:p-4 flex flex-col gap-1 md:gap-2 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {dates.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          dates.map((date: string) => (
            <React.Fragment key={date}>
              <div className="flex justify-center my-2">
                <span className="bg-white/80 text-xs text-gray-500 px-3 py-1 rounded-full shadow">
                  {date}
                </span>
              </div>
              {grouped[date].map((msg: Message) => {
                // Use real status for ticks
                let status: "sent" | "delivered" | "read" | null = null;
                if (msg.senderId === currentUserId) {
                  status = msg.status;
                }
                return (
                  <div
                    key={`${msg.id}-${msg.createdAt}`}
                    className={`flex w-full ${
                      msg.senderId === currentUserId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {msg.senderId !== currentUserId && (
                      <Avatar image={other?.profilePicture} size="sm" />
                    )}
                    <div
                      className={`relative max-w-[70%] px-3 md:px-4 py-2 rounded-2xl shadow-md text-xs md:text-sm break-words transition-all duration-200
                        ${
                          msg.senderId === currentUserId
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-md shadow-lg ml-8 md:ml-24 after:content-[''] after:absolute after:right-[-8px] after:bottom-2 after:border-8 after:border-transparent after:border-l-blue-500 after:border-l-[8px] after:border-r-0 after:border-t-0 after:border-b-0"
                            : "bg-white/80 text-gray-900 rounded-bl-md border border-blue-100 shadow mr-8 md:mr-24 after:content-[''] after:absolute after:left-[-8px] after:bottom-2 after:border-8 after:border-transparent after:border-r-white after:border-r-[8px] after:border-l-0 after:border-t-0 after:border-b-0"
                        }`}
                    >
                      {msg.content}
                      <div className="flex items-center justify-end gap-1 text-[10px] opacity-60 mt-1">
                        <span>
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {/* Tick status UI */}
                        {status && (
                          <span className="ml-1">
                            {status === "sent" && (
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M5 13l4 4L19 7"
                                  stroke="#e5e7eb"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                            {status === "delivered" && (
                              <span className="flex items-center">
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    d="M5 13l4 4L19 7"
                                    stroke="#e5e7eb"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  className="-ml-2"
                                >
                                  <path
                                    d="M9 17l4 4L23 9"
                                    stroke="#e5e7eb"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>
                            )}
                            {status === "read" && (
                              <span className="flex items-center">
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    d="M5 13l4 4L19 7"
                                    stroke="#60a5fa"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  className="-ml-2"
                                >
                                  <path
                                    d="M9 17l4 4L23 9"
                                    stroke="#60a5fa"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))
        )}
        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
      {/* Message input bar */}
      <div className="p-2 md:p-4 border-t bg-white flex items-center gap-2 relative sticky bottom-0 z-10 min-h-[56px]">
        <button
          className="p-2 rounded-full hover:bg-blue-100 transition"
          title="Emoji"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="#6366f1" strokeWidth="2" />
            <path
              stroke="#6366f1"
              strokeWidth="2"
              d="M8 14s1.5 2 4 2 4-2 4-2"
            />
            <circle cx="9" cy="10" r="1" fill="#6366f1" />
            <circle cx="15" cy="10" r="1" fill="#6366f1" />
          </svg>
        </button>
        <button
          className="p-2 rounded-full hover:bg-purple-100 transition"
          title="Attach"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path
              stroke="#a78bfa"
              strokeWidth="2"
              d="M16.24 7.76a5 5 0 0 0-7.07 0l-4.24 4.24a5 5 0 0 0 7.07 7.07l6.36-6.36a3 3 0 0 0-4.24-4.24l-5.66 5.66"
            />
          </svg>
        </button>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-xs md:text-sm"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="absolute right-4 bottom-3 md:static px-3 md:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:scale-105 hover:shadow-lg transition disabled:opacity-50 text-xs md:text-sm shadow-md"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path stroke="#fff" strokeWidth="2" d="M22 2 11 13" />
            <path stroke="#fff" strokeWidth="2" d="m22 2-7 20-4-9-9-4 20-7Z" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default ChatWindow;
