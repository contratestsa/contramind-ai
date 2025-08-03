# ContraMind.ai - Legal Tech Platform

## Overview
ContraMind.ai is an AI-powered legal technology platform designed for contract management in the MENA region, supporting both Arabic and English. Its core purpose is to streamline legal operations through intelligent contract analysis, offering features like comprehensive waitlist registration, a user authentication system, and a ChatGPT-style dashboard for intuitive interaction. The platform aims to revolutionize legal document processing, providing efficient tools for businesses to manage their legal agreements.

## User Preferences
- Professional bilingual messaging with personalized user names
- Exact Arabic text matching with precision
- Consistent color scheme: light backgrounds (#f0f3f5), dark blue buttons (#0c2836)
- Privacy messaging: "We'll never share your email. Unsubscribe anytime."
- Fixed countdown timer instead of dynamic calculation
- Dashboard screens: Don't focus on specific font types or colors - keep it simple

## System Architecture
The platform features a React-based frontend built with TypeScript, utilizing Wouter for routing and TailwindCSS for styling, enhanced with Framer Motion for animations. A key highlight is the comprehensive bilingual language system with browser detection. The backend is an Express.js server interacting with a PostgreSQL database via Drizzle ORM.

Core architectural decisions include:
- **UI/UX**: Implementation of a professional, minimalist design using ContraMind's brand palette. The dashboard mimics a ChatGPT-style interface with a collapsible sidebar, sliding panels for prompts and contract details, and consistent theming. Analytics are visualized using Recharts column charts.
- **Contract Processing**: A JavaScript-based universal extraction pipeline (`contractExtractorJS.ts`) processes PDF and DOCX files to extract metadata such as parties, contract type, dates, risk phrases, and payment details. This data populates a `contract_details` table and informs risk level calculations.
- **Authentication**: A secure email and password authentication system is integrated, supporting both direct signup/login and OAuth (Google, Microsoft). Email verification is a core part of the signup flow.
- **Data Management**: The system uses `contracts`, `contract_chats`, and `saved_prompts` tables to manage core application data. Real-time data refresh mechanisms are in place for analytics and recent contracts display.
- **Desktop Application**: An Electron-based desktop application integrates with the web app, sharing session cookies and offering a native experience with splash screens and improved window management.
- **Theming**: Comprehensive light/dark theme support is implemented using CSS variables, allowing dynamic switching and persistence of user preferences.
- **Internationalization**: Full RTL/LTR support for Arabic and English is implemented across all UI elements, including chat controls, navigation, and text alignment.

## External Dependencies
- **Database**: PostgreSQL (via Alibaba Cloud ApsaraDB PostgreSQL)
- **ORM**: Drizzle ORM
- **Email Service**: Resend
- **File Processing Libraries**: pdf.js (for PDFs), mammoth.js (for DOCX)
- **Charting Library**: Recharts
- **Authentication**: Google OAuth, Microsoft OAuth
- **Version Control/Deployment**: GitHub, Google Cloud Build, Google Cloud Run