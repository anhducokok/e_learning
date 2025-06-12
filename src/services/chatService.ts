// services/chatService.ts
import axios from 'axios';
import type { ChatMessage } from '../../src/contexts/ChatContext';

export const chatService = {
  async fetchHistory(user1: string, user2: string): Promise<ChatMessage[]> {
    const res = await axios.get(
      `http://localhost:3212/chat/history?userA=${user1}&userB=${user2}`
    );    if (res.data.success) {
      return res.data.data;
    } else {
      return [];
    }
  },
};
