import React, { useState } from "react";
import { X, MessageCircle } from "lucide-react";

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-6 z-50">
      {/* Chat box */}
      {isOpen && (
        <div className="bg-white w-80 h-96 rounded-lg shadow-lg flex flex-col justify-between border border-gray-200">
          {/* Header */}
          <div className="bg-[#A82828] text-white p-4 flex justify-between items-center rounded-t-lg">
            <span className="font-semibold">Hỗ trợ trực tuyến</span>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat content area */}
          <div className="flex-1 p-4 overflow-y-auto text-sm text-gray-700">
            <p className="text-gray-500">Xin chào! Bạn cần hỗ trợ gì?</p>
          </div>

          {/* Input area */}
          <div className="p-4 border-t flex gap-2">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="flex-1 border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#A82828]"
            />
            <button className="bg-[#FCD980] px-4 py-2 rounded text-[#282938] text-sm font-medium hover:bg-yellow-400 transition">
              Gửi
            </button>
          </div>
        </div>
      )}

      {/* Floating chat icon */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-red-600  text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-700 transition"
        aria-label="Mở khung chat"
      >
        <MessageCircle className="w-6 h-6 inline-block" /> Hỏi đáp
      </button>
    </div>
  );
};

export default ChatWidget;
