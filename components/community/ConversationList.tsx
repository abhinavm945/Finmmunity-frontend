import React from "react";
import Avatar from "../shared/Avatar";
import { Conversation } from "@/utils/types";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelect: (c: Conversation) => void;
  searchValue?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchResults?: any[];
  searchLoading?: boolean;
  searchDropdown?: boolean;
  onUserSelect?: (user: any) => void;
  typingConversations?: { [conversationId: string]: boolean };
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversation,
  onSelect,
  searchValue = "",
  onSearchChange,
  searchResults = [],
  searchLoading = false,
  searchDropdown = false,
  onUserSelect,
  typingConversations = {},
}) => {
  return (
    <aside className="w-full md:w-80 bg-white h-full flex-shrink-0 flex flex-col overflow-y-auto border rounded-2xl">
      {/* Sticky header and search */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="p-4 py-6.5">
          <h2 className="font-extrabold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Messages
          </h2>
        </div>
      </div>
      <div className="px-5 py-2 relative">
        <input
          type="text"
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Search users to message..."
          className="w-full p-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
        />
        {searchDropdown && (
          <div className="absolute left-0 right-0 mt-2 bg-white border rounded-2xl shadow-lg z-30 max-h-60 overflow-y-auto">
            {searchLoading ? (
              <div className="p-4 text-center text-blue-400 animate-pulse">
                Searching...
              </div>
            ) : searchResults.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                No users found
              </div>
            ) : (
              searchResults.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => onUserSelect && onUserSelect(u)}
                >
                  <img
                    src={u.profilePicture || "/images/default-avatar.png"}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-medium">{u.username}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {/* Scrollable participant list */}
      <ul className="flex-1 overflow-y-auto divide-y px-2 md:px-4 pb-4">
        {conversations.length === 0 ? (
          <li className="p-4 md:p-6 text-center text-gray-400 text-sm md:text-base">
            No conversations
          </li>
        ) : (
          conversations.map((c) => {
            const other = c.otherParticipant;
            return (
              <li
                key={c.id}
                className={`flex items-center gap-2 md:gap-3 py-2 md:py-3 cursor-pointer transition rounded-xl group
                  ${
                    selectedConversation?.id === c.id
                      ? "bg-blue-50 border-l-4 border-blue-500 shadow-md scale-[1.02]"
                      : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:scale-[1.01] hover:shadow-sm"
                  }
                `}
                onClick={() => onSelect(c)}
              >
                <Avatar
                  image={other?.profilePicture}
                  size="md"
                  className="rounded-full border-2 border-white shadow-md group-hover:shadow-lg transition w-8 h-8 md:w-10 md:h-10"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold truncate bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-sm md:text-base">
                      {other?.username || "User"}
                    </span>
                    {c.unreadCount > 0 && (
                      <span className="ml-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full px-2 py-0.5 shadow">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 truncate block max-w-[120px] md:max-w-[180px]">
                    {typingConversations[c.id] ? (
                      <span className="text-blue-500 font-semibold">
                        Typing...
                      </span>
                    ) : (
                      c.lastMessage?.content || "No messages yet"
                    )}
                  </span>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </aside>
  );
};

export default ConversationList;
