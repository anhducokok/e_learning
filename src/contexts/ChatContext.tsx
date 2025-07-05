import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { getSocketUrl, SOCKET_CONFIG } from '../config/constants';

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

interface ChatContextType {
  messages: Record<string, ChatMessage[]>;
  sendMessage: (receiverId: string, content: string) => void;
  currentUserId: string;
  openChats: string[];
  toggleChat: (userId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const currentUserId = user?.id || '';
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [openChats, setOpenChats] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!currentUserId || socketRef.current) return;

    const socket = io(getSocketUrl(), {
      withCredentials: SOCKET_CONFIG.WITH_CREDENTIALS,
    });
    socketRef.current = socket;

    socket.on('message', (message: ChatMessage) => {
      const otherUserId =
        message.senderId === currentUserId ? message.receiverId : message.senderId;
      setMessages(prev => ({
        ...prev,
        [otherUserId]: [...(prev[otherUserId] || []), message],
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUserId]);

  const sendMessage = (receiverId: string, content: string) => {
    const socket = socketRef.current;
    if (!socket || !currentUserId) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUserId,
      receiverId,
      content,
      createdAt: new Date().toISOString(),
    };

    // Emit to server
    socket.emit('newMessage', message);

    // // Optimistic UI update
    // setMessages(prev => ({
    //   ...prev,
    //   [receiverId]: [...(prev[receiverId] || []), message],
    // }));
  };

  const toggleChat = (userId: string) => {
    setOpenChats(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  return (
    <ChatContext.Provider
      value={{ messages, sendMessage, currentUserId, openChats, toggleChat }}
    >
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
