# Electron Desktop App Authentication

## Overview
The desktop app uses the same authentication system as the web app, leveraging session cookies from the Express backend.

## Architecture
- **AuthManager** (auth.js): Handles authentication logic in the main process
- **Preload API**: Exposes auth methods to the renderer process
- **Session-based**: Uses connect.sid cookie from Express sessions

## API Methods

### From Renderer Process (Frontend)
```javascript
// Check if user is authenticated
const { authenticated } = await window.electronAPI.auth.check();

// Open login page in browser
await window.electronAPI.auth.login();

// Clear session and logout
await window.electronAPI.auth.logout();
```

## How It Works
1. **Authentication Check**: Looks for valid session cookie from the web app
2. **Login**: Opens the web login page in the default browser
3. **Session Sharing**: Desktop app shares cookies with the web app running on localhost:5000
4. **Logout**: Clears all session data and cookies

## Usage Example
```javascript
// In your React component
useEffect(() => {
  const checkAuth = async () => {
    if (window.electronAPI) {
      const { authenticated } = await window.electronAPI.auth.check();
      if (!authenticated) {
        // Show login prompt or redirect
      }
    }
  };
  checkAuth();
}, []);
```

## Security Notes
- Authentication is handled by the existing Passport.js setup
- Desktop app doesn't store credentials directly
- All auth operations go through IPC with whitelisted channels
- Session cookies are isolated to the app's context