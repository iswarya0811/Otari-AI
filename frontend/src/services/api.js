import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // 5 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Checks the status of the backend by calling GET /
 * @returns {Promise<{status: string, message: string}>}
 */
export const checkBackendStatus = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error('Backend status check failed:', error.message);
    throw error;
  }
};

export default api;
