import axios from 'axios';
import { StravaTokenResponse, StravaActivity } from '../types';

export class StravaService {
  private clientId = process.env.STRAVA_CLIENT_ID;
  private clientSecret = process.env.STRAVA_CLIENT_SECRET;
  private redirectUri = process.env.STRAVA_REDIRECT_URI;

  async exchangeCodeForToken(code: string): Promise<StravaTokenResponse> {
    const response = await axios.post('https://www.strava.com/oauth/token', {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
      grant_type: 'authorization_code',
    });

    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<StravaTokenResponse> {
    const response = await axios.post('https://www.strava.com/oauth/token', {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    });

    return response.data;
  }

  async getAthlete(accessToken: string) {
    const response = await axios.get('https://www.strava.com/api/v3/athlete', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return response.data;
  }

  async getActivityStreams(accessToken: string, activityId: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://www.strava.com/api/v3/activities/${activityId}/streams`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: {
            keys: 'latlng', // We only need GPS coordinates
            key_by_type: true
          }
        }
      );
      return response.data;
    } catch (error: any) {
      // If we get a 401 Unauthorized, the token has likely expired
      if (error.response?.status === 401) {
        throw new Error('STRAVA_TOKEN_EXPIRED');
      }
      // If activity has no GPS data, Strava returns 404 - this is normal
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  generateMapThumbnailUrl(polyline: string, size = '300x180'): string {
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      return ''; // Return empty if no API key configured
    }
    
    const encodedPolyline = encodeURIComponent(polyline);
    return `https://maps.googleapis.com/maps/api/staticmap?size=${size}&path=color:0xff6b35ff|weight:3|enc:${encodedPolyline}&key=${process.env.GOOGLE_MAPS_API_KEY}&maptype=roadmap&format=png`;
  }

  async getActivities(accessToken: string, after?: number, perPage = 30): Promise<StravaActivity[]> {
    const params = new URLSearchParams({
      per_page: perPage.toString(),
    });
    
    if (after) {
      params.append('after', after.toString());
    }

    try {
      const response = await axios.get(`https://www.strava.com/api/v3/athlete/activities?${params}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data;
    } catch (error: any) {
      // If we get a 401 Unauthorized, the token has likely expired
      if (error.response?.status === 401) {
        throw new Error('STRAVA_TOKEN_EXPIRED');
      }
      throw error;
    }
  }

  async getActivitiesWithRefresh(
    accessToken: string,
    refreshToken: string,
    tokenExpiresAt: Date,
    onTokenRefresh: (newTokenData: StravaTokenResponse) => Promise<void>,
    after?: number,
    perPage = 30
  ): Promise<StravaActivity[]> {
    // Check if token is expired or will expire soon (5 minutes buffer)
    const now = new Date();
    const expiresWithBuffer = new Date(tokenExpiresAt.getTime() - 5 * 60 * 1000);
    
    let currentAccessToken = accessToken;
    
    if (now >= expiresWithBuffer) {
      // Token is expired or will expire soon, refresh it
      console.log('Token expires at:', tokenExpiresAt, 'Current time:', now, '- refreshing token');
      try {
        const newTokenData = await this.refreshToken(refreshToken);
        await onTokenRefresh(newTokenData);
        currentAccessToken = newTokenData.access_token;
        console.log('Token refreshed successfully, new expiry:', new Date(newTokenData.expires_at * 1000));
      } catch (error) {
        console.error('Failed to refresh token:', error);
        throw new Error('Failed to refresh Strava token');
      }
    }

    // Try to get activities with the (potentially refreshed) token
    try {
      return await this.getActivities(currentAccessToken, after, perPage);
    } catch (error: any) {
      // If we still get a token expired error, try refreshing once more
      if (error.message === 'STRAVA_TOKEN_EXPIRED') {
        try {
          const newTokenData = await this.refreshToken(refreshToken);
          await onTokenRefresh(newTokenData);
          return await this.getActivities(newTokenData.access_token, after, perPage);
        } catch (refreshError) {
          console.error('Failed to refresh token after 401:', refreshError);
          throw new Error('Authentication failed - please reconnect your Strava account');
        }
      }
      throw error;
    }
  }

  generateAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId!,
      redirect_uri: this.redirectUri!,
      response_type: 'code',
      scope: 'read,activity:read',
    });

    return `https://www.strava.com/oauth/authorize?${params}`;
  }
}