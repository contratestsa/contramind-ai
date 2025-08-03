# ContraMind.ai - Legal Tech Platform

<div align="center">
  <img src="./client/public/ContraMind Logo.png" alt="ContraMind Logo" width="200"/>
  
  ### AI-Powered Contract Management for the MENA Region
  
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
</div>

## 📋 Overview

ContraMind.ai is an advanced AI-powered legal technology platform specializing in bilingual contract management for the MENA region. Built with cutting-edge technology, it provides intelligent document extraction, comprehensive analysis capabilities, and a ChatGPT-style interface for intuitive contract interactions.

## ✨ Key Features

- **🔐 Advanced Authentication**
  - Google & Microsoft OAuth integration
  - Secure email/password authentication
  - Email verification system
  - Token-based usage management (1000 free tokens)

- **📊 Interactive Dashboard**
  - Real-time analytics visualization
  - Contract statistics and metrics
  - Recent activity tracking
  - Risk assessment overview

- **💬 AI Contract Assistant**
  - ChatGPT-style conversational interface
  - Multi-format support (PDF/DOCX)
  - Intelligent contract analysis
  - Risk level assessment
  - Party-based perspective (Client/Vendor/Neutral)

- **🌐 Bilingual Support**
  - Full Arabic and English interface
  - RTL/LTR layout support
  - Browser language detection
  - Seamless language switching

- **🎨 Modern UI/UX**
  - Professional, minimalist design
  - Light/Dark theme support
  - Responsive layout
  - Smooth animations with Framer Motion

- **🖥️ Desktop Application**
  - Electron-based native app
  - Integrated session management
  - Enhanced performance

## 🛠️ Technology Stack

### Frontend
- **React 18.3** with TypeScript
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Framer Motion** for animations
- **Recharts** for data visualization
- **Wouter** for routing
- **React Query** for state management

### Backend
- **Express.js** server
- **PostgreSQL** database (Alibaba Cloud ApsaraDB)
- **Drizzle ORM** for database management
- **Passport.js** for authentication
- **Resend** for email services

### Document Processing
- **pdf.js** for PDF parsing
- **mammoth.js** for DOCX processing
- Custom extraction pipeline for contract analysis

## 🚀 Installation

### Prerequisites
- Node.js 20.x or higher
- PostgreSQL database
- Google OAuth credentials (optional)
- Microsoft OAuth credentials (optional)
- Resend API key for email services

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/contramind.git
   cd contramind
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL=postgresql://user:password@host:port/database

   # Authentication
   SESSION_SECRET=your-session-secret
   
   # Google OAuth (optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # Microsoft OAuth (optional)
   MICROSOFT_CLIENT_ID=your-microsoft-client-id
   MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
   
   # Email Service
   RESEND_API_KEY=your-resend-api-key
   
   # Application URLs
   VITE_API_URL=http://localhost:5000
   ```

4. **Database Setup**
   ```bash
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

## 📖 Documentation

- [Features Documentation](docs/FEATURES.md) - Detailed feature descriptions
- [API Documentation](docs/API.md) - API endpoints and data structures
- [User Guide](docs/USER_GUIDE.md) - Step-by-step usage instructions
- [Developer Guide](docs/DEVELOPER.md) - Technical documentation for developers

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with love by the ContraMind team
- Special thanks to all contributors and early adopters
- Powered by cutting-edge AI technology

---

<div align="center">
  <p>© 2025 ContraMind.ai - Revolutionizing Legal Tech in MENA</p>
</div># ContraMind Features Documentation

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
</div># ContraMind API Documentation

## Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
- [Data Structures](#data-structures)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## Overview

The ContraMind API is a RESTful service that powers the contract analysis platform. All endpoints return JSON responses and require authentication unless specified otherwise.

### Base URL
```
Development: http://localhost:5000/api
Production: https://api.contramind.ai
```

### Headers
```http
Content-Type: application/json
Authorization: Bearer <session-token>
```

---

## Authentication

### Session Management
ContraMind uses session-based authentication with secure HTTP-only cookies.

```mermaid
flowchart LR
    A[Client] -->|Login Request| B[Auth Endpoint]
    B -->|Validate Credentials| C[Database]
    C -->|User Data| B
    B -->|Set Session Cookie| A
    A -->|Subsequent Requests| D[Protected Endpoints]
    D -->|Validate Session| E[Session Store]
```

---

## Endpoints

### Authentication Endpoints

#### POST /api/auth/signup
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "tokens": 1000
  }
}
```

#### POST /api/auth/login
Authenticate a user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "tokens": 950
  }
}
```

#### GET /api/auth/google
Initiate Google OAuth flow.

#### GET /api/auth/microsoft
Initiate Microsoft OAuth flow.

#### POST /api/auth/logout
End user session.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Contract Management

#### POST /api/contracts/upload
Upload and analyze a contract.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Token Cost: 10 tokens

