import { api } from './api';

export const authService = {
  async register(username, password) {
    const res = await api.post('/auth/register', { username, password });
    if (res.data?.token) {
      localStorage.setItem('matrix_token', res.data.token);
      localStorage.setItem('matrix_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async login(username, password) {
    const res = await api.post('/auth/login', { username, password });
    if (res.data?.token) {
      localStorage.setItem('matrix_token', res.data.token);
      localStorage.setItem('matrix_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.user;
  },

  logout() {
    localStorage.removeItem('matrix_token');
    localStorage.removeItem('matrix_user');
  },

  getStoredSession() {
    const token = localStorage.getItem('matrix_token');
    const userStr = localStorage.getItem('matrix_user');
    let user = null;
    try {
      if (userStr) user = JSON.parse(userStr);
    } catch (_) {}
    return { token, user };
  }
};

export default authService;
