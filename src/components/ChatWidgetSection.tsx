// import React, { useState, useEffect, useRef } from "react";
// import { X, MessageCircle } from "lucide-react";
// import { useChat } from "../contexts/ChatContext";
// import type { ChatMessage } from "../contexts/ChatContext";
// import { useAuth } from "../contexts/AuthContext";

// const FIXED_RECEIVER_ID = "d5182703-dae7-4723-ac98-c1a7cd7e1083";

// const ChatWidget: React.FC = () => {
//   const { messages, sendMessage } = useChat();
//   const { isAuthenticated, user } = useAuth();
//   const [isOpen, setIsOpen] = useState(false);
//   const [input, setInput] = useState("");
//   const [history, setHistory] = useState<ChatMessage[]>([]);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!isOpen || !isAuthenticated || !user?.id) return;

//     fetch(`http://localhost:3212/chat/history?userA=${user.id}&userB=${FIXED_RECEIVER_ID}`)
//       .then((res) => res.json())
//       .then((data) => setHistory(Array.isArray(data?.data) ? data.data : []))
//       .catch(() => setHistory([]));
//   }, [isOpen, user?.id, isAuthenticated]);

//   useEffect(() => {
//     if (isOpen && messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages, isOpen]);

//   if (!isAuthenticated || !user?.id) return null;

//   const chatMessages = messages[FIXED_RECEIVER_ID] ?? [];

//   const allMessages = [
//     ...history,
//     ...chatMessages.filter((m) => !history.some((h) => h.id === m.id)),
//   ].sort(
//     (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
//   );

//   const handleSend = (e?: React.FormEvent) => {
//     if (e) e.preventDefault();
//     if (!input.trim()) return;
//     sendMessage(FIXED_RECEIVER_ID, input);
//     setInput("");
//   };

//   return (
//     <div className="fixed bottom-24 right-8 z-50 flex flex-col items-end space-y-5">
//       {isOpen && (
//         <div className="bg-white w-[400px] h-[520px] rounded-3xl shadow-3xl flex flex-col border border-red-500 overflow-hidden">
//           <div className="bg-red-800 text-white p-6 flex justify-between items-center font-bold text-xl tracking-wide rounded-t-3xl shadow-lg">
//             <span>Hỗ trợ trực tuyến</span>
//             <button
//               onClick={() => setIsOpen(false)}
//               aria-label="Đóng khung chat"
//               className="hover:text-red-300 transition"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>

//           <div className="flex-1 p-6 overflow-y-auto text-red-900 text-base leading-relaxed bg-red-50">
//             {allMessages.length === 0 && (
//               <p className="italic text-red-500">Xin chào! Bạn cần hỗ trợ gì?</p>
//             )}
//             {allMessages.map((m, i) => (
//               <div
//                 key={m.id || i}
//                 className={
//                   m.senderId === user.id ? "text-right mb-2" : "text-left mb-2"
//                 }
//               >
//                 <span
//                   className={
//                     m.senderId === user.id
//                       ? "bg-red-100 px-3 py-2 rounded-2xl inline-block"
//                       : "bg-gray-200 px-3 py-2 rounded-2xl inline-block"
//                   }
//                 >
//                   {m.content}
//                 </span>
//               </div>
//             ))}
//             <div ref={messagesEndRef} />
//           </div>

//           <form
//             onSubmit={handleSend}
//             className="p-6 border-t border-red-300 flex gap-4 bg-white"
//           >
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Nhập tin nhắn..."
//               className="flex-1 border border-red-400 rounded-2xl px-5 py-3 text-base text-red-900 placeholder-red-400 focus:outline-none focus:ring-4 focus:ring-red-700 transition"
//             />
//             <button
//               type="submit"
//               className="bg-red-700 hover:bg-red-800 text-white px-7 py-3 rounded-2xl font-semibold transition shadow-lg"
//             >
//               Gửi
//             </button>
//           </form>
//         </div>
//       )}

