# ContraMind.ai - Legal Tech Platform

## Project Overview
A bilingual (Arabic/English) AI-powered legal technology platform specializing in contract management for the MENA region. Features a comprehensive waitlist registration system with countdown timer, real-time counter functionality, professional language switching interface, automated email confirmations, contact system, and complete customer authentication.

## Recent Changes
- **July 8, 2025**: Added GitHub integration and Google Cloud migration capabilities
  - **GitHub Integration**: Configured for read/write access to https://github.com/contramindai/contramindPoC
  - **Google Cloud Migration**: Created comprehensive migration guide and deployment configurations
    - Added Dockerfile for containerization
    - Created cloudbuild.yaml for automatic deployments from GitHub
    - Documented complete migration process including Cloud SQL setup
    - Prepared application for Cloud Run deployment with environment variable configurations
- **July 2, 2025**: Implemented comprehensive email verification system
  - **Email Verification**: Full verification workflow using Resend integration
    - Added emailVerified and verificationToken fields to user schema
    - Automatic verification email sending on signup with professional templates
    - Email verification required for login (blocks unverified users)
    - Verification route /api/auth/verify-email with secure token validation
    - OAuth users automatically verified (Google/Microsoft emails pre-trusted)
    - Bilingual verification email templates with ContraMind branding
    - Verification emails include secure 32-byte hex tokens with 24-hour expiry messaging
  - Updated authentication flow to enforce email verification
  - Enhanced user experience with clear verification requirements
- **July 1, 2025**: Successfully implemented and debugged complete OAuth authentication system
  - **Google OAuth**: Fully operational with Client ID configured
  - **Microsoft OAuth**: Fully operational after resolving configuration issues
    - Updated Microsoft Client ID: `ebe21e1e-5db3-460d-9b22-417687ce8a87`
    - Created new client secret in Azure and updated Replit Account Secrets
    - Fixed redirect URI mismatch by configuring proper URIs in Azure portal
    - Resolved Account Secrets vs App Secrets conflict in Replit
  - Configured OAuth callback routes (/api/auth/google/callback, /api/auth/microsoft/callback)
  - Added OAuth buttons to both login and signup modals with proper styling
  - Implemented secure session management with express-session
  - OAuth redirects users to /coming-soon page after successful authentication
  - Both OAuth providers properly create new users or authenticate existing ones
  - Fixed password validation minimum length (reduced to 3 characters for testing)
  - Maintained backward compatibility with email/password authentication
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
- Dashboard screens: Don't focus on specific font types or colors - keep it simple

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