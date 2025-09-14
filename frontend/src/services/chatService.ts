import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const chatService = {
  async getOnlineUsers() {
    try {
      const response = await api.get('/users/online');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error obteniendo usuarios online');
    }
  },

  async getMessages(userId: string, page = 1, limit = 50) {
    try {
      const response = await api.get(`/chat/messages/${userId}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error obteniendo mensajes');
    }
  },

  async getConversations() {
    try {
      const response = await api.get('/chat/conversations');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error obteniendo conversaciones');
    }
  }
};
