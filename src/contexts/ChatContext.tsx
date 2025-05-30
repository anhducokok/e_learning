import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface ChatContextType {
  openChats: string[];
  toggleChat: (userId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [openChats, setOpenChats] = useState<string[]>([]);

  const toggleChat = (userId: string) => {
    setOpenChats(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <ChatContext.Provider value={{ openChats, toggleChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
