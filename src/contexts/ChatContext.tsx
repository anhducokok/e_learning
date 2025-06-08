// import { createContext, useContext, useEffect, useState } from "react";
// import socket from "../socket"; // Đường dẫn đúng với project bạn

// interface ChatContextType {
//   openChats: string[];
//   toggleChat: (userId: string) => void;
//   sendMessage: (receiverId: string, content: string) => void;
//   messages: Record<string, any[]>;
// }

// const ChatContext = createContext<ChatContextType | undefined>(undefined);

// export function ChatProvider({ children }: { children: React.ReactNode }) {
//   const [openChats, setOpenChats] = useState<string[]>([]);
//   const [messages, setMessages] = useState<Record<string, any[]>>({});

//   useEffect(() => {
//     socket.on("receiveMessage", (message) => {
//       setMessages((prev) => ({
//         ...prev,
//         [message.senderId]: [...(prev[message.senderId] || []), message],
//       }));
//     });
//     return () => {
//       socket.off("receiveMessage");
//     };
//   }, []);

//   const sendMessage = (receiverId: string, content: string) => {
//     const senderId = localStorage.getItem("userId");
//     const message = { senderId, receiverId, content };
//     socket.emit("sendMessage", message);

//     // Update UI immediately
//     setMessages((prev) => ({
//       ...prev,
//       [receiverId]: [...(prev[receiverId] || []), message],
//     }));
//   };

//   const toggleChat = (userId: string) => {
//     setOpenChats((prev) =>
//       prev.includes(userId)
//         ? prev.filter((id) => id !== userId)
//         : [...prev, userId]
//     );
//   };

//   return (
//     <ChatContext.Provider value={{ openChats, toggleChat, sendMessage, messages }}>
//       {children}
//     </ChatContext.Provider>
//   );
// }

// export const useChat = () => {
//   const context = useContext(ChatContext);
//   if (!context) {
//     throw new Error("useChat must be used within a ChatProvider");
//   }
//   return context;
// };

// export const useChat = () => useContext(ChatContext);
import { useEffect, useState, useContext, createContext } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from "./AuthContext";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

interface ChatContextType {
  messages: Record<string, Message[]>;
  sendMessage: (receiverId: string, content: string) => void;
  currentUserId: string;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [socket, setSocket] = useState<Socket | null>(null);

  // Lấy userId từ AuthContext
  const currentUserId = user?.id || "";

  useEffect(() => {
    if (!currentUserId) return;
    const newSocket = io('http://localhost:3212', {
      withCredentials: true,
    });
    setSocket(newSocket);

    newSocket.on('message', (message: Message) => {
      setMessages((prev) => {
        const otherUserId =
          message.senderId === currentUserId ? message.receiverId : message.senderId;

        const msgs = prev[otherUserId] || [];
        return {
          ...prev,
          [otherUserId]: [...msgs, message],
        };
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [currentUserId]);

  const sendMessage = (receiverId: string, content: string) => {
    if (!socket || !currentUserId) return;
    socket.emit('newMessage', { senderId: currentUserId, receiverId, content });
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, currentUserId }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
