import React, { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../contexts/AuthContext";
import type { ChatMessage } from "../contexts/ChatContext";
import axios from 'axios';

interface Conversation {
  userId: string;
  name: string;
  lastMessage: string;
  unread: boolean;
}

const SOCKET_URL = "http://localhost:3212";

const ChatDropdown: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [openChats, setOpenChats] = useState<string[]>([]);
  const [messages, setMessages] = useState<Record<string, Array<ChatMessage>>>({});
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [socket, setSocket] = useState<Socket | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch conversations when component mounts
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(`${SOCKET_URL}/api/conversations/${user.id}`);
        if (response.data.success) {
          setConversations(response.data.data);
        }
      } catch (err) {
        setError("Không thể tải danh sách chat");
        console.error("Error fetching conversations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [user?.id]);

  // Set up socket connection
  useEffect(() => {
    if (!user?.id) return;

    const s = io(SOCKET_URL, {
      path: "/chat/history",
      withCredentials: true,
    });
    
    setSocket(s);
    
    s.on("message", (data: ChatMessage) => {
      setMessages((prev) => ({
        ...prev,
        [data.senderId === user.id ? data.receiverId : data.senderId]: [
          ...(prev[data.senderId === user.id ? data.receiverId : data.senderId] || []),
          data
        ],
      }));

      // Update lastMessage in conversations
      setConversations(prevConvs => {
        const otherUserId = data.senderId === user.id ? data.receiverId : data.senderId;
        return prevConvs.map(conv => 
          conv.userId === otherUserId 
            ? { ...conv, lastMessage: data.content, unread: data.senderId !== user.id }
            : conv
        );
      });
    });

    return () => {
      s.disconnect();
    };
  }, [user?.id]);

  const toggleDropdown = () => setIsOpen((v) => !v);

  const openChat = async (id: string) => {
    if (!openChats.includes(id)) {
      setOpenChats((prev) => [...prev, id]);
      try {
        const response = await axios.get(`${SOCKET_URL}/api/chat/history?user1=${user?.id}&user2=${id}`);
        if (response.data.success) {
          setMessages(prev => ({
            ...prev,
            [id]: response.data.data
          }));
        }
      } catch (err) {
        console.error("Error fetching chat history:", err);
      }
    }
    setIsOpen(false);
  };

  const handleSend = (id: string) => {
    const text = inputValues[id]?.trim();
    if (!text || !socket || !user?.id) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: id,
      content: text,
      createdAt: new Date().toISOString()
    };

    socket.emit("newMessage", newMessage);
    setMessages((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), newMessage],
    }));
    setInputValues((prev) => ({ ...prev, [id]: "" }));

    // Update lastMessage in conversations
    setConversations(prevConvs => 
      prevConvs.map(conv => 
        conv.userId === id 
          ? { ...conv, lastMessage: text, unread: false }
          : conv
      )
    );
  };

  return (
    <div className="fixed bottom-0 right-6 z-50 flex flex-col items-end space-y-6">
      {/* Chat button */}
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="bg-red-700 text-white px-7 py-5 mx-2 rounded-full shadow-xl hover:bg-red-800 transition font-semibold flex items-center gap-4 text-xl"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          💬 Tin nhắn
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute right-0 bottom-full mb-5 w-[420px] bg-white rounded-3xl shadow-3xl border border-red-400 overflow-hidden max-h-[500px] flex flex-col text-lg">
            <div className="p-6 border-b font-bold text-red-800 bg-red-100 flex justify-between items-center text-2xl">
              <span>Tin nhắn gần đây</span>
              <button
                onClick={toggleDropdown}
                className="text-red-700 hover:text-red-900 text-3xl font-extrabold transition"
                aria-label="Đóng danh sách tin nhắn"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto max-h-[420px]">
              {isLoading ? (
                <div className="p-6 text-center text-gray-500">Đang tải...</div>
              ) : error ? (
                <div className="p-6 text-center text-red-500">{error}</div>
              ) : conversations.length === 0 ? (
                <div className="p-6 text-center text-gray-500">Chưa có cuộc trò chuyện nào</div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.userId}
                    onClick={() => openChat(conv.userId)}
                    className="w-full text-left px-6 py-5 hover:bg-red-50 flex justify-between items-center border-b border-red-200 transition text-lg"
                  >
                    <div>
                      <p className="font-semibold text-red-700">{conv.name}</p>
                      <p className="text-base text-red-500 truncate max-w-[300px]">
                        {conv.lastMessage}
                      </p>
                    </div>
                    {conv.unread && (
                      <span className="bg-red-700 rounded-full w-3.5 h-3.5 ml-4 inline-block"></span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Chat Windows */}
      <div className="flex gap-6 flex-wrap justify-end">
        {openChats.map((id) => {
          const chat = conversations.find((c) => c.userId === id);
          const chatMessages = messages[id] || [];
          
          return (
            <div
              key={id}
              className="bg-white w-[420px] rounded-3xl shadow-3xl border border-red-400 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-5 bg-red-700 text-white rounded-t-3xl">
                <p className="font-semibold text-xl truncate max-w-[calc(100%-40px)]">
                  {chat?.name}
                </p>
                <button
                  onClick={() => setOpenChats((prev) => prev.filter((chatId) => chatId !== id))}
                  className="hover:text-red-300 transition text-3xl font-extrabold"
                  aria-label={`Đóng cửa sổ chat với ${chat?.name}`}
                >
                  ×
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 text-base px-6 py-4 bg-red-50 overflow-y-auto space-y-4 text-red-900 h-64 scrollbar-thin scrollbar-thumb-red-300">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={
                      msg.senderId === user?.id
                        ? "bg-red-600 text-white px-5 py-3 rounded-2xl rounded-br-sm max-w-[80%] ml-auto"
                        : "bg-white shadow px-5 py-3 rounded-2xl rounded-bl-sm max-w-[80%]"
                    }
                  >
                    {msg.content}
                  </div>
                ))}
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(id);
                }}
                className="flex items-center gap-3 px-5 py-4 bg-white border-t border-red-200"
              >
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 bg-red-100 px-5 py-3 rounded-full text-base text-red-900 placeholder-red-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={inputValues[id] || ""}
                  onChange={(e) => setInputValues((v) => ({ ...v, [id]: e.target.value }))}
                />
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow"
                >
                  <Send className="w-6 h-6" />
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatDropdown;
