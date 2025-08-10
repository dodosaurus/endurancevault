# Activity Map Thumbnails

## Overview
The activity map thumbnails feature displays miniature route visualizations for GPS-enabled activities, providing users with a visual representation of their workout routes.

## Implementation

### Data Source
- **Strava API**: Activity data includes `map.summary_polyline` - an encoded polyline representing the GPS route
- **Google Static Maps API**: Converts polylines into static map images

### Backend Architecture

#### Database Schema
```sql
activities table:
- summary_polyline: varchar (encoded polyline from Strava)
```

#### API Flow
1. **Activity Sync**: Extracts `summary_polyline` from Strava activities
2. **Storage**: Stores polyline data in database
3. **Thumbnail Generation**: Creates map URLs using Google Static Maps API
4. **API Response**: Includes `mapThumbnailUrl` in activity data

#### Map Thumbnail URL Format
```
https://maps.googleapis.com/maps/api/staticmap?
  size=200x120&
  path=color:0xff6b35ff|weight:3|enc:{polyline}&
  key={API_KEY}&
  maptype=roadmap&
  format=png
```

### Mobile App Integration

#### Activity Card Layout
```typescript
{activity.mapThumbnailUrl && (
  <Image 
    source={{ uri: activity.mapThumbnailUrl }}
    style={styles.mapThumbnail}
    resizeMode="cover"
  />
)}
```

#### Responsive Design
- Thumbnails: 80x60 pixels
- Only displayed when GPS data exists
- Positioned alongside activity information

## Configuration

### Required Environment Variables
```bash
GOOGLE_MAPS_API_KEY=your_api_key_here
```

### Google Maps API Setup
1. Enable **Maps Static API** in Google Cloud Console
2. Create API key with Maps Static API access
3. Add API key to server environment variables

## GPS Data Availability

### Activities with GPS Data
- Running, cycling, walking activities with GPS tracking
- Outdoor activities recorded with mobile apps
- Activities with route information

### Activities without GPS Data
- Treadmill runs, stationary bike sessions
- Manual activity entries
- Indoor activities without GPS
- Map thumbnail gracefully omitted

## Performance Considerations

### Caching Strategy
- Polyline data stored in database (one-time fetch)
- Map thumbnails generated on-demand via URL
- Google serves cached images for repeated requests

### API Rate Limits
- Google Static Maps: 25,000 requests per day (free tier)
- Strava API: 100 requests per 15 minutes
- Efficient polyline storage reduces repeated API calls

## Error Handling

### Missing GPS Data
```typescript
// Backend: Graceful handling of missing map data
summaryPolyline: activity.map?.summary_polyline || null

// Frontend: Conditional rendering
{activity.mapThumbnailUrl && <Image ... />}
```

### API Failures
- Missing Google Maps API key: No thumbnails displayed
- Invalid polyline data: Fallback to activity icon only
- Network errors: Image placeholder with retry capability

## Future Enhancements

### Potential Improvements
- **Interactive Maps**: Tap to view full-size route map
- **Route Analytics**: Elevation profiles, pace variation
- **Route Sharing**: Share favorite routes with other users
- **Route Recommendations**: Suggest similar routes
- **Offline Caching**: Store thumbnail images locally

### Technical Considerations
- **Map Providers**: Consider alternatives (Mapbox, OpenStreetMap)
- **Custom Styling**: Brand-specific map themes
- **Image Optimization**: WebP format, responsive sizes
- **CDN Integration**: Faster image delivery

## Troubleshooting

### No Map Thumbnails Displayed
1. Verify `GOOGLE_MAPS_API_KEY` environment variable
2. Check Google Cloud Console API quotas
3. Ensure activities have GPS data in Strava
4. Review server logs for API errors

### Poor Thumbnail Quality
1. Adjust image size in `generateMapThumbnailUrl()`
2. Modify path styling (color, weight)
3. Consider higher resolution for retina displays
4. Test different map types (terrain, satellite)

---

*This feature enhances user engagement by providing visual context for their fitness activities, making the activity list more informative and visually appealing.*