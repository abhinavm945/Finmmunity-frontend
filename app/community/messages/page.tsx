"use client";

import { useState, useEffect } from "react";
import { api } from "../../../utils/api";
import ProtectedRoute from "../../../components/shared/ProtectedRoute";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import { MessageCircle, Send } from "lucide-react";
import Avatar from "../../../components/shared/Avatar";
import { Conversation, Message } from "@/types/community";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await api.community.getConversations();
      if (response.success && response.data) {
        setConversations(response.data as Conversation[]);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await api.community.getMessages(conversationId);
      if (response.success && response.data) {
        setMessages(response.data as Message[]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await api.community.sendMessage(
        selectedConversation.id,
        newMessage
      );
      if (response.success && response.data) {
        setMessages((prev) => [...prev, response.data as Message]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner />
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Error Loading Messages
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchConversations}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <div className="bg-white rounded-lg shadow-md border">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-gray-800">Conversations</h2>
            </div>
            <div className="overflow-y-auto h-[500px]">
              {conversations.length > 0 ? (
                conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleConversationSelect(conversation)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedConversation?.id === conversation.id
                        ? "bg-blue-50"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar size="sm" image="/images/default-avatar.png" />
                      <div>
                        <p className="font-medium text-gray-800">
                          {conversation.participant1?.username || "User"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {conversation.lastMessage || "No messages yet"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No conversations yet
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-md border">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b">
                  <div className="flex items-center gap-3">
                    <Avatar size="sm" image="/images/default-avatar.png" />
                    <h2 className="font-semibold text-gray-800">
                      {selectedConversation.participant1?.username || "User"}
                    </h2>
                  </div>
                </div>

                <div className="h-[400px] overflow-y-auto p-4">
                  {loadingMessages ? (
                    <div className="flex justify-center items-center h-full">
                      <LoadingSpinner />
                    </div>
                  ) : messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderId === "current-user-id"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-xs p-3 rounded-lg ${
                              message.senderId === "current-user-id"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs mt-1 opacity-70">
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 mt-8">
                      No messages yet. Start a conversation!
                    </div>
                  )}
                </div>

                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      disabled={sendingMessage}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || sendingMessage}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <MessageCircle size={48} className="mx-auto mb-4" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
