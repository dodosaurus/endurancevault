# Authentication System

## Overview
Endurance Vault uses Strava OAuth 2.0 for user authentication, providing seamless integration with users' existing Strava accounts.

## Authentication Flow

### 1. Strava OAuth Setup
```typescript
// Environment variables required
STRAVA_CLIENT_ID=112442
STRAVA_CLIENT_SECRET=your_secret_here
STRAVA_REDIRECT_URI=http://localhost:3000/api/auth/strava/callback
```

### 2. Mobile App Authentication Flow
```
User taps "Connect with Strava"
        ↓
App requests auth URL from backend
        ↓
App opens Strava OAuth in browser
        ↓
User authorizes in Strava
        ↓
Strava redirects to backend callback
        ↓
Backend exchanges code for tokens
        ↓
Backend creates/updates user record
        ↓
Backend redirects to app with JWT token
        ↓
App stores JWT and fetches user profile
```

## Implementation Details

### Backend Routes
```typescript
// Get Strava auth URL
GET /api/auth/strava/url
Response: { success: true, data: { authUrl: string } }

// Handle OAuth callback
GET /api/auth/strava/callback?code=xxx&mobile=true
Response: Redirects to endurancevault://auth?token=jwt_token
```

### Mobile Deep Linking
```typescript
// App scheme configuration
scheme: "endurancevault"

// Deep link handler
endurancevault://auth?token=jwt_token
```

### Token Management
```typescript
// JWT token structure
{
  userId: number,
  iat: timestamp,
  exp: timestamp (30 days)
}

// Mobile token storage
- Stored in Expo SecureStore
- Automatically added to API headers
- Cleared on logout
```

## User Data Stored

### From Strava OAuth Response
```typescript
interface StravaAthlete {
  id: number;           // Strava user ID
  firstname: string;    // First name
  lastname: string;     // Last name  
  profile: string;      // Profile image URL
  country: string;      // Country code
  state: string;        // State/region
  city: string;         // City
}
```

### In Database
```sql
users table:
- strava_id (unique)
- strava_access_token (for API calls)
- strava_refresh_token (for token renewal)
- token_expires_at
- first_name, last_name
- profile_picture_url
- country, state, city
- currency (starts at 500)
```

## Security Features

### Token Security
- Strava tokens stored securely in database
- JWT tokens have 30-day expiration
- Mobile app uses SecureStore for token persistence
- Refresh tokens allow seamless re-authentication

### API Protection
```typescript
// Auth middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = await User.findById(decoded.userId);
  next();
}
```

## Error Handling

### Common Scenarios
1. **User denies authorization**: Return error message
2. **Invalid/expired tokens**: Redirect to re-authentication
3. **Network failures**: Retry mechanism with user feedback
4. **Invalid JWT**: Clear stored token and redirect to login

### Mobile App Error States
```typescript
// AuthContext handles these states:
- isLoading: boolean
- user: User | null
- error: string | null
```

## Strava Token Refresh System

### Token Expiration
**Critical Discovery**: Strava access tokens expire after **6 hours** (not the typical 24+ hours of other OAuth providers).

### Automatic Token Refresh Implementation
Our system implements automatic token refresh to handle Strava's short token expiration:

#### 1. Proactive Refresh
```typescript
// Check if token expires within 5 minutes
const now = new Date();
const expiresWithBuffer = new Date(tokenExpiresAt.getTime() - 5 * 60 * 1000);

if (now >= expiresWithBuffer) {
  // Refresh token proactively
  const newTokenData = await stravaService.refreshToken(refreshToken);
  await userService.updateStravaTokens(userId, newTokenData);
}
```

#### 2. Reactive Refresh
```typescript
try {
  return await stravaService.getActivities(accessToken);
} catch (error) {
  if (error.response?.status === 401) {
    // Token expired, refresh and retry
    const newTokenData = await stravaService.refreshToken(refreshToken);
    await userService.updateStravaTokens(userId, newTokenData);
    return await stravaService.getActivities(newTokenData.access_token);
  }
}
```

#### 3. Token Refresh Process
```typescript
// POST https://www.strava.com/oauth/token
{
  client_id: STRAVA_CLIENT_ID,
  client_secret: STRAVA_CLIENT_SECRET,
  grant_type: 'refresh_token',
  refresh_token: current_refresh_token
}

// Response includes NEW refresh token
{
  access_token: "new_access_token",
  refresh_token: "new_refresh_token", // IMPORTANT: Always different
  expires_at: timestamp
}
```

#### 4. Critical Implementation Details
- **Refresh tokens are single-use**: Each refresh gives a new refresh token
- **Always save both tokens**: Access token AND new refresh token must be saved immediately
- **5-minute buffer**: Refresh proactively to prevent mid-request expiration
- **Retry logic**: Handle race conditions with automatic retry on 401 errors

#### 5. Database Updates
```typescript
async updateStravaTokens(userId: number, accessToken: string, refreshToken: string, expiresAt: Date) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      stravaAccessToken: accessToken,
      stravaRefreshToken: refreshToken, // New refresh token from response
      tokenExpiresAt: expiresAt,
    },
  });
}
```

### Usage in API Endpoints
```typescript
// Activity sync with automatic token refresh
const stravaActivities = await stravaService.getActivitiesWithRefresh(
  user.stravaAccessToken,
  user.stravaRefreshToken,
  user.tokenExpiresAt,
  async (newTokenData) => {
    await userService.updateStravaTokens(
      user.id,
      newTokenData.access_token,
      newTokenData.refresh_token,
      new Date(newTokenData.expires_at * 1000)
    );
  }
);
```

## References

### Official Strava Documentation
- [Strava Authentication Guide](https://developers.strava.com/docs/authentication/)
- Key findings:
  - Access tokens expire after 6 hours
  - Refresh tokens are single-use and always change
  - Rate limits: 100 requests per 15 minutes, 1000 requests per day

## Future Enhancements
- ✅ Token refresh mechanism (implemented)
- Remember device functionality  
- Social login options (Apple, Google)
- Two-factor authentication