**Form Data:**
```
file: <contract-file>
party: "client" | "vendor" | "neutral"
```

**Response:**
```json
{
  "success": true,
  "contract": {
    "id": "uuid",
    "filename": "contract.pdf",
    "uploadDate": "2025-01-27T10:00:00Z",
    "party": "client",
    "analysis": {
      "contractType": "Service Agreement",
      "parties": ["Company A", "Company B"],
      "startDate": "2025-02-01",
      "endDate": "2026-01-31",
      "riskLevel": "medium",
      "riskFactors": [
        "Unlimited liability clause",
        "No termination clause"
      ],
      "keyInsights": [
        "Payment terms: Net 30",
        "Renewal: Automatic"
      ]
    }
  }
}
```

#### GET /api/contracts
Get user's contracts.

**Query Parameters:**
- `limit` (optional): Number of contracts to return (default: 10)
- `offset` (optional): Pagination offset (default: 0)
- `riskLevel` (optional): Filter by risk level

**Response:**
```json
{
  "success": true,
  "contracts": [
    {
      "id": "uuid",
      "filename": "contract.pdf",
      "uploadDate": "2025-01-27T10:00:00Z",
      "riskLevel": "high",
      "contractType": "Service Agreement"
    }
  ],
  "total": 25,
  "hasMore": true
}
```

#### GET /api/contracts/:id
Get specific contract details.

**Response:**
```json
{
  "success": true,
  "contract": {
    "id": "uuid",
    "filename": "contract.pdf",
    "uploadDate": "2025-01-27T10:00:00Z",
    "party": "client",
    "analysis": { /* Full analysis data */ },
    "chatHistory": [ /* Chat messages */ ]
  }
}
```

---

### Chat Interface

#### POST /api/contracts/:id/chat
Send a message about a contract.

**Request Body:**
```json
{
  "message": "Can you explain the termination clause?"
}
```

**Token Cost:** 5 tokens per message

**Response:**
```json
{
  "success": true,
  "response": {
    "id": "msg-uuid",
    "message": "The termination clause in this contract states...",
    "timestamp": "2025-01-27T10:05:00Z",
    "tokensUsed": 5
  },
  "remainingTokens": 940
}
```

#### GET /api/contracts/:id/chat
Get chat history for a contract.

**Response:**
```json
{
  "success": true,
  "messages": [
    {
      "id": "msg-uuid",
      "role": "user",
      "message": "What are the payment terms?",
      "timestamp": "2025-01-27T10:00:00Z"
    },
    {
      "id": "msg-uuid-2",
      "role": "assistant",
      "message": "The payment terms are Net 30...",
      "timestamp": "2025-01-27T10:00:05Z"
    }
  ]
}
```

---

### Analytics

#### GET /api/analytics/dashboard
Get dashboard statistics.

**Response:**
```json
{
  "success": true,
  "analytics": {
    "totalContracts": 45,
    "riskDistribution": {
      "high": 5,
      "medium": 15,
      "low": 25
    },
    "contractTypes": {
      "Service Agreement": 20,
      "NDA": 15,
      "Employment": 10
    },
    "recentActivity": [
      {
        "contractId": "uuid",
        "filename": "contract.pdf",
        "action": "uploaded",
        "timestamp": "2025-01-27T10:00:00Z"
      }
    ]
  }
}
```

---

### User Management

#### GET /api/user/profile
Get current user profile.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "tokens": 940,
    "createdAt": "2025-01-01T00:00:00Z",
    "preferences": {
      "language": "en",
      "theme": "light",
      "notifications": true
    }
  }
}
```

#### PATCH /api/user/profile
Update user profile.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "preferences": {
    "language": "ar",
    "theme": "dark"
  }
}
```

---

## Data Structures

### Contract Analysis Object
```typescript
interface ContractAnalysis {
  contractType: string;
  parties: string[];
  startDate: string;
  endDate: string;
  value?: number;
  currency?: string;
  riskLevel: 'high' | 'medium' | 'low';
  riskFactors: string[];
  keyInsights: string[];
  obligations: {
    party: string;
    description: string;
    deadline?: string;
  }[];
  paymentTerms?: {
    schedule: string;
    method: string;
    penalties?: string;
  };
}
```

### Chat Message Object
```typescript
interface ChatMessage {
  id: string;
  contractId: string;
  role: 'user' | 'assistant';
  message: string;
  timestamp: string;
  tokensUsed?: number;
}
```

### User Object
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  tokens: number;
  createdAt: string;
  preferences: {
    language: 'en' | 'ar';
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}
```

---

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Common Error Codes
| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AUTH_REQUIRED` | 401 | Authentication required |
| `INVALID_CREDENTIALS` | 401 | Invalid email or password |
| `INSUFFICIENT_TOKENS` | 402 | Not enough tokens |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `FILE_TOO_LARGE` | 413 | File exceeds size limit |
| `UNSUPPORTED_FORMAT` | 415 | File format not supported |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

---

