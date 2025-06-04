import { useChat } from "../contexts/ChatContext";

export default function MyChatWidget() {
  const chat = useChat();

  if (!chat) return null;

  const { openChats, toggleChat } = chat;

  return (
    <div className="fixed bottom-4 right-4 flex gap-4 z-[100]">
      {openChats.map((userId) => (
        <div
          key={userId}
          className="w-80 bg-white shadow-2xl rounded-2xl overflow-hidden border border-red-300 flex flex-col"
        >
          <div className="bg-red-700 text-white px-4 py-2 flex justify-between items-center rounded-t-2xl">
            <span className="font-semibold truncate max-w-[calc(100%-32px)]">{userId}</span>
            <button
              onClick={() => toggleChat(userId)}
              className="hover:text-red-300 transition text-xl font-bold"
              aria-label={`Đóng cửa sổ chat với ${userId}`}
            >
              ✖
            </button>
          </div>
          <div className="px-4 py-3 text-sm h-40 overflow-y-auto bg-red-50 text-red-900 italic">
            Tin nhắn với <span className="font-semibold">{userId}</span>
          </div>
          <input
            className="border-t border-red-200 px-4 py-2 text-sm text-red-800 outline-none focus:ring-2 focus:ring-red-600 transition"
            placeholder="Gõ tin nhắn..."
            aria-label={`Nhập tin nhắn với ${userId}`}
          />
        </div>
      ))}
    </div>
  );
}
