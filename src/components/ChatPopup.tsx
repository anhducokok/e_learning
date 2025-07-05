import React, { useEffect, useState } from "react";
import { userService } from "../services/userService";
import type { User } from "../types/api";
import { MessageCircle } from "lucide-react";
import { useChat } from "../contexts/ChatContext";
import MyChat from "../components/MyChatWidgetSection";
import { useAuth } from "../contexts/AuthContext";

const ChatPopup: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { isAuthenticated, user } = useAuth();
  const { toggleChat, currentUserId, messages } = useChat();

  useEffect(() => {
    userService      .getAllUsers()
      .then(setUsers)
      .catch((error) => {
        // Error loading users - handle silently
      });
  }, []);
  if (!isAuthenticated || !user?.id) return null;

  const getLastMessage = (userId: string) => {
    const userMessages = messages[userId] || [];
    return userMessages.length > 0
      ? userMessages[userMessages.length - 1]
      : null;
  };

  const isUnread = (userId: string) => {
    const userMessages = messages[userId] || [];
    const last = userMessages[userMessages.length - 1];
    return last && last.senderId !== currentUserId;
  };

  const usersWithMeta = users
    .filter((user) => user.id !== currentUserId)
    .map((user) => {
      const lastMsg = getLastMessage(user.id);
      return {
        ...user,
        lastMessage: lastMsg?.content || "",
        lastTime: lastMsg?.createdAt
          ? new Date(lastMsg.createdAt).getTime()
          : 0,
        unread: isUnread(user.id),
      };
    })
    .sort((a, b) => {
      if (a.unread !== b.unread) return b.unread ? 1 : -1;
      return b.lastTime - a.lastTime;
    });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 text-xl font-semibold text-red-600">
        Tin nhắn
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-2">
        {usersWithMeta.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-3 w-full overflow-hidden">
              <img
                src={
                  user.avatar ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
                }
                alt={user.name}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="flex flex-col overflow-hidden">
                <p className="font-medium text-sm truncate">{user.name}</p>
                <p className="text-gray-500 text-xs truncate max-w-[220px]">
                  {user.lastMessage || "Không có tin nhắn"}
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleChat(user.id)}
              className="relative text-red-600 hover:text-red-800 transition flex-shrink-0"
              title={`Chat với ${user.name}`}
            >
              <MessageCircle className="w-5 h-5" />
              {user.unread && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-600"></span>
              )}
            </button>
          </div>
        ))}
      </div>
      <div className="hidden">
        <MyChat />
      </div>
    </div>
  );
};

export default ChatPopup;
