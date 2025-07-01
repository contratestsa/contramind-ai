# ContraMind.ai - Legal Tech Platform

## Project Overview
A bilingual (Arabic/English) AI-powered legal technology platform specializing in contract management for the MENA region. Features a comprehensive waitlist registration system with countdown timer, real-time counter functionality, professional language switching interface, automated email confirmations, contact system, and complete customer authentication.

## Recent Changes
- **July 1, 2025**: Verified OAuth authentication functionality
  - Google OAuth working correctly - redirects to accounts.google.com with proper client_id
  - Microsoft OAuth working correctly - redirects to login.microsoftonline.com with proper client_id
  - OAuth callback URLs properly configured for Replit domain
  - Post-login redirect to /coming-soon page implemented
  - Authentication flows fully operational for both providers
- **June 30, 2025**: Implemented Google and Microsoft OAuth authentication
  - Added Google OAuth and Microsoft OAuth authentication flows
  - Created passport configuration with OAuth strategies for both providers
  - Implemented secure session management with express-session
  - Added OAuth callback routes for successful authentication
  - Connected frontend OAuth buttons to backend authentication endpoints
  - Both login and signup modals now support Google and Microsoft authentication
  - Users can authenticate via /api/auth/google and /api/auth/microsoft
- **June 29, 2025**: Fixed React hooks errors and completed authentication system
  - Resolved "Cannot read properties of null (reading 'useState')" errors
  - Removed conflicting LanguageProvider component causing React initialization issues
  - Implemented global language manager to avoid React hooks dependencies
  - Added ContraMind design tokens to Tailwind configuration
  - Enhanced font support with Space Grotesk, Inter, and Almarai fonts
  - Simplified language switching system for better reliability
  - Fixed logo positioning to always stay on left side regardless of language
  - Added right-text alignment for Arabic modal titles and descriptions
  - Implemented absolute positioning for header logo to override RTL layout
- **June 28, 2025**: Created complete bilingual authentication system
  - Added comprehensive login and signup pages with Arabic/English support
  - Implemented backend authentication routes (/api/auth/login, /api/auth/signup)
  - Updated database schema with user authentication fields (email, fullName, createdAt)
  - Added login/signup navigation links to header with proper bilingual text
  - Enhanced user schema with email-based authentication
  - Fixed countdown timer to use fixed target date (July 18, 2025) instead of dynamic calculation

## Project Architecture

### Frontend
- React with TypeScript
- Wouter for routing (/, /login, /signup)
- TailwindCSS with custom color scheme
- Framer Motion for animations
- TanStack Query for data fetching
- Bilingual language system (Arabic/English) with browser detection

### Backend
- Express.js server
- PostgreSQL database with Drizzle ORM
- Authentication routes for signup/login
- Email service with Resend integration
- Waitlist and contact form endpoints

### Key Features
- **Authentication System**: Complete login/signup with email validation
- **Waitlist Registration**: Real-time counter, personalized confirmations
- **Countdown Timer**: Fixed launch date with live updates
- **Language System**: Browser detection defaulting Arabic browsers to Arabic
- **Email Integration**: Welcome emails for waitlist, contact confirmations
- **Responsive Design**: Mobile-first with professional Arabic/English typography

### Database Schema
- `users`: Authentication with email, username, fullName, password
- `waitlist_entries`: Registration data with timestamps
- `contact_messages`: Contact form submissions

## User Preferences
- Professional bilingual messaging with personalized user names
- Exact Arabic text matching with precision
- Consistent color scheme: light backgrounds (#f0f3f5), dark blue buttons (#0c2836)
- Privacy messaging: "We'll never share your email. Unsubscribe anytime."
- Fixed countdown timer instead of dynamic calculation

## Technical Decisions
- Browser language detection for initial language setting
- Email-based authentication instead of username-only
- Real-time waitlist counter with proper cache invalidation
- Fixed launch date (July 18, 2025) for countdown consistency
- Professional error handling with bilingual messages

## Current Status
- Authentication system fully operational
- Waitlist registration with email confirmations working
- Contact form with automated responses functional
- Countdown timer displaying correct time until launch
- All pages responsive and bilingual