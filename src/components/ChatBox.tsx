import React, { useEffect, useState } from "react";
import { useChat } from "../contexts/Chat_Context";

const ChatBox: React.FC = () => {
  const { socket } = useChat();
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!socket) return;

    socket.on("message", (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("message");
    };
  }, [socket]);

  const sendMessage = () => {
    if (input.trim() && socket) {
      socket.emit("message", input);
      setMessages((prev) => [...prev, input]);
      setInput("");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white border rounded shadow p-3 flex flex-col">
      <div className="flex-1 overflow-y-auto h-48 mb-2 border p-2">
        {messages.map((msg, i) => (
          <div key={i} className="mb-1 break-words">{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Nhập tin nhắn..."
        className="border p-2 mb-2 w-full rounded"
      />
      <button
        onClick={sendMessage}
        className="bg-blue-600 text-white rounded px-3 py-1 hover:bg-blue-700"
      >
        Gửi
      </button>
    </div>
  );
};

export default ChatBox;
