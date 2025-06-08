import { useState, useEffect } from "react";
import { useChat } from "../contexts/ChatContext";
import type { ChatMessage } from "../contexts/ChatContext";
import { useAuth } from "../contexts/AuthContext";

export default function ChatBox() {
  const { messages, sendMessage } = useChat();
  const { isAuthenticated, user } = useAuth();

  // Nếu chưa đăng nhập thì không hiển thị chat box
  if (!isAuthenticated || !user?.id) return null;

  const [receiverId, setReceiverId] = useState("");
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<ChatMessage[]>([]);

  // Lấy lịch sử chat giữa user.id và receiverId từ server
  useEffect(() => {
    if (!receiverId) {
      setHistory([]);
      return;
    }
    fetch(`/chat/history?userA=${user.id}&userB=${receiverId}`)
      .then((res) => res.json())
      .then((data) => {
        // Debug log để kiểm tra dữ liệu trả về
        console.log("Lịch sử chat API trả về:", data);
        setHistory(Array.isArray(data?.data) ? data.data : []);
      })
      .catch(() => setHistory([]));
  }, [receiverId, user.id]);

  // Tin nhắn realtime (chỉ hiển thị khi đang chat)
  const chatMessages = receiverId ? messages[receiverId] ?? [] : [];

  const handleSend = () => {
    if (!input.trim() || !receiverId) return;
    sendMessage(receiverId, input);
    setInput("");
  };

  // Gộp lịch sử và tin nhắn realtime, loại trùng theo id nếu có
  const allMessages = [
    ...history,
    ...chatMessages.filter((m) => !history.some((h) => h.id === m.id)),
  ];
  allMessages.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className="p-4 border w-80">
      <div className="mb-2">
        <input
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          placeholder="Nhập ID người nhận"
          className="border px-2 py-1 w-full mb-2"
        />
      </div>
      <div className="h-48 overflow-y-auto bg-gray-100 mb-2 p-2">
        {allMessages.length === 0 && (
          <div className="text-gray-400">Chưa có tin nhắn nào</div>
        )}
        {allMessages.map((m, i) => (
          <div key={m.id || i}>
            <b>{m.senderId === user.id ? "You" : m.senderId}:</b> {m.content}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Type a message"
        className="border px-2 py-1 w-full"
      />
    </div>
  );
}
