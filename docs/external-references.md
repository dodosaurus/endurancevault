# External Documentation References

## Strava API Documentation

### Official Strava Developer Resources
- **Main Documentation**: https://developers.strava.com/docs/
- **Authentication Guide**: https://developers.strava.com/docs/authentication/
- **API Reference**: https://developers.strava.com/docs/reference/

### Key Authentication Findings
From our implementation and testing with Strava API:

#### Token Expiration
- **Access tokens expire after 6 hours** (shorter than most OAuth providers)
- **Refresh tokens are single-use** - each refresh returns a new refresh token
- Must always save both new access token AND new refresh token

#### Rate Limits
- **100 requests per 15 minutes per application**
- **1000 requests per day per application**
- Rate limits are per application, not per user

#### OAuth Flow
- Uses standard OAuth 2.0 with authorization code flow
- Scopes required: `read,activity:read` for basic activity access
- Callback URL must match exactly what's registered in Strava app settings

### Implementation Notes
Our system implements automatic token refresh with:
- **Proactive refresh**: 5-minute buffer before token expiry
- **Reactive refresh**: Retry on 401 Unauthorized responses
- **Database persistence**: Always save new refresh tokens immediately

## React Native / Expo Documentation

### Authentication with Expo
- **AuthSession**: https://docs.expo.dev/guides/authentication/
- **SecureStore**: https://docs.expo.dev/versions/latest/sdk/securestore/
- **Deep Linking**: https://docs.expo.dev/guides/linking/

### Development Build Requirements
- **Development builds needed for OAuth**: Expo Go cannot handle custom URL schemes
- **EAS Build**: https://docs.expo.dev/develop/development-builds/introduction/

## Database & Backend

### Prisma ORM
- **Authentication patterns**: https://www.prisma.io/docs/concepts/components/prisma-client/crud
- **PostgreSQL with Supabase**: https://supabase.com/docs/guides/database/overview

### JWT Tokens
- **Node.js JWT library**: https://github.com/auth0/node-jsonwebtoken
- **Best practices**: https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/

## Security References

### OAuth 2.0 Security
- **RFC 6749 - OAuth 2.0**: https://datatracker.ietf.org/doc/html/rfc6749
- **OAuth Security Best Practices**: https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics

### Token Storage
- **Mobile token storage**: https://auth0.com/docs/secure/tokens/token-storage
- **Expo SecureStore security**: https://docs.expo.dev/versions/latest/sdk/securestore/#security

## Testing & Development

### API Testing
- **Postman collections for OAuth**: https://learning.postman.com/docs/sending-requests/authorization/
- **curl examples for token refresh**: documented in our implementation

### Mobile Development
- **React Native debugging**: https://reactnative.dev/docs/debugging
- **Expo development workflow**: https://docs.expo.dev/develop/development-builds/use-development-builds/

---

*This document tracks external resources used during development and serves as a reference for future maintenance and updates.*