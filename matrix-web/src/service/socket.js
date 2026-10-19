import { io } from 'socket.io-client';

const rawSocketUrl = import.meta.env.VITE_SOCKET_URL;
// Se não especificado ou se for '/', conecta à mesma origem da página atual via proxy do Vite
const SOCKET_SERVER_URL = (rawSocketUrl && rawSocketUrl !== '/' && rawSocketUrl.trim() !== '')
  ? rawSocketUrl
  : undefined;

export const socket = io(SOCKET_SERVER_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000
});

export const SocketService = {
  connect: (userData) => {
    if (!socket.connected) {
      socket.connect();
    }
    if (userData) {
      socket.emit('register_presence', userData);
    }
  },

  disconnect: () => {
    if (socket.connected) {
      socket.disconnect();
    }
  },

  createMatch: (userData) => {
    socket.emit('create_match', userData);
  },

  joinMatch: (matchId, userData) => {
    socket.emit('join_match', { matchId, user: userData });
  },

  sendInvite: (targetUserId, targetUsername) => {
    socket.emit('send_invite', { targetUserId, targetUsername });
  },

  cancelInvite: (matchId, targetUserId) => {
    socket.emit('cancel_invite', { matchId, targetUserId });
  },

  acceptInvite: (matchId) => {
    socket.emit('accept_invite', { matchId });
  },

  declineInvite: (matchId, senderId) => {
    socket.emit('decline_invite', { matchId, senderId });
  },

  makeMove: (matchId, moveIndex, userId) => {
    socket.emit('make_move', { matchId, moveIndex, userId });
  },

  surrender: (matchId, userId) => {
    socket.emit('surrender', { matchId, userId });
  },

  requestRematch: (matchId) => {
    socket.emit('request_rematch', { matchId });
  },

  acceptRematch: (matchId) => {
    socket.emit('accept_rematch', { matchId });
  },

  leaveMatch: (matchId) => {
    socket.emit('leave_match', { matchId });
  },

  requestOnlineUsers: () => {
    socket.emit('get_online_users');
  }
};

export default SocketService;