## Rate Limiting

### Limits
- Authentication endpoints: 5 requests per minute
- Upload endpoint: 10 requests per hour
- Chat endpoint: 30 requests per minute
- Other endpoints: 60 requests per minute

### Rate Limit Headers
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1643723400
```

---

## WebSocket Events

### Connection
```javascript
const ws = new WebSocket('wss://api.contramind.ai/ws');
ws.on('open', () => {
  ws.send(JSON.stringify({
    type: 'auth',
    token: sessionToken
  }));
});
```

### Event Types

#### Contract Analysis Update
```json
{
  "type": "analysis_update",
  "contractId": "uuid",
  "status": "processing" | "completed" | "failed",
  "progress": 75
}
```

#### Real-time Analytics
```json
{
  "type": "analytics_update",
  "data": {
    "totalContracts": 46,
    "latestContract": {
      "id": "uuid",
      "filename": "new-contract.pdf"
    }
  }
}
```

---

<div align="center">
  <p>API Version: 1.0 | Last updated: January 2025</p>
</div># ContraMind User Guide

## Table of Contents
- [Getting Started](#getting-started)
- [Creating Your Account](#creating-your-account)
- [Logging In](#logging-in)
- [Dashboard Overview](#dashboard-overview)
- [Uploading Contracts](#uploading-contracts)
- [Understanding Analysis Results](#understanding-analysis-results)
- [Using the Chat Feature](#using-the-chat-feature)
- [Managing Your Contracts](#managing-your-contracts)
- [Token System](#token-system)
- [Settings and Preferences](#settings-and-preferences)
- [Troubleshooting](#troubleshooting)

---

## Getting Started

Welcome to ContraMind! This guide will help you navigate through our AI-powered contract analysis platform. Whether you're a legal professional, business owner, or contract manager, ContraMind simplifies contract review and risk assessment.

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- PDF or DOCX contracts for analysis

---

## Creating Your Account

### Step 1: Navigate to Sign Up
1. Visit [ContraMind.ai](https://contramind.ai)
2. Click the **"Get Started"** or **"Sign Up"** button

### Step 2: Choose Your Sign-Up Method

#### Option A: Email Sign-Up
1. Enter your email address
2. Create a strong password (minimum 8 characters)
3. Enter your full name
4. Click **"Create Account"**
5. Check your email for verification link
6. Click the verification link to activate your account

#### Option B: Google Sign-Up
1. Click **"Continue with Google"**
2. Select your Google account
3. Authorize ContraMind access
4. Complete your profile if needed

#### Option C: Microsoft Sign-Up
1. Click **"Continue with Microsoft"**
2. Enter your Microsoft credentials
3. Authorize ContraMind access
4. Complete your profile if needed

### Step 3: Welcome Bonus
- You'll receive **1000 free tokens** upon registration
- Tokens are used for contract uploads and chat interactions

---

## Logging In

### Regular Login
1. Go to the login page
2. Enter your email and password
3. Check "Remember me" to stay logged in
4. Click **"Sign In"**

### Social Login
1. Click **"Continue with Google"** or **"Continue with Microsoft"**
2. Select your account
3. You'll be automatically logged in

### Forgot Password?
1. Click **"Forgot Password?"** on the login page
2. Enter your email address
3. Check your email for reset instructions
4. Create a new password

---

## Dashboard Overview

Once logged in, you'll see your personalized dashboard with:

### 1. Header Section
- **ContraMind Logo**: Click to return to dashboard
- **Token Balance**: Shows remaining tokens
- **Profile Menu**: Access settings and logout

### 2. Analytics Section
- **Total Contracts**: Number of contracts analyzed
- **Risk Distribution**: Visual breakdown of risk levels
- **Contract Types**: Distribution of contract categories
- **Recent Activity**: Latest 5 contracts

### 3. Navigation Sidebar
- **Dashboard**: Main overview page
- **Contracts**: Your contract library
- **Chat**: Contract analysis interface
- **Settings**: Account preferences
- **Help**: Support and FAQ

---

## Uploading Contracts

### Step 1: Navigate to Chat
1. Click **"Chat"** in the sidebar
2. Or click **"New Analysis"** button

### Step 2: Select Your Role
Choose your perspective for analysis:
- **Client**: If you're the buyer/customer
- **Vendor**: If you're the seller/provider
- **Neutral**: For objective third-party analysis

### Step 3: Upload Your Contract
1. **Drag and Drop**: Drag your file into the upload area
2. **Or Browse**: Click to select file from your computer
3. **Supported formats**: PDF and DOCX
4. **Maximum size**: 10MB

### Step 4: Processing
- Upload costs **10 tokens**
- Processing typically takes 10-30 seconds
- You'll see a progress indicator
- Analysis begins automatically

---

## Understanding Analysis Results

After upload, ContraMind provides comprehensive analysis:

### Risk Assessment
- **High Risk** 🔴: Requires immediate attention
- **Medium Risk** 🟡: Review recommended changes
- **Low Risk** 🟢: Generally acceptable terms

### Key Information Extracted
1. **Contract Type**: Service Agreement, NDA, etc.
2. **Parties**: All involved parties identified
3. **Dates**: Start, end, and key milestone dates
4. **Financial Terms**: Payment amounts and schedules
5. **Obligations**: Key responsibilities for each party

### Risk Factors
- Specific clauses that pose risks
- Missing standard protections
- Unfavorable terms highlighted
- Compliance issues identified

### Recommendations
- Suggested amendments
- Negotiation points
- Alternative clause suggestions
- Risk mitigation strategies

---

## Using the Chat Feature

### Starting a Conversation
1. After contract analysis, the chat interface opens
2. Type your question in the message box
3. Press Enter or click Send
4. Each message costs **5 tokens**

### Example Questions
- "Can you explain the termination clause?"
- "What are the payment penalties?"
- "Is the liability clause standard?"
- "What changes would you recommend?"
- "Can you draft an amendment for the delivery terms?"

### Chat Features
- **Copy Messages**: Click copy icon to copy AI responses
- **Clear Context**: Start fresh conversation
- **Export Chat**: Download conversation as PDF
- **Print View**: Print-friendly format

### Best Practices
1. Be specific in your questions
2. Ask follow-up questions for clarity
3. Request specific clause explanations
4. Ask for amendment suggestions

---

## Managing Your Contracts

### Contract Library
Access all your contracts from the sidebar:

1. **View List**: See all uploaded contracts
2. **Search**: Find contracts by name
3. **Filter**: Sort by risk level or date
4. **Resume Chat**: Continue previous conversations

### Contract Details
Click any contract to view:
- Full analysis report
- Chat history
- Risk assessment
- Download original file

### Organization Tips
- Use descriptive filenames
- Regularly review high-risk contracts
- Archive completed contracts
- Export important analyses

---

## Token System

### Understanding Tokens
Tokens are ContraMind's usage credits:
- **Initial Balance**: 1000 free tokens
- **Contract Upload**: 10 tokens
- **Chat Message**: 5 tokens

### Checking Balance
Your token balance appears in:
- Header (top right)
- Profile settings
- After each transaction

### Getting More Tokens
1. Go to Settings > Billing
2. Choose a token package
3. Complete secure payment
4. Tokens added instantly

### Token Packages
- **Starter**: 500 tokens
- **Professional**: 2000 tokens
- **Enterprise**: 10000 tokens
- **Custom**: Contact sales

---

## Settings and Preferences

### Profile Settings
1. Click your profile icon
2. Select **Settings**
3. Update:
   - Name
   - Email
   - Password
   - Profile picture

### Preferences
Configure your experience:

#### Language
- English or Arabic
- Auto-detect browser language
- RTL/LTR layout support

#### Theme
- Light mode
- Dark mode
- System preference

#### Notifications
- Email alerts for high-risk contracts
- Analysis completion notifications
- Token balance warnings
- Marketing communications

### Privacy Settings
- Data export options
- Account deletion
- Privacy preferences
- Cookie settings

---

## Troubleshooting

### Common Issues

#### Upload Fails
- Check file format (PDF/DOCX only)
- Ensure file size < 10MB
- Verify sufficient tokens
- Try different browser

#### Analysis Errors
- Re-upload the file
- Check file isn't corrupted
- Ensure text is extractable
- Contact support if persists

#### Login Problems
- Reset password
- Clear browser cache
- Check email verification
- Try different login method

#### Token Issues
- Verify current balance
- Check transaction history
- Ensure payment processed
- Contact billing support

### Getting Help

#### In-App Support
1. Click **Help** in sidebar
2. Browse FAQ section
3. Start live chat (business hours)
4. Submit support ticket

#### Email Support
- General: support@contramind.ai
- Billing: billing@contramind.ai
- Technical: tech@contramind.ai

#### Response Times
- Live chat: Immediate (business hours)
- Email: Within 24 hours
- Urgent issues: Within 4 hours

---

## Tips for Success

### Best Practices
1. **Upload Quality**: Use clear, complete contracts
2. **Role Selection**: Choose correct perspective
3. **Specific Questions**: Ask detailed questions
4. **Regular Reviews**: Check high-risk contracts frequently
5. **Token Management**: Monitor usage patterns

### Advanced Features
- Batch upload (coming soon)
- API access (Enterprise)
- Team collaboration
- Custom risk profiles
- White-label options

---

## Keyboard Shortcuts

| Action | Windows/Linux | Mac |
|--------|--------------|-----|
| New Chat | Ctrl + N | Cmd + N |
| Upload | Ctrl + U | Cmd + U |
| Search | Ctrl + K | Cmd + K |
| Settings | Ctrl + , | Cmd + , |
| Help | F1 | F1 |

---

## Mobile Experience

ContraMind is fully responsive:
- Touch-optimized interface
- Swipe navigation
- Mobile upload support
- Responsive charts
- Optimized chat interface

---

<div align="center">
  <p>Need more help? Contact us at support@contramind.ai</p>
  <p>Last updated: January 2025</p>
</div># ContraMind Developer Guide

## Table of Contents
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Architecture Overview](#architecture-overview)
- [Component Hierarchy](#component-hierarchy)
- [State Management](#state-management)
- [Database Schema](#database-schema)
- [Adding New Features](#adding-new-features)
- [Testing](#testing)
- [Deployment](#deployment)
- [Code Standards](#code-standards)

---

## Project Structure

```
contramind/
├── client/                    # Frontend React application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ui/          # Shadcn UI components
│   │   │   └── ...          # Feature components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and helpers
│   │   ├── pages/           # Page components
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   └── index.html
├── server/                   # Backend Express application
│   ├── routes.ts            # API route definitions
│   ├── storage.ts           # Database interface
│   ├── auth.ts              # Authentication logic
│   ├── contractExtractor.ts # Contract processing
│   └── index.ts             # Server entry point
├── shared/                   # Shared types and schemas
│   └── schema.ts            # Database schemas
├── docs/                     # Documentation
├── attached_assets/          # User uploaded assets
├── package.json             # Dependencies
├── vite.config.ts           # Vite configuration
├── drizzle.config.ts        # Database configuration
├── tailwind.config.ts       # Tailwind CSS config
└── tsconfig.json            # TypeScript config
```

---

## Development Setup

### Prerequisites
```bash
# Required versions
Node.js >= 20.x
PostgreSQL >= 16.x
npm >= 10.x
```

### Initial Setup
```bash
# Clone repository
git clone https://github.com/yourusername/contramind.git
cd contramind

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Setup database
npm run db:push

