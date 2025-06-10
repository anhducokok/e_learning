import React, { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { io, Socket } from "socket.io-client";

const dummyConversations = [
  {
    id: "49298468-8a39-4cf0-896f-2fdba3a0e4b6",
    name: "Alice",
    lastMessage: "Học xong chưa?",
    unread: true,
  },
  {
    id: "80016a30-2d11-48d5-bb8f-71c0656ef612",
    name: "Thầy ABC",
    lastMessage: "Tài liệu đây em",
    unread: false,
  },
  {
    id: "af00fb36-adcd-4e18-bada-0cc9efb38a90",
    name: "Nhóm lớp HSK",
    lastMessage: "Cuối tuần họp nhé",
    unread: true,
  },
];

import ChatPopup from "./ChatPopup";

const SOCKET_URL = "http://localhost:3212"; // socket.io server URL

const ChatDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openChats, setOpenChats] = useState<string[]>([]);
  const [messages, setMessages] = useState<
    Record<string, Array<{ from: string; text: string }>>
  >({});
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = io(SOCKET_URL, {
      path: "/chat/history",
      withCredentials: true,
    });
    setSocket(s);
    s.on("message", (data: any) => {
      // data: { chatId, from, text }
      setMessages((prev) => ({
        ...prev,
        [data.chatId]: [
          ...(prev[data.chatId] || []),
          { from: data.from, text: data.text },
        ],
      }));
    });
    return () => {
      s.disconnect();
    };
  }, []);

  const toggleDropdown = () => setIsOpen((v) => !v);

  const openChat = (id: string) => {
    if (!openChats.includes(id)) {
      setOpenChats((prev) => [...prev, id]);
    }
    setIsOpen(false);
  };

  const handleSend = (id: string) => {
    const text = inputValues[id]?.trim();
    if (!text || !socket) return;
    socket.emit("newMessage", { chatId: id, text });
    setMessages((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), { from: "me", text }],
    }));
    setInputValues((prev) => ({ ...prev, [id]: "" }));
  };

  return (
    <div className="fixed bottom-0 right-6 z-50 flex flex-col items-end space-y-6">
      {/* Chat button */}
      <div className="relative my-6">
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
            <ChatPopup />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDropdown;
