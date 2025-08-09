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

  async getActivities(accessToken: string, after?: number, perPage = 30): Promise<StravaActivity[]> {
    const params = new URLSearchParams({
      per_page: perPage.toString(),
    });
    
    if (after) {
      params.append('after', after.toString());
    }

    const response = await axios.get(`https://www.strava.com/api/v3/athlete/activities?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return response.data;
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