import axios from 'axios';
/*
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json'
  }
});*/

const apiClient = axios.create({
  baseURL: '/api', //Directs all API calls to /api
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Send np_access SSO cookie with all requests
});

// Add token to requests if it exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    throw error;
  }
);

export default apiClient;
