# Endurance Vault Documentation

## Project Overview
A companion mobile app for Strava users that gamifies fitness activities through a collectible card system featuring legendary athletes.

## Documentation Structure

### Architecture
- [System Overview](./architecture/system-overview.md) - High-level architecture and tech stack
- [Database Design](./architecture/database-design.md) - Database schema and relationships
- [API Structure](./architecture/api-structure.md) - Backend API organization

### Features
- [Authentication System](./features/authentication.md) - Strava OAuth integration
- [Activity Sync](./features/activity-sync.md) - Activity import and currency calculation
- [Card Collection System](./features/card-collection.md) - Legendary athlete cards and rarities
- [Booster Pack System](./features/booster-packs.md) - Pack opening mechanics
- [Currency System](./features/currency-system.md) - Earning and spending mechanics
- [User Management](./features/user-management.md) - User profiles and data

### API Documentation
- [Authentication Endpoints](./api/authentication.md) - Auth routes and flows
- [User Endpoints](./api/users.md) - User profile and activity sync
- [Card Endpoints](./api/cards.md) - Card collection and management
- [Booster Endpoints](./api/boosters.md) - Booster pack operations

### Mobile App
- [App Structure](./mobile/app-structure.md) - Navigation and screens
- [State Management](./mobile/state-management.md) - Context and data flow
- [UI Components](./mobile/ui-components.md) - Reusable components
- [Deep Linking](./mobile/deep-linking.md) - Authentication flow

### Database
- [Schema Documentation](./database/schema.md) - Detailed table descriptions
- [Migrations](./database/migrations.md) - Database setup and changes
- [Seed Data](./database/seed-data.md) - Initial card collection data

### Deployment
- [Environment Setup](./deployment/environment.md) - Required environment variables
- [Local Development](./deployment/local-development.md) - Setup instructions
- [Production Deployment](./deployment/production.md) - Deployment guidelines

## Quick Start
1. Follow [Local Development](./deployment/local-development.md) setup
2. Review [System Overview](./architecture/system-overview.md) for architecture
3. Check [Authentication System](./features/authentication.md) for Strava integration
4. See [API Documentation](./api/) for endpoint details

## Current Status
- ✅ Backend server with Express.js + Prisma + Supabase
- ✅ Complete Strava OAuth authentication flow
- ✅ Activity syncing with currency calculation
- ✅ Database schema for users, cards, activities, transactions
- ✅ Mobile app structure with React Native/Expo
- 🚧 Card collection UI and booster mechanics (planned)
- 🚧 Push notifications (future)