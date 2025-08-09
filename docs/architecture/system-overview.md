# System Overview

## Architecture Diagram
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │  Backend API    │    │    Supabase     │
│  (React Native) │◄──►│   (Express.js)  │◄──►│  (PostgreSQL)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Strava API    │    │     Prisma      │    │   File Storage  │
│     (OAuth)     │    │      (ORM)      │    │    (Images)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Tech Stack

### Frontend (Mobile)
- **Framework**: React Native with Expo (managed workflow)
- **Navigation**: React Navigation v6
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Authentication**: Expo AuthSession + Deep Linking
- **Storage**: Expo SecureStore (for JWT tokens)

### Backend
- **Server**: Express.js with TypeScript
- **ORM**: Prisma
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT tokens
- **File Uploads**: Supabase Storage

### External Services
- **Strava API**: Activity data and user authentication
- **Supabase**: 
  - PostgreSQL database
  - Real-time subscriptions (future)
  - File storage for card images

## Key Features

### Core Functionality
1. **Strava Integration**: OAuth authentication and activity import
2. **Currency System**: Distance-based rewards with activity multipliers
3. **Card Collection**: 100 legendary athlete cards with 5 rarity tiers
4. **Booster Packs**: Randomized card packs with guaranteed rarities
5. **Collection Progress**: Score tracking and collection completion

### Data Flow
1. User authenticates via Strava OAuth
2. Activities are synced from Strava API
3. Currency is calculated based on distance and activity type
4. Users purchase booster packs with earned currency
5. Cards are randomly generated based on rarity probabilities
6. Collection progress is tracked and scored

## Security Considerations
- JWT tokens for API authentication
- Secure storage of sensitive tokens on mobile
- Environment variables for API keys
- Input validation on all endpoints
- Rate limiting (future implementation)

## Scalability
- Database optimized with proper indexing
- API designed for horizontal scaling
- Mobile app uses efficient React patterns
- Caching strategies for frequently accessed data