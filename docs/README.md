# Endurance Vault Documentation

## Project Overview
A companion mobile app for Strava users that gamifies fitness activities through a collectible card system featuring World Tour cyclists.

## Documentation Structure

### Architecture
- [System Overview](./architecture/system-overview.md) - High-level architecture and tech stack

### Features
- [Authentication System](./features/authentication.md) - Strava OAuth integration
- [Activity Sync](./features/activity-sync.md) - Activity import and currency calculation
- [Activity Maps](./features/activity-maps.md) - GPS route visualization
- [Card Collection System](./features/card-collection.md) - Legendary athlete cards and rarities
- [Booster Pack System](./features/booster-packs.md) - Pack opening mechanics
- [Currency System](./features/currency-system.md) - Earning and spending mechanics

### API Documentation
- [Authentication Endpoints](./api/authentication.md) - Auth routes and flows

### Mobile App
- [App Structure](./mobile/app-structure.md) - Navigation and screens

### Database
- [Schema Documentation](./database/schema.md) - Detailed table descriptions

### Deployment
- [Local Development](./deployment/local-development.md) - Setup instructions

## Quick Start
1. Follow [Local Development](./deployment/local-development.md) setup
2. Review [System Overview](./architecture/system-overview.md) for architecture
3. Check [Authentication System](./features/authentication.md) for Strava integration
4. Explore the complete [Features Documentation](./features/) for system details

## Current Status
- ✅ Backend server with Express.js + Prisma + Supabase
- ✅ Complete Strava OAuth authentication flow
- ✅ Activity syncing with currency calculation and GPS map thumbnails
- ✅ Database schema for users, cards, activities, transactions, booster mechanics
- ✅ Mobile app with React Native/Expo and complete navigation
- ✅ Booster pack system with opening mechanics and animated UI
- ✅ Card collection display with filtering, sorting, and detailed modal
- ✅ Shop screen with booster purchasing functionality
- ✅ User profile management and theme switching
- ✅ **World Tour Cyclist Collection (Aug 2025)**: 135 professional cyclists with detailed achievements
- 🚧 Real-time activity sync via Strava webhooks (future)
- 🚧 Push notifications (future)
- 🚧 Card trading and social features (future)

## Recent Updates
- **August 2025**: Major collection migration to World Tour cyclists ([Migration Log](./migration-log.md))