# Start development server
npm run dev
```

### Development Commands
```json
{
  "scripts": {
    "dev": "Starts both frontend and backend",
    "build": "Production build",
    "db:push": "Push schema changes to database",
    "db:studio": "Open Drizzle Studio",
    "typecheck": "Run TypeScript checks",
    "lint": "Run ESLint",
    "format": "Format code with Prettier"
  }
}
```

---

## Architecture Overview

### System Architecture Diagram
```mermaid
graph TB
    subgraph "Frontend"
        A[React App] --> B[Wouter Router]
        A --> C[React Query]
        A --> D[Shadcn UI]
        C --> E[API Client]
    end
    
    subgraph "Backend"
        F[Express Server] --> G[Routes]
        G --> H[Storage Layer]
        G --> I[Auth Middleware]
        H --> J[Drizzle ORM]
    end
    
    subgraph "External Services"
        K[PostgreSQL]
        L[Resend Email]
        M[OAuth Providers]
    end
    
    E --> F
    J --> K
    I --> M
    F --> L
```

### Key Design Decisions

#### Frontend Architecture
- **React 18.3** with TypeScript for type safety
- **Wouter** for lightweight client-side routing
- **React Query** for server state management
- **Tailwind CSS** for utility-first styling
- **Shadcn UI** for accessible component library
- **Framer Motion** for animations

#### Backend Architecture
- **Express.js** for REST API
- **Drizzle ORM** for type-safe database queries
- **Passport.js** for authentication strategies
- **Session-based** auth with secure cookies
- **Custom extraction pipeline** for document processing

---

## Component Hierarchy

### Main Application Structure
```
App.tsx
├── SimpleLanguageProvider
├── TooltipProvider
├── QueryClientProvider
│   └── Router
│       ├── Layout
│       │   ├── Header
│       │   ├── Sidebar
│       │   └── Content
│       └── Routes
│           ├── Dashboard
│           ├── Chat
│           ├── Settings
│           └── Auth Pages
```

### Key Components

#### Dashboard Components
```typescript
// client/src/pages/Dashboard.tsx
Dashboard
├── StatCard (Total Contracts, Risk Levels)
├── RiskDistributionChart
├── ContractTypesChart
└── RecentActivity
```

#### Chat Interface
```typescript
// client/src/pages/Chat.tsx
Chat
├── ContractUpload
│   ├── PartySelector
│   └── FileDropzone
├── ChatMessages
│   ├── UserMessage
│   └── AssistantMessage
└── ChatInput
```

#### Authentication Flow
```typescript
// client/src/pages/auth/
AuthLayout
├── Login
│   ├── EmailPasswordForm
│   └── SocialLogins
├── Signup
│   ├── RegistrationForm
│   └── EmailVerification
└── ForgotPassword
```

---

## State Management

### Global State with React Query

```typescript
// Query Keys Convention
const queryKeys = {
  user: ['user'],
  contracts: ['contracts'],
  contract: (id: string) => ['contracts', id],
  analytics: ['analytics'],
  chat: (contractId: string) => ['chat', contractId]
};

