# ContraMind.ai - Legal Tech Platform

## Overview
ContraMind.ai is a bilingual (Arabic/English) AI-powered legal technology platform designed for contract management in the MENA region. Its primary purpose is to streamline contract analysis and provide intelligent insights, serving as a comprehensive tool for legal professionals. Key capabilities include AI-driven contract extraction and analysis, a ChatGPT-style interactive dashboard for querying contracts, and a robust management system for parties and contracts. The platform aims to revolutionize legal tech by offering a user-friendly, intelligent solution for complex contract workflows.

## User Preferences
- Professional bilingual messaging with personalized user names
- Exact Arabic text matching with precision
- Consistent color scheme: light backgrounds (#f0f3f5), dark blue buttons (#0c2836)
- Privacy messaging: "We'll never share your email. Unsubscribe anytime."
- Fixed countdown timer instead of dynamic calculation
- Dashboard screens: Don't focus on specific font types or colors - keep it simple

## System Architecture
The platform is built with a React-based frontend using TypeScript, Wouter for routing, TailwindCSS for styling, and Framer Motion for animations. Data fetching is managed with TanStack Query. A comprehensive bilingual language system supports Arabic and English, including browser detection for initial language settings. The backend runs on an Express.js server, utilizing a PostgreSQL database with Drizzle ORM.

### Recent Fixes (January 2025)
- **React Import Standardization**: Resolved persistent Vite preamble errors by standardizing all React imports to use destructured imports instead of namespace imports (`import * as React`). This ensures compatibility with Vite's React plugin and eliminates runtime hook errors.
- **LanguageManager Separation** (January 19, 2025): Fixed intermittent React hooks errors by separating `LanguageManager` utility object from `SimpleLanguage.tsx` into its own file (`utils/languageManager.ts`). Vite's Fast Refresh feature cannot handle mixed exports of React components and plain JavaScript objects from the same file, causing React context to be lost and hooks like `useState` to fail. This architectural separation ensures stable hot module replacement and prevents the "Invalid hook call" errors.

### Authentication System (Updated: January 2025)
- **JWT-based Authentication**: Migrated from session-based to JWT token authentication for improved security and scalability
- **Backward Compatibility**: Supports both hashed passwords (new users) and plain text passwords (existing users) with automatic upgrade to hashed format on login
- **Token Management**: Implements access tokens (15 min expiry) and refresh tokens (7 days expiry) with automatic renewal
- **OAuth Integration**: Google and Microsoft OAuth providers generate JWT tokens for seamless authentication

Core architectural decisions include:
- **UI/UX**: The dashboard employs a ChatGPT-style interface with a narrow, dark-themed sidebar and a main content area. It features a sliding panel component for prompts and contract details. The overall design emphasizes a professional appearance with a consistent brand color palette (ContraMind navy and sky blue accents), ensuring readability and a cohesive user experience across all pages (Dashboard, Parties, Contracts, Help). The system supports both light and dark themes, with theme preference persistence.
- **Technical Implementations**:
    - **Contract Extraction Pipeline**: A JavaScript-based universal extraction pipeline leverages `pdf.js` for PDFs and `mammoth.js` for DOCX files to extract key contract metadata (parties, type, dates, risk phrases, payment details). This data informs risk level calculation and automatic contract type detection.
    - **Authentication**: A secure authentication system includes email verification, OAuth (Google and Microsoft), and session management. It supports secure login and signup processes.
    - **Dashboard Features**:
        - **Navigation**: A redesigned sidebar provides clear navigation to sections like Analytics, Parties, Contracts, and Help, with mobile responsiveness and interactive elements (e.g., hamburger menu transitioning to logo).
        - **Analytics & Reporting**: The dashboard displays key analytics from processed contracts, including contract type, risk rate, and payment liability, presented in column charts for improved readability. Data is real-time and dynamically calculated.
        - **Chat Interface**: A comprehensive chat system allows users to interact with uploaded contracts, featuring token-based messaging, suggested prompts, and a responsive design.
        - **Task Management**: A tasks page tracks contract revisions with status, progress, and priority indicators.
- **System Design Choices**:
    - **Data Persistence**: Key data like recent contracts and user preferences are persisted across sessions.
    - **Modular Design**: Components and features are designed to be modular, allowing for easy integration and maintenance (e.g., dedicated components for charts, modals, and navigation).
    - **Database Schema**: The database includes tables for `users`, `contracts`, `contract_chats`, and `saved_prompts`, supporting a wide range of platform functionalities.
    - **Bilingual Support**: Comprehensive RTL/LTR support is implemented across the UI, ensuring proper layout and text alignment for Arabic and English.

## External Dependencies
- **Database**: PostgreSQL (Alibaba Cloud ApsaraDB)
- **ORMs**: Drizzle ORM
- **Email Service**: Resend
- **Authentication**: Google OAuth, Microsoft OAuth
- **PDF/DOCX Processing**: `pdf.js`, `mammoth.js`
- **Charting Library**: Recharts
- **Animations**: Framer Motion
- **Versioning**: GitHub (for read/write access to `contramindai/contramindPoC`)
- **Cloud Deployment**: Google Cloud (Cloud Run for containerization, Cloud SQL for database)