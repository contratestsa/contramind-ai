# ContraMind Features Documentation

## Table of Contents
- [Authentication System](#authentication-system)
- [Dashboard & Analytics](#dashboard--analytics)
- [Contract Chat Interface](#contract-chat-interface)
- [Recent Contracts](#recent-contracts)
- [Settings](#settings)
- [Help Center](#help-center)
- [Language Support](#language-support)
- [Theme System](#theme-system)

---

## Authentication System

### Overview
ContraMind provides a comprehensive authentication system supporting multiple login methods and secure session management.

### Features

#### OAuth Integration
- **Google Login**
  - One-click authentication
  - Automatic profile information retrieval
  - Secure token management
  
- **Microsoft Login**
  - Enterprise-ready authentication
  - Azure AD integration support
  - Seamless corporate account access

#### Email/Password Authentication
- **User Registration**
  - Email validation
  - Password strength requirements
  - Verification email system
  
- **Login System**
  - Secure password handling
  - "Remember me" functionality
  - Session persistence

#### Token System
- **Initial Allocation**: 1000 free tokens upon registration
- **Token Usage**:
  - Contract upload: -10 tokens
  - Chat interaction: -5 tokens per message
- **Token Display**: Real-time token balance in header

### Security Features
- Password encryption with bcrypt
- Session management with secure cookies
- CSRF protection
- Rate limiting on authentication endpoints

---

## Dashboard & Analytics

### Overview
The dashboard provides real-time insights into contract analysis activities and performance metrics.

### Key Metrics Display

#### Contract Statistics
- **Total Contracts**: Overall number of processed contracts
- **High Risk**: Count of contracts with high risk levels
- **Medium Risk**: Count of contracts with medium risk levels
- **Low Risk**: Count of contracts with low risk levels

#### Visual Analytics
- **Risk Distribution Chart**
  - Interactive column chart using Recharts
  - Color-coded risk levels
  - Hover tooltips with exact values
  
- **Contract Types Chart**
  - Distribution of contract categories
  - Dynamic data updates
  - Responsive design

#### Recent Activity
- Latest 5 contract analyses
- Quick access links
- Risk level indicators
- Timestamp information

### Real-time Updates
- Auto-refresh every 30 seconds
- WebSocket integration for live updates
- Loading states for data fetching
- Error handling with retry logic

---

## Contract Chat Interface

### Overview
A ChatGPT-style interface designed specifically for contract analysis, providing intuitive AI-powered interactions.

### Upload Process

#### File Support
- **Supported Formats**:
  - PDF documents
  - DOCX files
  - File size limit: 10MB
  
#### Upload Interface
- Drag-and-drop functionality
- Click-to-browse option
- File validation
- Progress indicator

### Contract Analysis

#### Party Selection
Users must select their perspective:
- **Client**: Analyze from buyer's perspective
- **Vendor**: Analyze from seller's perspective
- **Neutral**: Objective third-party analysis

#### AI-Powered Features
- **Automatic Extraction**:
  - Contract parties identification
  - Key dates and deadlines
  - Payment terms
  - Obligations and responsibilities
  
- **Risk Assessment**:
  - High/Medium/Low risk classification
  - Specific risk factors identification
  - Actionable recommendations
  
- **Key Insights**:
  - Contract type classification
  - Important clauses highlighting
  - Missing elements detection

### Chat Functionality

#### Message Interface
- Clean, modern chat bubbles
- User/AI message differentiation
- Timestamp display
- Loading indicators

#### AI Capabilities
- Context-aware responses
- Multi-turn conversations
- Clause explanations
- Amendment suggestions
- Risk mitigation advice

#### Interaction Features
- Copy message functionality
- Message history preservation
- Export chat transcript
- Print-friendly view

---

## Recent Contracts

### Overview
Quick access sidebar showing contract history and enabling easy resumption of previous analyses.

### Features

#### Contract List
- **Display Information**:
  - Contract title/filename
  - Upload date and time
  - Risk level indicator (color-coded)
  - Contract type
  
#### Resume Functionality
- One-click chat resumption
- Full conversation history
- Context preservation
- Seamless continuation

#### Management Options
- Search contracts by name
- Filter by risk level
- Sort by date/type
- Delete old analyses

---

## Settings

### Personal Settings

#### Profile Management
- Name update
- Email change (with verification)
- Password reset
- Profile picture upload

#### Preferences
- Default language selection
- Theme preference (Light/Dark/System)
- Email notification settings
- Data export options

### Notification Preferences

#### Email Notifications
- Contract analysis completion
- High-risk contract alerts
- Token balance warnings
- System updates

#### In-App Notifications
- Real-time alerts
- Desktop notifications (optional)
- Sound preferences
- Do not disturb mode

### Account Management
- Token purchase options
- Usage history
- Billing information
- Subscription management

---

## Help Center

### FAQ Section

#### Common Questions
- How to upload contracts
- Understanding risk levels
- Token system explanation
- Language switching guide
- Troubleshooting tips

### Support Information

#### Contact Options
- Email support
- Live chat (business hours)
- Ticket system
- Response time expectations

#### Resources
- Video tutorials
- User guide PDF
- Best practices guide
- API documentation links

---

## Language Support

### Bilingual Interface

#### Arabic Support
- Full RTL layout
- Arabic UI translation
- Arabic contract analysis
- Culturally appropriate design

#### English Support
- LTR layout
- Professional terminology
- International standards
- Clear, concise language

### Language Detection
- Browser language auto-detection
- User preference persistence
- Quick toggle button
- Seamless switching

---

## Theme System

### Light Theme
- Clean white backgrounds
- High contrast text
- Professional appearance
- Reduced eye strain in bright environments

### Dark Theme
- Modern dark UI
- Reduced blue light
- Energy efficient (OLED screens)
- Comfortable for extended use

### Theme Features
- System preference detection
- Manual override option
- Smooth transitions
- Consistent across all pages

---

## Additional Features

### Desktop Application
- Native Electron app
- Offline capabilities
- Enhanced performance
- System tray integration

### Security Features
- End-to-end encryption
- Data privacy compliance
- Regular security audits
- GDPR compliance

### Performance Optimizations
- Lazy loading
- Code splitting
- Image optimization
- Cache management

---

<div align="center">
  <p>Last updated: January 2025</p>
</div>