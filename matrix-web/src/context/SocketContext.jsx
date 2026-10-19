import React, { createContext, useContext, useState, useEffect } from 'react';
import { socket, SocketService } from '../service/socket';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      SocketService.connect(user);
    } else {
      SocketService.disconnect();
      setIsConnected(false);
      setOnlineUsers([]);
    }

    const onConnect = () => {
      setIsConnected(true);
      if (user) {
        socket.emit('register_presence', user);
      }
      SocketService.requestOnlineUsers();
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('online_users_updated', onOnlineUsers);
    socket.on('online_users_list', onOnlineUsers);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('online_users_updated', onOnlineUsers);
      socket.off('online_users_list', onOnlineUsers);
    };
  }, [isAuthenticated, user]);

  const value = {
    socket,
    isConnected,
    onlineUsers,
    requestOnlineUsers: SocketService.requestOnlineUsers
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket deve ser utilizado dentro de um SocketProvider');
  }
  return context;
}

export default SocketContext;
