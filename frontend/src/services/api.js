import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:5000/api' : '/api',
});

// Add a request interceptor to include the JWT token in headers
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

export default API;
