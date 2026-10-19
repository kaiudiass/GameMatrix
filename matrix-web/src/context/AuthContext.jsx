import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../service/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore stored session on mount
  useEffect(() => {
    const { token: savedToken, user: savedUser } = authService.getStoredSession();
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);

      // Verify token in background
      authService.getMe()
        .then((fetchedUser) => {
          if (fetchedUser) setUser(fetchedUser);
        })
        .catch(() => {
          // Token expired or invalid
          authService.logout();
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const data = await authService.login(username, password);
    setUser(data.user);
    setToken(data.token);
    return data;
  };

  const register = async (username, password) => {
    const data = await authService.register(username, password);
    setUser(data.user);
    setToken(data.token);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}

export default AuthContext;
