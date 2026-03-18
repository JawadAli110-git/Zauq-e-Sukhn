import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // 10 second timeout
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optionally redirect to login, but don't do it here to avoid multiple redirects
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access denied: You do not have permission for this action');
    }
    
    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('Resource not found');
    }
    
    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error('Server error: Please try again later');
    }
    
    // Handle timeout
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout: The server took too long to respond');
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error: Unable to reach the server');
    }
    
    return Promise.reject(error);
  }
);

export default api;
