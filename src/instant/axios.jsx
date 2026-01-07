import axios from 'axios';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: 'https://backend-urbancompany-1.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor - token add karne ke liye
axiosInstance.interceptors.request.use(
  (config) => {
    // ✅ FIX: 'authToken' use karo localStorage se (consistent naming)
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // ✅ FIXED: token variable use karo
      console.log('🔑 Token added to request:', token.substring(0, 20) + '...');
    } else {
      console.log('⚠️ No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - error handling ke liye
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server ne response diya but error hai
      const { status, data } = error.response;
      
      console.error('❌ Response error:', status, data);
      
      // ✅ 401 Unauthorized - token invalid/expired
      if (status === 401) {
        console.log('🔓 Token expired/invalid, clearing localStorage');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.dispatchEvent(new CustomEvent('userLoggedOut'));
        return Promise.reject('Session expired. Please login again.');
      }
      
      // Error message return karo
      return Promise.reject(data.message || 'Something went wrong');
    } else if (error.request) {
      // Request bheja but response nahi aaya
      console.error('❌ Network error:', error.request);
      return Promise.reject('Network error. Please check your connection.');
    } else {
      // Kuch aur error
      console.error('❌ Error:', error.message);
      return Promise.reject(error.message || 'Something went wrong');
    }
  }
);

export default axiosInstance;