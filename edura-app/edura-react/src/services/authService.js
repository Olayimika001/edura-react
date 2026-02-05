import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const API_URL = `${API_BASE_URL}/auth`;

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Login user
const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user from token
const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

// Get token
const getToken = () => {
  return localStorage.getItem('token');
};

// Check if user is authenticated
const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

// Refresh token
const refreshToken = async () => {
  const response = await axios.post(`${API_URL}/refresh`, {
    token: getToken()
  });
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getToken,
  isAuthenticated,
  refreshToken
};

export default authService;