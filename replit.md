# ContraMind.ai - Legal Tech Platform

## Project Overview
A bilingual (Arabic/English) AI-powered legal technology platform specializing in contract management for the MENA region. Features a comprehensive waitlist registration system with countdown timer, real-time counter functionality, professional language switching interface, automated email confirmations, contact system, and complete customer authentication.

## Recent Changes
- **June 29, 2025**: Fixed critical React hooks errors and implemented OAuth authentication system
  - Removed Framer Motion dependencies causing React initialization conflicts
  - Fixed "Cannot read properties of null (reading 'useState')" errors
  - Replaced all motion components with standard HTML elements and CSS transitions
  - Restored application functionality without animation dependencies
  - Implemented functional Microsoft and Google OAuth authentication
  - Created OAuth backend routes (/api/auth/google, /api/auth/microsoft)
  - Added authentication success/failure toast notifications
  - Integrated Passport.js with Google and Microsoft strategies
  - Fixed logo positioning to always stay on left side regardless of language
  - Added right-text alignment for Arabic modal titles and descriptions
  - Enhanced bilingual language system with proper React patterns
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