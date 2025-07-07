# Google OAuth Configuration Fix

## The Issue
You're seeing "Access blocked: This app's request is invalid" with Error 400: redirect_uri_mismatch because the redirect URI in your Google Cloud Console doesn't match what the app is using.

## How to Fix

### 1. Find Your App's Domain
Your Replit app domain is: `https://${REPLIT_DEV_DOMAIN}` (you can see this in your browser's URL bar)

### 2. Update Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to: APIs & Services → Credentials
4. Click on your OAuth 2.0 Client ID
5. In the "Authorized redirect URIs" section, add:
   ```
   https://YOUR-REPLIT-DOMAIN.replit.dev/api/auth/google/callback
   ```
   Replace `YOUR-REPLIT-DOMAIN` with your actual Replit subdomain

### 3. Common Redirect URIs to Add
Make sure you have ALL of these URIs added:
- `https://YOUR-REPLIT-DOMAIN.replit.dev/api/auth/google/callback`
- `https://YOUR-REPLIT-DOMAIN-5000.replit.dev/api/auth/google/callback` (if using port 5000)
- `http://localhost:5000/api/auth/google/callback` (for local development)

### 4. Save Changes
Click "Save" at the bottom of the OAuth client configuration page.

### 5. Wait a Few Minutes
Google OAuth changes can take 5-10 minutes to propagate.

## Important Notes
- The redirect URI must match EXACTLY (including https:// and trailing slashes)
- Replit apps use dynamic domains, so make sure to use your current domain
- If your domain changes, you'll need to update the Google Console again

## Testing
After making these changes, try signing in with Google again. The error should be resolved.