// Example Query Hook
export function useContracts() {
  return useQuery({
    queryKey: queryKeys.contracts,
    queryFn: () => apiRequest('/api/contracts'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Example Mutation Hook
export function useUploadContract() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: FormData) => 
      apiRequest('/api/contracts/upload', {
        method: 'POST',
        body: data
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.contracts 
      });
    }
  });
}
```

### Local State Management
- Component state with `useState`
- Form state with `react-hook-form`
- Theme state with Context API
- Language state with custom provider

---

## Database Schema

### Core Tables

```typescript
// Users Table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  password: text('password'),
  name: text('name').notNull(),
  tokens: integer('tokens').notNull().default(1000),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  preferences: jsonb('preferences').$type<UserPreferences>()
});

// Contracts Table
export const contracts = pgTable('contracts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  filename: text('filename').notNull(),
  party: text('party').notNull(), // client, vendor, neutral
  uploadDate: timestamp('upload_date').defaultNow(),
  fileData: bytea('file_data'),
  analysis: jsonb('analysis').$type<ContractAnalysis>()
});

// Contract Details Table
export const contractDetails = pgTable('contract_details', {
  id: uuid('id').primaryKey().defaultRandom(),
  contractId: uuid('contract_id').references(() => contracts.id),
  contractType: text('contract_type'),
  parties: text('parties').array(),
  startDate: date('start_date'),
  endDate: date('end_date'),
  riskLevel: text('risk_level'),
  riskFactors: text('risk_factors').array(),
  keyInsights: jsonb('key_insights')
});

