import { api } from './api';

export const matchService = {
  async listMatches() {
    const res = await api.get('/matches');
    return res.data || [];
  },

  async createMatch(payload = {}) {
    const res = await api.post('/matches', payload);
    return res.data;
  },

  async getMatch(matchId) {
    const res = await api.get(`/matches/${matchId}`);
    return res.data;
  },

  async joinMatch(matchId, payload = {}) {
    const res = await api.post(`/matches/${matchId}/join`, payload);
    return res.data;
  },

  async makeMove(matchId, moveIndex, userId) {
    const res = await api.post(`/matches/${matchId}/move`, { moveIndex, userId });
    return res.data;
  }
};

export default matchService;
