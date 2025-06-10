// import React, { createContext, useContext, useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";

// interface ChatContextType {
//   socket: Socket | null;
// }

// const ChatContext = createContext<ChatContextType>({ socket: null });

// export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [socket, setSocket] = useState<Socket | null>(null);

//   useEffect(() => {
//     const newSocket = io("http://localhost:3212", {
//       withCredentials: true,
//     });
//     setSocket(newSocket);

//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   return <ChatContext.Provider value={{ socket }}>{children}</ChatContext.Provider>;
// };

// export const useChat = () => useContext(ChatContext);
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

interface ChatContextType {
  socket: Socket | null;
  messages: Record<string, ChatMessage[]>;
  sendMessage: (receiverId: string, content: string) => void;
}

const ChatContext = createContext<ChatContextType>({
  socket: null,
  messages: {},
  sendMessage: () => {},
});

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});

  useEffect(() => {
    const newSocket = io("http://localhost:3212", {
      withCredentials: true,
    });

    newSocket.on("receiveMessage", (msg: ChatMessage) => {
      setMessages((prev) => {
        const receiver = msg.senderId; // Display by sender
        const existing = prev[receiver] ?? [];

        if (existing.some((m) => m.id === msg.id)) return prev;

        return {
          ...prev,
          [receiver]: [...existing, msg],
        };
      });
    });

    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = (receiverId: string, content: string) => {
    if (!socket) return;

    const message: Omit<ChatMessage, "id" | "createdAt"> = {
      senderId: socket.id ?? "unknown",
      receiverId,
      content,
    };

    socket.emit("sendMessage", message);
  };

  return (
    <ChatContext.Provider value={{ socket, messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
