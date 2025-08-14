import { CardRarity, ActivityType, TransactionType } from '@prisma/client';

export interface StravaTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete: StravaAthlete;
}

export interface StravaAthlete {
  id: number;
  firstname: string;
  lastname: string;
  profile: string;
  country: string;
  state: string;
  city: string;
}

export interface StravaActivity {
  id: number;
  name: string;
  type: string;
  distance: number;
  moving_time: number;
  start_date: string;
  map?: {
    id: string;
    summary_polyline?: string;
    resource_state: number;
  };
}

export interface CreateUserData {
  stravaId: string;
  stravaAccessToken: string;
  stravaRefreshToken: string;
  tokenExpiresAt: Date;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
  country?: string;
  state?: string;
  city?: string;
}

export interface CurrencyCalculation {
  distance: number; // in meters
  activityType: ActivityType;
  currencyEarned: number;
}

export interface BoosterContents {
  cards: Array<{
    id: number;
    name: string;
    rarity: CardRarity;
  }>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}