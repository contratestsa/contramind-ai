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
</div>