//       <button
//         onClick={() => setIsOpen(true)}
//         className="bg-red-700 text-white px-7 py-5 rounded-full shadow-xl hover:bg-red-800 transition font-semibold flex items-center gap-4 text-xl"
//         aria-label="Mở khung chat"
//       >
//         <MessageCircle />
//         Hỏi đáp
//       </button>
//     </div>
//   );
// };

// export default ChatWidget;
import React, { useState } from "react";
import { X, MessageCircle } from "lucide-react";

// Danh sách API key Gemini, thay bằng 100 key thật của bạn
const GEMINI_API_KEYS = [
  "AIzaSyAfZGDOZ__3Pgu7S5l0OItOEJiBSIF3Gmk",
  "AIzaSyANgWR4LY5yqiSbvtNt7KXwHysxmuUf7Mc",
  "AIzaSyBG3HckkIYKbY2rgksbAw17q6x5XBWerJw",
  "AIzaSyBR4ayNBhsqkMD4kCvCa8HMnfhgT0dlsm4",
  "AIzaSyD9IEKVTudnTNUnXfXY0ULMNmNhEZ0nLTg",
];

// Hàm gọi Gemini, thử lần lượt các key cho đến khi thành công hoặc hết key
async function askGemini(message: string): Promise<string> {
  let lastError = "";
  for (const key of GEMINI_API_KEYS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `Bạn là trợ lý AI tư vấn khóa học tiếng Trung cho học viên Việt Nam và bạn trả lời các câu hỏi 1 cách ngắn gọn không dùng ** cho in đậm mà dùng " thay cho **, đầu các ý dùng - thay cho *.\nCâu hỏi: ${message}` },
                ],
              },
            ],
          }),
        }
      );
      const data = await res.json();
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
      if (data?.error?.message) {
        lastError = data.error.message;
        // Nếu lỗi quota hoặc key hết hạn thì thử key tiếp theo
        if (lastError.includes("exceeded") || lastError.includes("quota") || lastError.includes("API key not valid") || lastError.includes("API key expired")) {
          continue;
        }
        // Nếu lỗi khác thì trả về luôn
        return `Lỗi Gemini API: ${data.error.message}`;
      }
    } catch (err: any) {
      lastError = err?.message || String(err);
      continue;
    }
  }
  return lastError ? `Lỗi Gemini API: ${lastError}` : "Xin lỗi, tôi chưa có câu trả lời.";
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);
    try {
      const aiMsg = await askGemini(userMsg);
      setMessages((prev) => [...prev, { role: "ai", content: aiMsg }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", content: "Xin lỗi, tôi không thể trả lời lúc này." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-8 z-50 flex flex-col items-end space-y-5">
      {/* Chat box */}
      {isOpen && (
        <div className="bg-white w-[400px] h-[520px] rounded-3xl shadow-3xl flex flex-col border border-red-500 overflow-hidden">
          {/* Header */}
          <div className="bg-red-800 text-white p-6 flex justify-between items-center font-bold text-xl tracking-wide rounded-t-3xl shadow-lg">
            <span>Hỗ trợ AI tiếng Trung</span>
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
            {messages.length === 0 && <p className="italic text-red-500">Xin chào! Bạn cần tư vấn khóa học tiếng Trung nào?</p>}
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right mb-2" : "text-left mb-2"}>
                <span className={m.role === "user" ? "bg-red-100 px-3 py-2 rounded-2xl inline-block" : "bg-gray-200 px-3 py-2 rounded-2xl inline-block"}>
                  {m.content}
                </span>
              </div>
            ))}
            {loading && <div className="text-red-400 italic">AI đang trả lời...</div>}
          </div>

          {/* Input area */}
          <form
            onSubmit={handleSend}
            className="p-6 border-t border-red-300 flex gap-4 bg-white"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Nhập câu hỏi về khóa học..."
              className="flex-1 border border-red-400 rounded-2xl px-5 py-3 text-base text-red-900 placeholder-red-400 focus:outline-none focus:ring-4 focus:ring-red-700 transition"
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-red-700 hover:bg-red-800 text-white px-7 py-3 rounded-2xl font-semibold transition shadow-lg"
              disabled={loading}
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
        Hỏi đáp AI
      </button>
    </div>
  );
};

export default ChatWidget;
