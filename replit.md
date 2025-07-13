# ContraMind.ai - Legal Tech Platform

## Project Overview
A bilingual (Arabic/English) AI-powered legal technology platform specializing in contract management for the MENA region. Features a comprehensive waitlist registration system with countdown timer, real-time counter functionality, professional language switching interface, automated email confirmations, contact system, and complete customer authentication.

## Recent Changes
- **July 13, 2025**:
  - **Complete Dashboard Redesign**: Redesigned entire dashboard to match ChatGPT interface style
    - Created narrow sidebar (260px) with dark background (#202123)
    - Main content area with background #343541 (matching GPT dark theme)
    - Personalized welcome message showing user's first name
    - Contract list shows risk indicators (🟢 Low / 🟡 Medium / 🔴 High) and dates
    - Fixed bottom input bar with background #40414F and border #565869
    - Token balance displayed subtly with 🪙 icon
    - Example cards with minimal design (white bg, arrow →)
    - Upload button with transparent bg and border styling
    - Input field integrated into fixed bottom bar design
    - Messages area with proper padding for fixed input
    - Mobile responsive with collapsible sidebar
  - **Authentication Fix**: Fixed missing login route in server/routes.ts
    - Added complete login endpoint with email verification check
    - Verified user emails in database for testing
  - **Sidebar Simplification**: Removed old dashboard navigation from settings pages
    - Updated PersonalSettings and OrganizationSettings to use simplified sidebar
    - Removed complex navigation items (Dashboard, Create, My Drive, Alerts, Tasks, Reports)
    - Settings pages now only show: Back to Dashboard, Personal/Organization Settings toggle, and Help
    - Settings and Help icons in main dashboard now navigate directly to their respective pages
    - Activated attach file icon in chat bar to trigger upload modal functionality
- **July 10, 2025**: 
  - **Logo Update**: Updated all dashboard pages with new ContraMind logo
    - Replaced old CMYK logo with new RGB logo (RGB_Logo Design - ContraMind V001-01)
    - Logo now takes full width of sidebar (200px) with no padding
    - Updated logo in all pages: Dashboard, Repository, Tasks, PersonalSettings, OrganizationSettings, Chat, Help, AnalysisProgress, and AnalysisResults
    - Updated Onboarding welcome screen to use new logo variant (RGB_Logo Design - ContraMind V001-11)
    - Changed logo container background to dark blue (#0C2836) and used object-cover to eliminate white spaces
  - **UI Updates**:
    - Changed "My Work" section background from dark blue to white with dark blue text
    - Updated onboarding form from full-screen overlay to centered card with backdrop blur
    - Added 3D effect to sidebar with shadows and gradient background
    - Customized Switch/Toggle components with ContraMind brand colors and modern styling
  - **Tasks Feature**: Implemented comprehensive task management for contract revisions
    - Created Tasks page (/tasks) accessible from all dashboard sidebars
    - Shows contracts under revision with status tracking (Draft, Under Review, Pending Approval, Revision Requested)
    - Displays days in revision, assigned reviewers, progress bars, and priority indicators
    - Added task statistics showing Under Revision, Pending Approval, High Priority, and Completed This Week counts
    - Implemented filtering by category and status
    - Quick actions for View Contract and Continue Editing
    - Mobile responsive with hamburger menu and card layouts
  - **Onboarding Flow**: Implemented onboarding flow for new users
  - **Database Updates**: 
    - Added onboarding fields to users table (onboardingCompleted, companyNameEn, companyNameAr, country, contractRole)
    - Successfully migrated database schema with new columns
  - **Onboarding Component**: Created 3-step onboarding flow
    - Step 1: Welcome screen with ContraMind logo
    - Step 2: Company information form (name in English/Arabic, country)
    - Step 3: Contract role selection (buyer/vendor)
    - Step 4: Completion screen with 1000 tokens granted
  - **Backend Integration**: 
    - Added /api/onboarding/complete endpoint
    - Updated storage interface with updateUserOnboarding method
  - **Dashboard Integration**: 
    - Shows onboarding automatically for new users (onboardingCompleted = false)
    - Full-screen overlay that cannot be skipped
    - Refreshes dashboard after completion
  - **Notification System**: 
    - Removed "صفحات مكدسة" (Deals Stack) feature from all pages
    - Maintained consistent notification dropdown across all dashboard pages
- **July 9, 2025**: Fixed navigation and sidebar positioning for Arabic RTL layout
  - **Navigation Fixes**: 
    - Changed "لوحة القيادة" to "لوحة التحكم" across all dashboard pages for consistency
    - Made breadcrumb navigation clickable in Chat page (Dashboard link navigates back)
    - Fixed sidebar positioning for RTL layout - sidebar appears on right side for Arabic
    - Fixed content margins to accommodate sidebar position based on language direction
  - **Help Page**: Created simple Help page accessible from sidebar
    - Route: /help accessible from Help button in sidebar across all dashboard pages
    - FAQ Section: 5 questions copied from homepage covering ContraMind features
    - Simple styling: 24px Space Grotesk for title, 16px Inter for questions (navy), 14px Inter for answers (grey)
    - Contact Section: Light blue background (#E8F4F8) with CEO email (Ceo@contramind.com)
    - Updated all dashboard pages to navigate to /help instead of showing "Coming Soon"
  - **Navigation Updates**:
    - Removed "Schedule Demo" button from all dashboard sidebars
    - Changed "المستودع" to "ملفاتي" and "Repository" to "My Drive" across all pages
  - **Chat Interface**: Created comprehensive chat system accessible from dashboard search
    - Activation: User types in dashboard search bar and presses Enter to navigate to chat
    - Pre-fills user's question from search query
    - Token-based system: 5 tokens per message with live token counter
    - Clickable breadcrumb navigation: Dashboard > Contract Assistant
  - **Chat Features**:
    - System message explaining token cost and capabilities
    - User messages (right/navy) and AI messages (left/light grey) with distinct styling
    - Mock AI responses for common contract questions (limitation of liability, payment terms, IP ownership, termination)
    - Copy button on AI messages, timestamps on hover
    - Loading animation with 3 bouncing dots while waiting for response
    - Suggested question chips below input field
    - Character counter (500 max) and send button
    - Responsive design with adjusted sizing for mobile
  - **Previous Updates**: Enhanced sidebar navigation and settings pages
    - Settings Navigation: Implemented expandable Settings menu in sidebar across all pages
    - Settings Pages: Created Personal Settings and Organization Settings pages
    - Contract Analysis Flow: Dashboard → Upload Modal → Party Selection → Analysis Progress → Results
    - Sidebar UI Update: Icons positioned on left side of text for all languages
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