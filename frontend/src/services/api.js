// src/services/api.js
import axios from 'axios';

// 1. Define a URL base da nossa API (o backend)
const api = axios.create({
  baseURL: 'http://localhost:3001' // A porta do seu backend
});

// 2. Interceptor (Isto é muito útil!)
// Isso vai interceptar TODAS as requisições antes de saírem...
api.interceptors.request.use(async (config) => {
  // Pega o token do localStorage (que salvaremos no login)
  const token = localStorage.getItem('token');

  if (token) {
    // ...e se o token existir, adiciona ele no Header 'Authorization'
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;