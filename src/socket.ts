import { io } from 'socket.io-client';

const socket = io('http://localhost:3212', {
  query: { userId: localStorage.getItem('userId') },
  withCredentials: true,
});

export default socket;
