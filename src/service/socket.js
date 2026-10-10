import { io } from 'socket.io-client';

// Configuração do socket.io-client para uso futuro com o backend
// const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
// export const socket = io(SOCKET_URL, {
//   autoConnect: false,
// });

// Aqui teremos os métodos para interagir com o backend
export const SocketService = {
  connect: () => {
    // socket.connect();
    console.log('[Socket] Connected to server (mock)');
  },
  
  disconnect: () => {
    // socket.disconnect();
    console.log('[Socket] Disconnected from server (mock)');
  },
  
  createMatch: () => {
    console.log('[Socket] Emitting create_match');
    // socket.emit('create_match');
  },
  
  joinMatch: (matchId) => {
    console.log('[Socket] Emitting join_match', matchId);
    // socket.emit('join_match', matchId);
  },
  
  makeMove: (matchId, moveIndex) => {
    console.log('[Socket] Emitting make_move', { matchId, moveIndex });
    // socket.emit('make_move', { matchId, moveIndex });
  }
};
