import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Update this to your backend server IP address
// For local development, use your computer's IP address
const API_BASE_URL = 'http://192.168.1.100:3000'; // Change this to your server IP

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Service
export const apiService = {
  // Auth endpoints
  async login(username, password) {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.user) {
      await AsyncStorage.setItem('fitmonCurrentUser', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async signup(userData) {
    const response = await api.post('/auth/signup', userData);
    if (response.data.user) {
      await AsyncStorage.setItem('fitmonCurrentUser', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async logout() {
    await AsyncStorage.removeItem('fitmonCurrentUser');
  },

  async getCurrentUser() {
    const userStr = await AsyncStorage.getItem('fitmonCurrentUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Workout endpoints
  async getWorkouts() {
    const response = await api.get('/workouts');
    return response.data;
  },

  async getWorkoutById(id) {
    const response = await api.get(`/workouts/${id}`);
    return response.data;
  },

  async searchWorkouts(query) {
    const response = await api.get('/workouts/search', { params: { q: query } });
    return response.data;
  },

  // User progress endpoints
  async getUserProgress(userId) {
    const response = await api.get(`/progress/${userId}`);
    return response.data;
  },

  async saveProgress(userId, progressData) {
    const response = await api.post(`/progress/${userId}`, progressData);
    return response.data;
  },
};

export default apiService;
