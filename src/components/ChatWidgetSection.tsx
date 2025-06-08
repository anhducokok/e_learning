import React, { useState, useEffect, useRef } from "react";
import { X, MessageCircle } from "lucide-react";
import { useChat } from "../contexts/ChatContext";
import { useAuth } from "../contexts/AuthContext";
import type { ChatMessage } from "../contexts/ChatContext";

const FIXED_RECEIVER_ID = "d5182703-dae7-4723-ac98-c1a7cd7e1083";

const ChatWidget: React.FC = () => {
  const { messages, sendMessage } = useChat();
  const { isAuthenticated, user } = useAuth();

  // Nếu chưa đăng nhập thì không hiển thị chat widget
  if (!isAuthenticated || !user?.id) return null;

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lấy lịch sử chat giữa user và FIXED_RECEIVER_ID
  useEffect(() => {
    if (!isOpen) return;
    fetch(`/chat/history?userA=${user.id}&userB=${FIXED_RECEIVER_ID}`)
      .then((res) => res.json())
      .then((data) => setHistory(Array.isArray(data?.data) ? data.data : []))
      .catch(() => setHistory([]));
  }, [isOpen, user.id]);

  // Tin nhắn realtime
  const chatMessages = messages[FIXED_RECEIVER_ID] ?? [];

  // Gộp lịch sử và tin nhắn realtime, loại trùng theo id nếu có
  const allMessages = [
    ...history,
    ...chatMessages.filter((m) => !history.some((h) => h.id === m.id)),
  ];
  allMessages.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Tự động scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages, isOpen]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    sendMessage(FIXED_RECEIVER_ID, input);
    setInput("");
  };

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
            {allMessages.length === 0 && (
              <p className="italic text-red-500">Xin chào! Bạn cần hỗ trợ gì?</p>
            )}
            {allMessages.map((m, i) => (
              <div
                key={m.id || i}
                className={
                  m.senderId === user.id
                    ? "text-right mb-2"
                    : "text-left mb-2"
                }
              >
                <span
                  className={
                    m.senderId === user.id
                      ? "bg-red-100 px-3 py-2 rounded-2xl inline-block"
                      : "bg-gray-200 px-3 py-2 rounded-2xl inline-block"
                  }
                >
                  <b>
                    {m.senderId === user.id ? "You" : m.senderId}:
                  </b>{" "}
                  {m.content}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <form
            onSubmit={handleSend}
            className="p-6 border-t border-red-300 flex gap-4 bg-white"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 border border-red-400 rounded-2xl px-5 py-3 text-base text-red-900 placeholder-red-400 focus:outline-none focus:ring-4 focus:ring-red-700 transition"
              disabled={false}
            />
            <button
              type="submit"
              className="bg-red-700 hover:bg-red-800 text-white px-7 py-3 rounded-2xl font-semibold transition shadow-lg"
              disabled={false}
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
        <MessageCircle />
        Hỏi đáp
      </button>
    </div>
  );
};

export default ChatWidget;
