import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
});

// Token management
export const setAuthToken = async (token: string) => {
  await SecureStore.setItemAsync('auth_token', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const getAuthToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync('auth_token');
};

export const clearAuthToken = async () => {
  await SecureStore.deleteItemAsync('auth_token');
  delete api.defaults.headers.common['Authorization'];
};

// Initialize token on app start
export const initializeAuth = async () => {
  const token = await getAuthToken();
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// API Response types
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Auth endpoints
export const authApi = {
  getStravaAuthUrl: async (): Promise<{ authUrl: string }> => {
    const response = await api.get<ApiResponse<{ authUrl: string }>>('/auth/strava/url');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to get auth URL');
    }
    return response.data.data;
  },
};

// User endpoints
export const userApi = {
  getProfile: async () => {
    const response = await api.get<ApiResponse<{
      id: number;
      stravaId: string;
      firstName: string;
      lastName: string;
      profilePictureUrl?: string;
      currency: number;
      totalScore: number;
      country?: string;
      state?: string;
      city?: string;
    }>>('/users/profile');
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to get profile');
    }
    return response.data.data;
  },

  syncActivities: async () => {
    const response = await api.post<ApiResponse<{
      activitiesProcessed: number;
      currencyEarned: number;
      activities: any[];
    }>>('/users/sync-activities');
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to sync activities');
    }
    return response.data.data;
  },

  getRecentActivities: async (limit: number = 5) => {
    const response = await api.get<ApiResponse<{
      id: number;
      name: string;
      activityType: string;
      distance: number;
      duration: number;
      startDate: string;
      currencyEarned: number;
      mapThumbnailUrl?: string;
    }[]>>(`/users/activities?limit=${limit}`);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to get activities');
    }
    return response.data.data;
  },
};

export default api;