import React, { useState } from "react";
import { Send } from "lucide-react";

const dummyConversations = [
  { id: 1, name: "Alice", lastMessage: "Học xong chưa?", unread: true },
  { id: 2, name: "Thầy ABC", lastMessage: "Tài liệu đây em", unread: false },
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
    setIsOpen(false);
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
              {dummyConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => openChat(conv.id)}
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
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Open Chat Windows */}
      <div className="flex gap-6 flex-wrap justify-end">
        {openChats.map((id) => {
          const chat = dummyConversations.find((c) => c.id === id);
          return (
            <div
              key={id}
              className="bg-white w-[420px] rounded-3xl shadow-3xl border border-red-400 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-5 bg-red-700 text-white rounded-t-3xl">
                <p className="font-semibold text-xl truncate max-w-[calc(100%-40px)]">{chat?.name}</p>
                <button
                  onClick={() =>
                    setOpenChats(openChats.filter((chatId) => chatId !== id))
                  }
                  className="hover:text-red-300 transition text-3xl font-extrabold"
                  aria-label={`Đóng cửa sổ chat với ${chat?.name}`}
                >
                  ×
                </button>
              </div>

              {/* Tin nhắn */}
              <div className="flex-1 text-base px-6 py-4 bg-red-50 overflow-y-auto space-y-4 text-red-900 h-64 scrollbar-thin scrollbar-thumb-red-300">
                {/* Tin bên trái */}
                <div className="bg-white shadow px-5 py-3 rounded-2xl rounded-bl-sm max-w-[80%]">
                  {chat?.lastMessage}
                </div>
                {/* Tin bên phải */}
                <div className="bg-red-600 text-white px-5 py-3 rounded-2xl rounded-br-sm max-w-[80%] ml-auto">
                  Tung tung tung sahur.
                </div>
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex items-center gap-3 px-5 py-4 bg-white border-t border-red-200"
              >
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 bg-red-100 px-5 py-3 rounded-full text-base text-red-900 placeholder-red-400 focus:outline-none focus:ring-2 focus:ring-red-500"
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
