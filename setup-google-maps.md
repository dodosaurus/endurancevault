# Setting Up Google Maps API for Route Thumbnails

## Quick Setup (5 minutes)

### 1. Get Free Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Maps Static API"
4. Create API Key in "Credentials"
5. Free tier: 28,000 requests/month (plenty for your app)

### 2. Add to Environment
```bash
# Add to server/.env
GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 3. Switch to Real Maps
In `server/src/services/activityService.ts`, uncomment this:

```typescript
generateMapThumbnailUrl(polyline: string, size = '200x120'): string {
  if (!polyline || !process.env.GOOGLE_MAPS_API_KEY) {
    return '';
  }
  
  return `https://maps.googleapis.com/maps/api/staticmap?size=${size}&path=color:0xff6b35ff|weight:3|enc:${polyline}&key=${process.env.GOOGLE_MAPS_API_KEY}&maptype=roadmap&format=png`;
}
```

### Result
You'll get beautiful route thumbnails showing actual GPS tracks on real maps!

---

**For now, the icon-based approach works great and looks professional.** You can add real maps anytime later.