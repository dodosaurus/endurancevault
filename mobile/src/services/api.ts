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

// Card types
export interface Card {
  id: number;
  name: string;
  sport: string;
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  imageUrl?: string;
  description?: string;
  nationality?: string;
  birthYear?: number;
  baseScore: number;
  owned?: {
    quantity: number;
    obtainedAt: string;
  } | null;
}

export interface CollectionStats {
  totalCards: number;
  uniqueCards: number;
  collectionScore: number;
  rarityBreakdown: {
    [key in 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY']: {
      owned: number;
      total: number;
    };
  };
}

export interface BoosterPackContents {
  cards: Array<Card & { isNew: boolean }>;
  totalValue: number;
  rarityBreakdown: { [key: string]: number };
}

// Card endpoints
export const cardApi = {
  getAllCards: async (filters?: {
    rarity?: string;
    sport?: string;
    name?: string;
    nationality?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    cards: Card[];
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> => {
    const params = new URLSearchParams();
    if (filters?.rarity) params.append('rarity', filters.rarity);
    if (filters?.sport) params.append('sport', filters.sport);
    if (filters?.name) params.append('name', filters.name);
    if (filters?.nationality) params.append('nationality', filters.nationality);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get<ApiResponse<{
      cards: Card[];
      pagination: any;
    }>>(`/cards?${params.toString()}`);

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to get cards');
    }
    return response.data.data;
  },

  getUserCollection: async (filters?: {
    rarity?: string;
    sport?: string;
    name?: string;
    nationality?: string;
    owned?: boolean;
  }): Promise<{
    collection: Card[];
    stats: CollectionStats;
  }> => {
    const params = new URLSearchParams();
    if (filters?.rarity) params.append('rarity', filters.rarity);
    if (filters?.sport) params.append('sport', filters.sport);
    if (filters?.name) params.append('name', filters.name);
    if (filters?.nationality) params.append('nationality', filters.nationality);
    if (filters?.owned) params.append('owned', filters.owned.toString());

    const response = await api.get<ApiResponse<{
      collection: Card[];
      stats: CollectionStats;
    }>>(`/cards/collection?${params.toString()}`);

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to get user collection');
    }
    return response.data.data;
  },

  getCollectionStats: async (): Promise<{
    userStats: CollectionStats;
    availableCards: Array<{
      rarity: string;
      count: number;
    }>;
  }> => {
    const response = await api.get<ApiResponse<{
      userStats: CollectionStats;
      availableCards: Array<{
        rarity: string;
        count: number;
      }>;
    }>>('/cards/stats');

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to get collection stats');
    }
    return response.data.data;
  },

  getCard: async (cardId: number): Promise<Card> => {
    const response = await api.get<ApiResponse<Card>>(`/cards/${cardId}`);

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to get card');
    }
    return response.data.data;
  },
};

// Booster endpoints
export const boosterApi = {
  openBoosterPack: async (): Promise<{
    success: boolean;
    boosterOpen: {
      id: number;
      cost: number;
      openedAt: string;
    };
    contents: BoosterPackContents;
    userStats: {
      currency: number;
      totalCards: number;
      uniqueCards: number;
      collectionScore: number;
    };
  }> => {
    const response = await api.post('/boosters/open');
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to open booster pack');
    }
    return response.data;
  },

  getBoosterHistory: async (page: number = 1, limit: number = 20): Promise<{
    boosters: Array<{
      id: number;
      cost: number;
      openedAt: string;
      cards: Card[];
      totalValue: number;
      rarityBreakdown: { [key: string]: number };
    }>;
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> => {
    const response = await api.get<ApiResponse<{
      boosters: any[];
      pagination: any;
    }>>(`/boosters/history?page=${page}&limit=${limit}`);

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to get booster history');
    }
    return response.data.data;
  },

  getBoosterStats: async (): Promise<{
    totalBoostersOpened: number;
    totalCurrencySpent: number;
    averageCostPerBooster: number;
  }> => {
    const response = await api.get<ApiResponse<{
      totalBoostersOpened: number;
      totalCurrencySpent: number;
      averageCostPerBooster: number;
    }>>('/boosters/stats');

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to get booster stats');
    }
    return response.data.data;
  },
};

export default api;