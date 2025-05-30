import { useChat } from "../contexts/ChatContext";

export default function MyChatWidget() {
  const chat = useChat();

  // Fallback nếu context chưa sẵn sàng
  if (!chat) return null;

  const { openChats, toggleChat } = chat;

  return (
    <div className="fixed bottom-4 right-4 flex gap-4 z-[100]">
      {openChats.map(userId => (
        <div key={userId} className="w-80 bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
          <div className="bg-red-600 text-white px-4 py-2 flex justify-between items-center">
            <span className="font-semibold">{userId}</span>
            <button onClick={() => toggleChat(userId)} className="hover:text-red-200">✖</button>
          </div>
          <div className="px-4 py-2 text-sm h-40 overflow-y-auto bg-red-50">
            <p className="text-gray-700 italic">Tin nhắn với {userId}</p>
          </div>
          <input
            className="border-t px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Gõ tin nhắn..."
          />
        </div>
      ))}
    </div>
  );
}
