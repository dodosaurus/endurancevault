# Endurance Vault - Project Documentation

## Overview
A companion mobile app for Strava users that gamifies fitness activities through a collectible card system featuring legendary athletes. Users earn in-app currency based on their activities and use it to purchase booster packs.

## 📚 Complete Documentation
See `/docs/` folder for comprehensive modular documentation:
- [System Overview](./docs/architecture/system-overview.md)
- [Features Documentation](./docs/features/)
- [API Reference](./docs/api/)
- [Mobile App Structure](./docs/mobile/)
- [Database Schema](./docs/database/schema.md)
- [Local Development Setup](./docs/deployment/local-development.md)

## Tech Stack

### Frontend (Mobile)
- **Framework**: React Native with Expo (managed workflow)
- **Navigation**: React Navigation
- **State Management**: React Context/Redux Toolkit
- **UI Library**: NativeBase or React Native Elements
- **Authentication**: Expo AuthSession for Strava OAuth

### Backend
- **Server**: Express.js with TypeScript
- **ORM**: Prisma
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Strava OAuth integration
- **File Storage**: Supabase Storage (for card images)

### APIs & Services
- **Strava API**: Activity data and user authentication
- **Supabase**: Database, real-time subscriptions, storage
- **Push Notifications**: Expo Notifications (future feature)

## Project Structure

```
endurancevault/
├── mobile/                 # React Native/Expo app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── screens/        # App screens
│   │   ├── services/       # API calls, Strava integration
│   │   ├── store/          # State management
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Helper functions
│   ├── app.config.js
│   └── package.json
├── server/                 # Express.js backend
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth, validation
│   │   ├── types/          # Shared TypeScript types
│   │   └── utils/          # Helper functions
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
└── .env                    # Environment variables
```

## Card Collection System

### Theme: Legendary Athletes
- **Total Cards**: 100 cards featuring legendary athletes from various sports
- **Rarity Distribution**:
  - Common (50 cards): Regional/national champions
  - Uncommon (30 cards - Green): Olympic medalists, major tournament winners
  - Rare (15 cards - Blue): Hall of famers, record holders  
  - Epic (4 cards - Purple): Modern legends (Jordan, Serena, Messi, etc.)
  - Legendary (1 card - Orange): Ultimate GOAT card

### Booster System
- **Cost**: 100 coins per booster pack
- **Contents**: 3 common cards + 1 card with rarity chances
- **Rarity Chances**: 70% common, 20% uncommon, 7% rare, 2.5% epic, 0.5% legendary
- **Reroll Mechanism**: Trade 3 cards of same rarity for 1 random card (chance for higher rarity)

## Currency System

### Activity-Based Rewards
- **Base Rate**: 10 coins per kilometer
- **Activity Multipliers**:
  - Walking/Hiking: 1x (10 coins/km)
  - Running: 2x (20 coins/km)
  - Cycling: 0.5x (5 coins/km)

### New User Bonus
- Initial signup bonus: 500 coins (5 booster packs)
- Retroactive calculation for last week's activities

## Database Schema

### Core Tables
- `users`: Strava user data, currency balance
- `cards`: Card definitions (athlete info, rarity, image URL)
- `user_cards`: User's card collection with quantities
- `activities`: Cached Strava activity data
- `transactions`: Currency earning/spending history

## Development Commands

### Mobile App
```bash
cd mobile
npm install
npm start          # Start Expo development server
npm run build      # Build for production
npm run test       # Run tests
```

### Backend Server  
```bash
cd server
npm install
npm run dev        # Start development server
npm run build      # Build TypeScript
npm run start      # Start production server
npx prisma generate # Generate Prisma client
npx prisma db push  # Push schema to database
npm run test       # Run tests
```

## Environment Variables (.env)

### Strava API
- `STRAVA_CLIENT_ID`: Strava application client ID
- `STRAVA_CLIENT_SECRET`: Strava application client secret
- `STRAVA_REDIRECT_URI`: OAuth redirect URI

### Supabase
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_KEY`: Supabase service role key (backend only)

### App Configuration
- `NODE_ENV`: development | production
- `PORT`: Server port (default: 3000)
- `JWT_SECRET`: JWT signing secret

### Activity Map Thumbnails (Optional)
- Uses free OpenStreetMap-based service (no API key required)
- Alternative: `GOOGLE_MAPS_API_KEY` for Google Maps Static API

## Development Phases

### Phase 1: Core Setup
1. Initialize Expo app and Express server
2. Set up Supabase database and Prisma schema
3. Implement Strava OAuth authentication
4. Create basic UI structure

### Phase 2: Card System
1. Design and implement card collection database
2. Create booster opening mechanics
3. Build card collection viewer UI
4. Implement currency earning from activities

### Phase 3: Enhanced Features  
1. Add reroll/trading mechanics
2. Implement progress tracking and leaderboards
3. Add push notifications for new activities
4. Optimize performance and add caching

### Phase 4: Advanced Features
1. Real-time activity detection via Strava webhooks
2. Social features and friend comparisons
3. Additional activity types support
4. Advanced card trading between users

## 🚀 Current Status

### ✅ Completed
- **Backend API**: Express.js server with complete Strava OAuth integration
- **Database**: Supabase PostgreSQL with comprehensive schema via Prisma
- **Authentication**: Full Strava OAuth flow with JWT tokens and automatic token refresh
- **Activity Sync**: Distance-based currency calculation system
- **Activity Display**: Recent activities list with map thumbnails (GPS route visualization)
- **Mobile App**: React Native/Expo with navigation and API integration
- **Documentation**: Modular feature-based documentation structure

### 🔄 In Progress
- **Booster System**: Backend API implemented, mobile UI pending
- **Card Collection**: Database schema ready, mobile UI pending

### 📋 Future Features
- Real-time activity detection via Strava webhooks
- Push notifications for new activities
- Card trading and reroll mechanics
- Social features and leaderboards

## Notes

- Activities are synced manually when user opens the app (v1)
- Card images will use placeholder/royalty-free images initially
- All monetary transactions are virtual (in-app currency only)
- Mobile app file watcher issues on macOS (see docs for solutions)