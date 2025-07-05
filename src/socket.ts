import { io } from 'socket.io-client';
import { getSocketUrl, SOCKET_CONFIG } from './config/constants';

const socket = io(getSocketUrl(), {
  query: { userId: localStorage.getItem('userId') },
  withCredentials: SOCKET_CONFIG.WITH_CREDENTIALS,
});

export default socket;
