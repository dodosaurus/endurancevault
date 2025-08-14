# Local Development Setup

## Prerequisites

### Required Software
- **Node.js**: v18+ (LTS recommended)
- **npm**: v9+ (comes with Node.js)
- **Git**: Latest version
- **Expo CLI**: For mobile development
- **Strava Account**: For testing authentication

### Optional Tools
- **PostgreSQL**: For local database (alternative to Supabase)
- **Postman**: For API testing
- **VS Code**: Recommended editor with extensions
- **iOS Simulator/Android Emulator**: For mobile testing

## Initial Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd endurancevault
```

### 2. Environment Configuration
Create environment files with your credentials:

#### Root .env
```bash
# Database (Supabase)
DATABASE_URL=pgbouncer=true
DIRECT_URL=

# Strava API
STRAVA_CLIENT_ID=your_strava_client_id
STRAVA_CLIENT_SECRET=your_strava_client_secret
STRAVA_REDIRECT_URI=http://localhost:3000/api/auth/strava/callback

# Security
JWT_SECRET=your_secure_jwt_secret_here
```

#### server/.env
```bash
# Same as root .env
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
STRAVA_CLIENT_ID=your_strava_client_id
STRAVA_CLIENT_SECRET=your_strava_client_secret
STRAVA_REDIRECT_URI=http://localhost:3000/api/auth/strava/callback
JWT_SECRET=your_secure_jwt_secret_here
```

#### mobile/.env
```bash
STRAVA_CLIENT_ID=your_strava_client_id
API_BASE_URL=http://localhost:3000
```

### 3. Strava API Setup
1. Go to [Strava Developers](https://developers.strava.com/)
2. Create new application
3. Set Authorization Callback Domain to: `localhost`
4. Copy Client ID and Client Secret to .env files

### 4. Supabase Setup
1. Create account at [Supabase](https://supabase.com/)
2. Create new project
3. Go to Settings → Database → Connection string
4. Copy connection strings to .env files

## Backend Setup

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Database Migration
```bash
# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed database with World Tour cyclists (2025 collection)
npx tsx prisma/seed-cards-worldtour.ts
```

### 3. Start Development Server
```bash
npm run dev
```

Server should start on `http://localhost:3000`

### 4. Verify Backend
```bash
# Test health endpoint
curl http://localhost:3000/health

# Test auth URL generation
curl http://localhost:3000/api/auth/strava/url
```

## Mobile App Setup

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. Install Expo CLI (if not installed)
```bash
npm install -g @expo/cli
```

### 3. Start Development Server

**Note**: There's a known issue with file watchers on macOS. Try these solutions:

#### Option A: Increase File Limits
```bash
# Increase system file limits (requires password)
echo kern.maxfiles=65536 | sudo tee -a /etc/sysctl.conf
echo kern.maxfilesperproc=32768 | sudo tee -a /etc/sysctl.conf
sudo sysctl -w kern.maxfiles=65536
sudo sysctl -w kern.maxfilesperproc=32768

# Then start with increased ulimit
ulimit -n 4096 && npm start
```

#### Option B: Use Tunnel Mode
```bash
# Start with tunnel (works around file watcher issues)
npx expo start --tunnel
```

#### Option C: Use Device/Simulator Only
```bash
# Start for iOS simulator
npx expo start --ios

# Start for Android emulator  
npx expo start --android
```

### 4. Test Mobile App
1. Install Expo Go on your phone
2. Scan QR code from terminal
3. Or use iOS Simulator/Android Emulator

## Development Workflow

### Backend Development
```bash
cd server

# Start development server with auto-reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm run start

# Database operations
npx prisma db push          # Push schema changes
npx prisma generate         # Generate client
npx prisma studio          # Open database viewer
```

### Mobile Development
```bash
cd mobile

# Start Expo development server
npm start

# Start for specific platform
npx expo start --ios
npx expo start --android
npx expo start --web

# Build for production
npm run build
```

### Database Management
```bash
cd server

# View database in browser
npx prisma studio

# Reset database (careful!)
npx prisma db push --force-reset

# Generate seed data (future)
npm run db:seed
```

## Testing the Full Flow

### 1. Backend API Testing
```bash
# Health check
curl http://localhost:3000/health

# Get Strava auth URL
curl http://localhost:3000/api/auth/strava/url

# Copy the returned authUrl and open in browser to test OAuth
```

### 2. Mobile App Testing
1. Open mobile app in Expo Go
2. Tap "Connect with Strava"
3. Complete OAuth flow in browser
4. App should redirect back and show authenticated state
5. Test activity sync functionality

### 3. Database Verification
```bash
# Open Prisma Studio
cd server && npx prisma studio

# Check that user was created after OAuth
# Verify activity sync creates records
# Check currency transactions
```

## Common Issues & Solutions

### File Watcher Errors (EMFILE)
**Symptoms**: `Error: EMFILE: too many open files, watch`

**Solutions**:
1. Increase system file limits (see commands above)
2. Use tunnel mode: `npx expo start --tunnel`
3. Use device-specific commands instead of `npm start`

### Database Connection Issues
**Symptoms**: Prisma connection errors

**Solutions**:
1. Verify DATABASE_URL is correct
2. Check Supabase project is active
3. Ensure IP is whitelisted in Supabase
4. Test connection with `npx prisma studio`

### Strava OAuth Issues
**Symptoms**: Authentication redirects fail

**Solutions**:
1. Verify STRAVA_CLIENT_ID matches app registration
2. Check redirect URI is exactly: `http://localhost:3000/api/auth/strava/callback`
3. Ensure Strava app has correct Authorization Callback Domain: `localhost`

### Mobile App Deep Linking
**Symptoms**: Auth redirect doesn't return to app

**Solutions**:
1. Ensure `app.config.js` has correct scheme: `endurancevault`
2. Test in Expo Go app (not web browser)
3. Check mobile/.env has correct API_BASE_URL

## Development Tools

### Recommended VS Code Extensions
```json
{
  "recommendations": [
    "prisma.prisma",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "expo.vscode-expo-tools"
  ]
}
```

### Useful Scripts
```bash
# Backend
cd server
npm run dev     # Development with auto-reload
npm run build   # Build TypeScript
npm run test    # Run tests (future)

# Mobile  
cd mobile
npm start       # Start Expo dev server
npm run build   # Build for production
npm run test    # Run tests (future)
```

### Database Browser
Access Prisma Studio: `http://localhost:5555` (when running `npx prisma studio`)

## Next Steps
Once local development is working:
1. Review [API Documentation](../api/) for endpoint details
2. Check [Features Documentation](../features/) for implementation details
3. See [Mobile App Structure](../mobile/app-structure.md) for component organization
4. Plan [Production Deployment](./production.md) when ready