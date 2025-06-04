import React, { useState } from "react";
import { X, MessageCircle } from "lucide-react";

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-8 z-50 flex flex-col items-end space-y-5">
      {/* Chat box */}
      {isOpen && (
        <div className="bg-white w-[400px] h-[520px] rounded-3xl shadow-3xl flex flex-col border border-red-500 overflow-hidden">
          {/* Header */}
          <div className="bg-red-800 text-white p-6 flex justify-between items-center font-bold text-xl tracking-wide rounded-t-3xl shadow-lg">
            <span>Hỗ trợ trực tuyến</span>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Đóng khung chat"
              className="hover:text-red-300 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Chat content area */}
          <div className="flex-1 p-6 overflow-y-auto text-red-900 text-base leading-relaxed bg-red-50">
            <p className="italic text-red-500">Xin chào! Bạn cần hỗ trợ gì?</p>
          </div>

          {/* Input area */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="p-6 border-t border-red-300 flex gap-4 bg-white"
          >
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="flex-1 border border-red-400 rounded-2xl px-5 py-3 text-base text-red-900 placeholder-red-400 focus:outline-none focus:ring-4 focus:ring-red-700 transition"
            />
            <button
              type="submit"
              className="bg-red-700 hover:bg-red-800 text-white px-7 py-3 rounded-2xl font-semibold transition shadow-lg"
            >
              Gửi
            </button>
          </form>
        </div>
      )}

      {/* Floating chat icon */}
      <button
        onClick={() => setIsOpen(true)}
          className="bg-red-700 text-white px-7 py-5 rounded-full shadow-xl hover:bg-red-800 transition font-semibold flex items-center gap-4 text-xl"
        aria-label="Mở khung chat"
      >
        <MessageCircle  />
        Hỏi đáp
      </button>
    </div>
  );
};

export default ChatWidget;
