# 🏃‍♂️ Endurance Vault

> **Gamify your fitness journey with legendary athlete cards**

A companion mobile app for Strava users that transforms your workouts into an exciting collectible card game. Earn currency from your activities and collect cards featuring 135 World Tour cyclists.

## ⚡ Key Features

- **🔗 Strava Integration**: Seamless OAuth authentication and activity sync
- **💰 Distance-Based Rewards**: Earn coins for every kilometer (running: 2x, cycling: 0.5x, walking: 1x)
- **🎴 World Tour Cards**: 135 professional cyclists across 5 rarity tiers (Common → Legendary)
- **📦 Booster Packs**: Open packs with guaranteed rarity distributions
- **📱 Mobile-First**: React Native app with smooth UX

## 🎯 How It Works

1. Connect your Strava account
2. Activities automatically sync and generate coins
3. Purchase booster packs (100 coins each)
4. Collect World Tour cyclists: Pogačar, Vingegaard, van der Poel & more
5. Build your ultimate cycling card collection

## 🏗️ Tech Stack

**Mobile**: React Native + Expo, React Navigation, Context API  
**Backend**: Express.js + TypeScript, Prisma ORM  
**Database**: Supabase (PostgreSQL)  
**APIs**: Strava API, JWT authentication

## 🚀 Quick Start

```bash
# Backend
cd server && npm install && npm run dev

# Mobile  
cd mobile && npm install && npm start
```

Requires Strava API credentials and Supabase setup. See [docs/deployment/local-development.md](./docs/deployment/local-development.md) for full setup.

## 📊 Current Status

✅ Backend API with Strava OAuth  
✅ Activity sync & currency system  
✅ Database schema & card system  
✅ Mobile app structure  
🚧 Booster UI & card collection screens

## 📖 Documentation

Comprehensive docs in [`/docs/`](./docs/) covering architecture, features, API endpoints, and deployment.

---

*Transform your fitness data into an engaging cycling card collection experience*