// Chat Messages Table
export const contractChats = pgTable('contract_chats', {
  id: uuid('id').primaryKey().defaultRandom(),
  contractId: uuid('contract_id').references(() => contracts.id),
  role: text('role').notNull(), // user, assistant
  message: text('message').notNull(),
  timestamp: timestamp('timestamp').defaultNow(),
  tokensUsed: integer('tokens_used')
});
```

### Database Migrations
```bash
# Push schema changes (development)
npm run db:push

# Generate migration files (production)
npm run db:generate

# Run migrations
npm run db:migrate
```

---

## Adding New Features

### Feature Development Workflow

#### 1. Define Data Model
```typescript
// shared/schema.ts
export const newFeature = pgTable('new_feature', {
  id: uuid('id').primaryKey().defaultRandom(),
  // Add fields
});

// Create schemas
export const insertNewFeatureSchema = createInsertSchema(newFeature);
export type InsertNewFeature = z.infer<typeof insertNewFeatureSchema>;
export type SelectNewFeature = typeof newFeature.$inferSelect;
```

#### 2. Update Storage Interface
```typescript
// server/storage.ts
interface IStorage {
  // Existing methods...
  
  // New feature methods
  createNewFeature(data: InsertNewFeature): Promise<SelectNewFeature>;
  getNewFeatures(userId: string): Promise<SelectNewFeature[]>;
}
```

#### 3. Implement API Routes
```typescript
// server/routes.ts
router.post('/api/new-feature', authenticate, async (req, res) => {
  try {
    const validated = insertNewFeatureSchema.parse(req.body);
    const result = await storage.createNewFeature(validated);
    res.json({ success: true, data: result });
  } catch (error) {
    handleError(error, res);
  }
});
```

#### 4. Create Frontend Components
```typescript
// client/src/components/NewFeature.tsx
export function NewFeature() {
  const { data, isLoading } = useQuery({
    queryKey: ['new-feature'],
    queryFn: () => apiRequest('/api/new-feature')
  });
  
  // Component implementation
}
```

#### 5. Add to Router
```typescript
// client/src/App.tsx
<Route path="/new-feature" component={NewFeature} />
```

---

## Testing

### Unit Testing
```typescript
// Example test file
// tests/contractExtractor.test.ts
import { extractContractData } from '../server/contractExtractor';

