import React, { useState } from "react";

const dummyConversations = [
  { id: 1, name: "Việt Hà Nguyễn", lastMessage: "Học xong chưa?", unread: true },
  { id: 2, name: "Thầy Đức", lastMessage: "Tài liệu đây em", unread: false },
  { id: 3, name: "Nhóm lớp HSK", lastMessage: "Cuối tuần họp nhé", unread: true },
];

const ChatDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openChats, setOpenChats] = useState<number[]>([]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const openChat = (id: number) => {
    if (!openChats.includes(id)) {
      setOpenChats([...openChats, id]);
    }
  };

  return (
    <div className="fixed bottom-4 right-5 z-50">
      <div className="relative">
        {/* Chat button */}
        <button
          onClick={toggleDropdown}
          className="bg-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-700 transition"
        >
          💬 Tin nhắn
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute right-0 bottom-full mb-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="p-3 border-b font-semibold text-gray-800 bg-red-100 flex justify-between items-center">
              <span>Tin nhắn gần đây</span>
              <button onClick={toggleDropdown} className="text-gray-500 hover:text-red-600">✖</button>
            </div>
            {dummyConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => openChat(conv.id)}
                className="cursor-pointer px-4 py-3 hover:bg-red-50 border-b flex justify-between items-start"
              >
                <div>
                  <p className="font-medium text-gray-900">{conv.name}</p>
                  <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread && (
                  <span className="bg-red-500 rounded-full w-2 h-2 mt-1 ml-2"></span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Open Chat Windows */}
      <div className="flex gap-3 mt-4">
        {openChats.map((id) => {
          const chat = dummyConversations.find((c) => c.id === id);
          return (
            <div
              key={id}
              className="bg-white w-72 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
            >
              <div className="flex justify-between items-center px-4 py-2 bg-red-600 text-white">
                <p className="font-semibold text-sm">{chat?.name}</p>
                <button
                  onClick={() =>
                    setOpenChats(openChats.filter((chatId) => chatId !== id))
                  }
                  className="hover:text-red-200"
                >
                  ×
                </button>
              </div>
              <div className="text-sm text-gray-700 bg-red-50 px-4 py-2 h-24 overflow-y-auto">
                <p>{chat?.lastMessage}</p>
              </div>
              <input
                className="w-full border-t px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Nhập tin nhắn..."
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatDropdown;