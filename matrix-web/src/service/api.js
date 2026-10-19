const rawApiUrl = import.meta.env.VITE_API_URL;
const API_BASE_URL = (rawApiUrl !== undefined && rawApiUrl !== null && rawApiUrl.trim() !== '')
  ? rawApiUrl.replace(/\/$/, '')
  : '/api';

export const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('matrix_token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    };

    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${path}`;

    const config = {
      ...options,
      headers
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Se houver lista de erros de validação por campo, prioriza as mensagens detalhadas
        const detailMessage = data.errors && data.errors.length > 0
          ? data.errors.map((e) => e.message).join(' | ')
          : data.message;

        const error = new Error(detailMessage || 'Erro na requisição com o servidor');
        error.data = data;
        error.errors = data.errors;
        throw error;
      }

      return data;
    } catch (err) {
      console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, err.message);
      throw err;
    }
  },

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  },

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  },

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  },

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
};

export default api;