describe('Contract Extractor', () => {
  it('should extract party names from PDF', async () => {
    const result = await extractContractData(testPDF);
    expect(result.parties).toHaveLength(2);
  });
});
```

### Integration Testing
```typescript
// tests/api.test.ts
describe('API Endpoints', () => {
  it('should upload contract successfully', async () => {
    const response = await request(app)
      .post('/api/contracts/upload')
      .attach('file', 'test-contract.pdf')
      .field('party', 'client');
      
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

### E2E Testing
```typescript
// tests/e2e/contract-flow.test.ts
test('complete contract analysis flow', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Login');
  // ... complete flow test
});
```

---

## Deployment

### Production Build
```bash
# Build frontend and backend
npm run build

# Output structure
dist/
├── client/          # Vite build output
└── server/          # TypeScript compiled output
```

### Environment Configuration
```env
# Production .env
NODE_ENV=production
DATABASE_URL=postgresql://prod-connection
SESSION_SECRET=strong-secret-key
GOOGLE_CLIENT_ID=prod-client-id
GOOGLE_CLIENT_SECRET=prod-client-secret
RESEND_API_KEY=prod-api-key
```

### Deployment Checklist
- [ ] Update environment variables
- [ ] Run database migrations
- [ ] Build production assets
- [ ] Configure SSL certificates
- [ ] Setup monitoring
- [ ] Configure backup strategy
- [ ] Update DNS records
- [ ] Test OAuth redirects

### Docker Deployment
```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

---

## Code Standards

### TypeScript Guidelines
```typescript
// Use explicit types
interface UserData {
  id: string;
  email: string;
  name: string;
}

// Avoid any
function processUser(user: UserData): void {
  // Implementation
}

// Use enums for constants
enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}
```

### React Best Practices
```typescript
// Use functional components
export function Component({ prop }: Props) {
  // Use hooks
  const [state, setState] = useState<string>('');
  
  // Memoize expensive computations
  const computed = useMemo(() => {
    return expensiveOperation(state);
  }, [state]);
  
  return <div>{computed}</div>;
}
```

### API Design
```typescript
// RESTful naming
GET    /api/contracts      // List
GET    /api/contracts/:id  // Get one
POST   /api/contracts      // Create
PATCH  /api/contracts/:id  // Update
DELETE /api/contracts/:id  // Delete

// Consistent response format
{
  success: boolean;
  data?: any;
  error?: {
    code: string;
    message: string;
  };
}
```

### Git Workflow
```bash
# Branch naming
feature/contract-export
bugfix/token-calculation
hotfix/auth-redirect

# Commit messages
feat: add contract export functionality
fix: correct token deduction logic
docs: update API documentation
refactor: simplify chat component
```

---

## Performance Optimization

### Frontend Optimization
- Code splitting with React.lazy
- Image optimization with WebP
- Bundle size monitoring
- Lighthouse performance audits

### Backend Optimization
- Database query optimization
- Redis caching for sessions
- Rate limiting
- Request compression

### Monitoring
- Error tracking with Sentry
- Performance monitoring
- User analytics
- Uptime monitoring

---

<div align="center">
  <p>For additional help, contact the development team</p>
  <p>Last updated: January 2025</p>
</div># Changelog

All notable changes to the ContraMind project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive project documentation
- README.md with installation instructions
- Feature documentation in docs/FEATURES.md
- API documentation in docs/API.md
- User guide in docs/USER_GUIDE.md
- Developer guide in docs/DEVELOPER.md

## [2.0.0] - 2025-01-25

### Changed
- Complete redesign to ChatGPT-style interface
- Migrated from multi-page to single-page chat interface
- Redesigned contract upload flow with party selection
- Implemented sliding panel for contract details
- Enhanced mobile responsiveness

### Added
- Real-time chat interface for contract analysis
- Token-based usage system (1000 free tokens)
- Contract risk scoring and visualization
- Recent contracts sidebar with resume functionality
- Saved prompts feature
- Dark/Light theme toggle
- Comprehensive RTL support for Arabic

### Improved
- Performance optimization with lazy loading
- Enhanced error handling and user feedback
- Better session management
- Streamlined authentication flow

## [1.5.0] - 2025-01-20

### Added
- Google OAuth authentication
- Microsoft OAuth authentication
- Email verification system
- Password reset functionality
- User preferences storage
- Notification system

### Changed
- Updated authentication flow
- Enhanced security measures
- Improved session handling

## [1.4.0] - 2025-01-15

### Added
- Real-time analytics dashboard
- Risk distribution charts using Recharts
- Contract type analysis
- Recent activity tracking
- WebSocket support for live updates

### Improved
- Dashboard performance
- Data visualization
- Loading states
- Error boundaries

## [1.3.0] - 2025-01-10

### Added
- Electron desktop application
- Native app features
- System tray integration
- Splash screen
- Auto-updater

### Changed
- Improved offline capabilities
- Enhanced file handling
- Better performance on desktop

## [1.2.0] - 2025-01-05

### Added
- Contract extraction pipeline
- PDF parsing with pdf.js
- DOCX parsing with mammoth.js
- Automated risk assessment
- Key information extraction

### Improved
- Document processing accuracy
- Support for complex contracts
- Multi-language extraction

## [1.1.0] - 2024-12-28

### Added
- Bilingual support (Arabic/English)
- RTL/LTR layout switching
- Browser language detection
- Translated UI elements
- Arabic contract analysis

### Changed
- Updated UI for better RTL support
- Improved font rendering
- Enhanced navigation for both languages

## [1.0.0] - 2024-12-20

### Added
- Initial release
- Basic contract upload functionality
- User authentication
- Simple dashboard
- Contract storage
- Basic analysis features

### Security
- Implemented secure authentication
- Added CSRF protection
- Encrypted sensitive data
- Secure session management

---

## Version History Summary

### Major Versions
- **2.0.0** - ChatGPT-style redesign
- **1.0.0** - Initial release

### Feature Milestones
- OAuth Integration (v1.5.0)
- Analytics Dashboard (v1.4.0)
- Desktop Application (v1.3.0)
- Document Extraction (v1.2.0)
- Bilingual Support (v1.1.0)

### Upcoming Features
- [ ] Batch contract upload
- [ ] Team collaboration
- [ ] API access for enterprise
- [ ] Advanced contract templates
- [ ] AI-powered contract drafting
- [ ] Integration with legal databases
- [ ] Mobile applications (iOS/Android)

---

<div align="center">
  <p>For detailed commit history, visit our <a href="https://github.com/contramind/contramind">GitHub repository</a></p>
</div># Contributing to ContraMind

We're thrilled that you're interested in contributing to ContraMind! This document provides guidelines for contributing to the project.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Community](#community)

## Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inspiring community for all. Contributors are expected to:
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior
- Harassment, discriminatory language, or personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## Getting Started

### Prerequisites
1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/contramind.git
   cd contramind
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/contramind/contramind.git
   ```

### Development Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
3. Set up the database:
   ```bash
   npm run db:push
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## Development Process

### 1. Create a Branch
Always create a new branch for your work:
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b bugfix/issue-description
```

### 2. Make Your Changes
- Write clean, readable code
- Add appropriate comments
- Update documentation if needed
- Write or update tests for your changes

### 3. Test Your Changes
```bash
# Run type checking
npm run typecheck

# Run linting
npm run lint

# Run tests
npm test

# Test the application manually
npm run dev
```

### 4. Commit Your Changes
Follow our commit message conventions (see below).

### 5. Push and Create a Pull Request
```bash
git push origin feature/your-feature-name
```
Then create a pull request on GitHub.

## Coding Standards

### TypeScript Guidelines
```typescript
// Use explicit types
interface UserData {
  id: string;
  email: string;
  name: string;
}

// Avoid 'any' type
function processUser(user: UserData): void {
  // Implementation
}

// Use enums for constants
enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

// Document complex functions
/**
 * Processes contract data and returns risk assessment
 * @param contract - The contract to analyze
 * @returns Risk assessment result
 */
function analyzeContract(contract: Contract): RiskAssessment {
  // Implementation
}
```

### React Best Practices
```typescript
// Use functional components with hooks
export function Component({ prop }: Props) {
  const [state, setState] = useState<string>('');
  
  // Use useCallback for event handlers
  const handleClick = useCallback(() => {
    // Handle click
  }, [dependency]);
  
  return <div onClick={handleClick}>{state}</div>;
}

// Use proper prop types
interface ComponentProps {
  title: string;
  onSave: (data: FormData) => void;
  children: React.ReactNode;
}
```

### CSS/Styling Guidelines
- Use Tailwind CSS utilities first
- Use CSS modules for complex component-specific styles
- Follow mobile-first responsive design
- Maintain consistent spacing and colors from the design system

### File Organization
```
src/
├── components/      # Reusable components
│   ├── ui/         # Basic UI components
│   └── ...         # Feature components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── lib/            # Utilities and helpers
├── contexts/       # React contexts
└── types/          # TypeScript type definitions
```

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

### Examples
```bash
feat(auth): add Google OAuth integration

- Implement Google OAuth strategy
- Add login button component
- Update user schema for OAuth data

Closes #123

---

fix(contracts): correct risk calculation for payment terms

The risk level was not properly calculated when payment
terms exceeded 60 days. This fix ensures proper risk
assessment for extended payment schedules.

---

docs(api): update contract upload endpoint documentation

- Add missing parameters
- Include example responses
- Document error codes
```

## Pull Request Process

### Before Submitting
1. **Update your branch**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Ensure all tests pass**

3. **Update documentation** if you've made API changes

4. **Add tests** for new functionality

### PR Template
When creating a pull request, please include:
- **Description**: Clear explanation of changes
- **Related Issue**: Link to related issue(s)
- **Type of Change**: Bug fix, feature, etc.
- **Testing**: How you tested the changes
- **Screenshots**: For UI changes

### Review Process
1. At least one maintainer review is required
2. All CI checks must pass
3. No merge conflicts
4. Code coverage should not decrease

## Issue Guidelines

### Bug Reports
Please include:
- Clear, descriptive title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (OS, browser, etc.)
- Screenshots if applicable
- Error messages and logs

### Feature Requests
Please include:
- Clear problem statement
- Proposed solution
- Alternative solutions considered
- Additional context

### Good First Issues
Look for issues labeled `good first issue` if you're new to the project.

## Community

### Communication Channels
- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussions
- **Email**: dev@contramind.ai for security issues

### Getting Help
- Check existing documentation
- Search closed issues
- Ask in GitHub Discussions
- Reach out to maintainers

## Recognition

Contributors will be recognized in:
- The project README
- Release notes
- Our website's contributors page

## License

By contributing to ContraMind, you agree that your contributions will be licensed under the project's MIT License.

---

Thank you for contributing to ContraMind! Your efforts help make contract management better for everyone.