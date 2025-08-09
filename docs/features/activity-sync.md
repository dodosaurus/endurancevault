# Activity Sync System

## Overview
The activity sync system imports user activities from Strava and converts them into in-app currency based on distance and activity type.

## Currency Calculation Formula

### Base Formula
```typescript
Currency = (Distance in KM) × Base Rate × Activity Multiplier

Base Rate: 10 coins per kilometer
```

### Activity Multipliers
```typescript
const multipliers = {
  running: 2.0,    // 20 coins/km
  cycling: 0.5,    // 5 coins/km  
  walking: 1.0,    // 10 coins/km
  hiking: 1.0,     // 10 coins/km
  other: 1.0       // 10 coins/km (default)
};
```

### Example Calculations
- **10km run**: 10 × 10 × 2.0 = **200 coins**
- **50km bike ride**: 50 × 10 × 0.5 = **250 coins**
- **5km walk**: 5 × 10 × 1.0 = **50 coins**

## Sync Process

### 1. Trigger Sync
```typescript
// Mobile app triggers sync
POST /api/users/sync-activities
Headers: Authorization: Bearer <jwt_token>
```

### 2. Fetch from Strava
```typescript
// Backend fetches activities (last 30 days)
const activities = await stravaApi.getActivities(
  accessToken, 
  thirtyDaysAgo,
  perPage: 30
);
```

### 3. Process Each Activity
```typescript
for (const activity of stravaActivities) {
  // Check if already processed
  const existing = await Activity.findByStravaId(activity.id);
  if (existing) continue;

  // Calculate currency
  const currency = calculateCurrency(activity.distance, activity.type);
  
  // Save to database
  await Activity.create({
    userId,
    stravaActivityId: activity.id,
    name: activity.name,
    type: mapActivityType(activity.type),
    distance: activity.distance, // meters
    duration: activity.moving_time, // seconds
    startDate: new Date(activity.start_date),
    currencyEarned: currency,
    processed: true
  });
}
```

### 4. Update User Balance
```typescript
// Add earned currency to user account
await User.updateCurrency(userId, totalCurrencyEarned);

// Create transaction record
await Transaction.create({
  userId,
  type: 'EARNED_ACTIVITY',
  amount: totalCurrencyEarned,
  description: `Earned from ${processedCount} activities`
});
```

## Activity Type Mapping

### Strava → App Mapping
```typescript
const mapActivityType = (stravaType: string): ActivityType => {
  const type = stravaType.toLowerCase();
  
  if (type.includes('run')) return 'RUN';
  if (type.includes('ride') || type.includes('bike')) return 'RIDE';
  if (type.includes('walk')) return 'WALK';
  if (type.includes('hike')) return 'HIKE';
  return 'OTHER';
}
```

### Supported Strava Activities
- **Running**: Run, Trail Run, Virtual Run
- **Cycling**: Ride, Mountain Bike Ride, Road Bike Ride, Virtual Ride
- **Walking**: Walk, Nordic Walk
- **Hiking**: Hike, Backpacking
- **Other**: All other activity types (swimming, yoga, etc.)

## Database Schema

### Activities Table
```sql
activities:
  id: serial primary key
  user_id: integer references users(id)
  strava_activity_id: varchar unique
  name: varchar
  activity_type: enum (RUN, RIDE, WALK, HIKE, OTHER)
  distance: float (meters)
  duration: integer (seconds)
  start_date: timestamp
  currency_earned: integer
  processed: boolean default true
  created_at: timestamp
```

### Transactions Table
```sql
transactions:
  id: serial primary key
  user_id: integer references users(id)
  type: enum (EARNED_ACTIVITY, EARNED_BONUS, SPENT_BOOSTER, SPENT_REROLL)
  amount: integer (positive for earning, negative for spending)
  description: varchar
  created_at: timestamp
```

## Sync Response Format
```typescript
interface SyncResponse {
  success: boolean;
  data: {
    activitiesProcessed: number;
    currencyEarned: number;
    activities: Activity[];
  };
}
```

## Mobile App Integration

### Sync Button Implementation
```typescript
const handleSyncActivities = async () => {
  try {
    setIsSyncing(true);
    const result = await userApi.syncActivities();
    await refreshUser(); // Update currency display
    
    Alert.alert(
      'Activities Synced!',
      `Processed ${result.activitiesProcessed} activities and earned ${result.currencyEarned} coins!`
    );
  } catch (error) {
    Alert.alert('Sync Failed', error.message);
  } finally {
    setIsSyncing(false);
  }
};
```

## Deduplication Strategy
- Activities are identified by `strava_activity_id`
- Duplicate sync attempts are ignored
- Only new activities since last sync are processed
- Prevents double-crediting currency

## Error Handling

### Common Issues
1. **Strava token expired**: Refresh token automatically
2. **Network connectivity**: Retry with exponential backoff
3. **Invalid activity data**: Skip malformed activities
4. **Database constraints**: Log errors and continue processing

### Sync Limitations
- Maximum 30 activities per sync request
- 30-day lookback window for initial sync
- Rate limited by Strava API (100 requests/15min)

## Future Enhancements
- Real-time sync via Strava webhooks
- Batch processing for large activity histories
- Activity-specific bonuses (PR detection, long distance)
- Seasonal multipliers and events