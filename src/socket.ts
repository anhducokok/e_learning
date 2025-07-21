import { io } from 'socket.io-client';
import { getSocketUrl, SOCKET_CONFIG } from './config/constants';

// Only initialize socket if chat is enabled
const initializeSocket = () => {
  if (import.meta.env.VITE_ENABLE_CHAT === 'false') {
    console.log('Socket.io disabled via feature flag');
    return null;
  }

  return io(getSocketUrl(), {
    query: { userId: localStorage.getItem('userId') },
    withCredentials: SOCKET_CONFIG.WITH_CREDENTIALS,
  });
};

const socket = initializeSocket();

export default socket;
