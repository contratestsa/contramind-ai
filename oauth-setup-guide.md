# OAuth Setup Guide for ContraMind.ai

## Overview
This guide configures OAuth providers (Google and Microsoft) to work exclusively with ContraMind.ai.

## OAuth Configuration

### Google OAuth Configuration

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project
   - Navigate to "APIs & Services" > "Credentials"

2. **Configure OAuth 2.0 Client**
   - Click on your OAuth 2.0 Client ID
   - Add this Authorized redirect URI:
   ```
   https://contramind.ai/api/auth/google/callback
   ```
   - Save the changes

### Microsoft OAuth Configuration

1. **Go to Azure Portal**
   - Visit: https://portal.azure.com/
   - Navigate to "Azure Active Directory" > "App registrations"
   - Select your application

2. **Configure Redirect URI**
   - Go to "Authentication" section
   - Under "Platform configurations" > "Web"
   - Add this Redirect URI:
   ```
   https://contramind.ai/api/auth/microsoft/callback
   ```
   - Save the changes

## Current Configuration
The app is configured to:
1. Always use contramind.ai for OAuth callbacks
2. Redirect to /dashboard after successful authentication
3. Focus exclusively on the contramind.ai domain

## Note
The OAuth configuration is now hardcoded to use only contramind.ai. This simplifies the setup and ensures consistent behavior.