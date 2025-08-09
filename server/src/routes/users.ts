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

// Sync user activities from Strava
router.post('/sync-activities', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await userService.findById(req.user!.id);
    if (!user || !user.stravaAccessToken) {
      return res.status(404).json({ success: false, error: 'User or Strava token not found' });
    }

    // Get activities from Strava (last 30 days for initial sync)
    const thirtyDaysAgo = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60);
    const stravaActivities = await stravaService.getActivities(user.stravaAccessToken, thirtyDaysAgo);

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