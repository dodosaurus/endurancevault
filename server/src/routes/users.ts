import { Router } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { UserService } from '../services/userService';
import { StravaService } from '../services/stravaService';
import { ActivityService } from '../services/activityService';

const router = Router();
const userService = new UserService();
const stravaService = new StravaService();
const activityService = new ActivityService();

// Get user profile
router.get('/profile', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await userService.findById(req.user!.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        stravaId: user.stravaId,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePictureUrl: user.profilePictureUrl,
        currency: user.currency,
        totalScore: user.totalScore,
        country: user.country,
        state: user.state,
        city: user.city,
      },
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ success: false, error: 'Failed to get profile' });
  }
});

// Get user's recent activities
router.get('/activities', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const activities = await activityService.getUserActivities(req.user!.id, limit);

    res.json({
      success: true,
      data: activities.map(activity => ({
        id: activity.id,
        name: activity.name,
        activityType: activity.type,
        distance: activity.distance,
        duration: activity.duration,
        startDate: activity.startDate,
        currencyEarned: activity.currencyEarned,
        mapThumbnailUrl: activity.summaryPolyline 
          ? activityService.generateMapThumbnailUrl(activity.summaryPolyline, '300x180')
          : null,
      })),
    });
  } catch (error) {
    console.error('Error getting user activities:', error);
    res.status(500).json({ success: false, error: 'Failed to get activities' });
  }
});

// Sync user activities from Strava
router.post('/sync-activities', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await userService.findById(req.user!.id);
    if (!user || !user.stravaAccessToken || !user.stravaRefreshToken || !user.tokenExpiresAt) {
      return res.status(404).json({ success: false, error: 'User or Strava token not found' });
    }

    // Get activities from Strava (last 30 days for initial sync) with automatic token refresh
    const thirtyDaysAgo = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60);
    const stravaActivities = await stravaService.getActivitiesWithRefresh(
      user.stravaAccessToken,
      user.stravaRefreshToken,
      user.tokenExpiresAt,
      async (newTokenData) => {
        // Update the user's tokens in the database
        await userService.updateStravaTokens(
          user.id,
          newTokenData.access_token,
          newTokenData.refresh_token,
          new Date(newTokenData.expires_at * 1000)
        );
      },
      thirtyDaysAgo
    );

    let totalCurrencyEarned = 0;
    const processedActivities = [];

    for (const activity of stravaActivities) {
      // Check if we already have this activity
      const existingActivity = await activityService.findByStravaId(activity.id.toString());
      if (existingActivity) continue;

      // Calculate currency for this activity
      const currencyEarned = activityService.calculateCurrency(
        activity.distance,
        activity.type
      );

      // Save activity
      const savedActivity = await activityService.createActivity({
        userId: user.id,
        stravaActivityId: activity.id.toString(),
        name: activity.name,
        type: activityService.mapActivityType(activity.type),
        distance: activity.distance,
        duration: activity.moving_time,
        startDate: new Date(activity.start_date),
        currencyEarned,
        summaryPolyline: activity.map?.summary_polyline,
      });

      totalCurrencyEarned += currencyEarned;
      processedActivities.push(savedActivity);
    }

    // Update user currency if any new activities were processed
    if (totalCurrencyEarned > 0) {
      await userService.updateCurrency(user.id, totalCurrencyEarned);
      
      // Create transaction record
      await activityService.createTransaction({
        userId: user.id,
        type: 'EARNED_ACTIVITY',
        amount: totalCurrencyEarned,
        description: `Earned from ${processedActivities.length} activities`,
      });
    }

    res.json({
      success: true,
      data: {
        activitiesProcessed: processedActivities.length,
        currencyEarned: totalCurrencyEarned,
        activities: processedActivities,
      },
    });
  } catch (error) {
    console.error('Error syncing activities:', error);
    res.status(500).json({ success: false, error: 'Failed to sync activities' });
  }
});

export default router;