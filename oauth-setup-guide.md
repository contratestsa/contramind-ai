# OAuth Setup Guide for ContraMind.ai

## Overview
This guide helps you configure OAuth providers (Google and Microsoft) to work with ContraMind.ai across multiple domains.

## Important URLs
- **Custom Domain**: https://contramind.ai
- **Replit Domain**: https://8103ac6b-c2ec-453b-b704-b562d25d30d7-00-1ntd620e4kt76.spock.replit.dev
- **Replit Deployment Domain**: https://ai-language-bridge-ceo-ContraMind.replit.app

## Google OAuth Configuration

### 1. Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Select your project or create a new one
- Navigate to "APIs & Services" > "Credentials"

### 2. Configure OAuth 2.0 Client
- Click on your OAuth 2.0 Client ID
- Add ALL of these Authorized redirect URIs:
  ```
  https://contramind.ai/api/auth/google/callback
  https://8103ac6b-c2ec-453b-b704-b562d25d30d7-00-1ntd620e4kt76.spock.replit.dev/api/auth/google/callback
  https://ai-language-bridge-ceo-ContraMind.replit.app/api/auth/google/callback
  http://localhost:5000/api/auth/google/callback
  ```
- Save the changes

## Microsoft OAuth Configuration

### 1. Go to Azure Portal
- Visit: https://portal.azure.com/
- Navigate to "Azure Active Directory" > "App registrations"
- Select your application

### 2. Configure Redirect URIs
- Go to "Authentication" section
- Under "Platform configurations" > "Web"
- Add ALL of these Redirect URIs:
  ```
  https://contramind.ai/api/auth/microsoft/callback
  https://8103ac6b-c2ec-453b-b704-b562d25d30d7-00-1ntd620e4kt76.spock.replit.dev/api/auth/microsoft/callback
  https://ai-language-bridge-ceo-ContraMind.replit.app/api/auth/microsoft/callback
  http://localhost:5000/api/auth/microsoft/callback
  ```
- Save the changes

## Why Multiple URLs?
- **contramind.ai**: Your custom domain
- **Replit Dev Domain**: Development environment
- **Replit App Domain**: Deployed application
- **localhost**: Local development

## Current Configuration
The app is configured to:
1. Use contramind.ai as the primary OAuth callback URL
2. Redirect to /dashboard after successful authentication
3. Preserve the domain you're accessing from

## Troubleshooting
If OAuth redirect to "coming soon" page:
1. Verify all redirect URIs are added to OAuth providers
2. Clear browser cookies and try again
3. Check browser console for specific error messages

## Note
Once configured, you won't need to change these settings again unless:
- You change your custom domain
- You create a new Replit deployment
- You regenerate OAuth credentials