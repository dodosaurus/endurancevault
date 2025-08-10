import { Router } from 'express';
import { StravaService } from '../services/stravaService';
import { UserService } from '../services/userService';

const router = Router();
const stravaService = new StravaService();
const userService = new UserService();

// Get Strava auth URL
router.get('/strava/url', (req, res) => {
  try {
    const authUrl = stravaService.generateAuthUrl();
    res.json({ success: true, data: { authUrl } });
  } catch (error) {
    console.error('Error generating Strava auth URL:', error);
    res.status(500).json({ success: false, error: 'Failed to generate auth URL' });
  }
});

// Strava OAuth callback endpoint
router.get('/strava/callback', async (req, res) => {
  try {
    const { code, error } = req.query;

    if (error) {
      return res.status(400).json({ success: false, error: 'Authentication was denied' });
    }

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ success: false, error: 'Authorization code is required' });
    }

    // Exchange code for access token
    const tokenData = await stravaService.exchangeCodeForToken(code);

    // Create or update user
    const userData = {
      stravaId: tokenData.athlete.id.toString(),
      stravaAccessToken: tokenData.access_token,
      stravaRefreshToken: tokenData.refresh_token,
      tokenExpiresAt: new Date(tokenData.expires_at * 1000),
      firstName: tokenData.athlete.firstname,
      lastName: tokenData.athlete.lastname,
      profilePictureUrl: tokenData.athlete.profile,
      country: tokenData.athlete.country,
      state: tokenData.athlete.state,
      city: tokenData.athlete.city,
    };

    const user = await userService.createOrUpdateUser(userData);

    // Generate JWT for the app
    const token = userService.generateJWT(user.id);

    // Redirect to mobile app with token
    res.redirect(`endurancevault://auth?token=${token}`);
  } catch (error) {
    console.error('Strava auth callback error:', error);
    res.status(500).json({ success: false, error: 'Authentication failed' });
  }
});

export default router;