# OAuth Setup Guide for ContraMind

## Current Status
✅ Backend OAuth routes implemented (`/api/auth/google`, `/api/auth/microsoft`)
✅ Frontend buttons connected to OAuth endpoints
✅ Passport.js strategies configured
✅ Session management setup
✅ Success/failure handlers implemented

## Required OAuth Credentials

### Google OAuth Setup
1. Visit: https://console.developers.google.com
2. Create new project or select existing
3. Enable "Google+ API" or "Google Identity"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: "Web application"
6. Authorized redirect URI: `https://YOUR-REPLIT-URL.replit.app/api/auth/google/callback`

**Required Environment Variables:**
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

### Microsoft OAuth Setup
1. Visit: https://portal.azure.com
2. Search "App registrations" → "New registration"
3. Name: "ContraMind Auth"
4. Account types: "Accounts in any organizational directory and personal Microsoft accounts"
5. Redirect URI: `https://YOUR-REPLIT-URL.replit.app/api/auth/microsoft/callback`

**Required Environment Variables:**
- `MICROSOFT_CLIENT_ID`
- `MICROSOFT_CLIENT_SECRET`

## Implementation Features
- Automatic user creation on first OAuth login
- Email-based user matching for existing accounts
- Bilingual success/error notifications
- Seamless redirect flow
- Session-based authentication
- Error handling with Arabic/English messages

## Testing
Once credentials are added:
1. Click "Google" or "Microsoft" buttons in login/signup modals
2. Complete OAuth flow on provider's site
3. Redirected back to ContraMind with success notification
4. User automatically logged in and account created if new