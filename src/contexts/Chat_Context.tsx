import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface ChatContextType {
  socket: Socket | null;
}

const ChatContext = createContext<ChatContextType>({ socket: null });

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3212", {
      withCredentials: true,
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return <ChatContext.Provider value={{ socket }}>{children}</ChatContext.Provider>;
};

export const useChat = () => useContext(ChatContext);
