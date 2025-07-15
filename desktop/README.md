# ContraMind Desktop Application

This is the Electron wrapper for the ContraMind web application.

## Development

### Prerequisites
- Node.js 20
- The main ContraMind app running on port 5000

### Running in Development

1. First, make sure the main app is running:
   ```bash
   npm run dev
   ```

2. In a new terminal, navigate to the desktop folder:
   ```bash
   cd desktop
   npm install
   npm run start:dev
   ```

The desktop app will connect to the web app running on `http://localhost:5000`.

## Building for Production

### Prerequisites
1. Build the web app first from the root directory:
   ```bash
   npm run build
   ```

2. Install desktop dependencies:
   ```bash
   cd desktop
   npm install
   ```

### Build Commands

- **macOS**: `npm run build:mac`
- **Windows**: `npm run build:win`
- **Linux**: `npm run build:linux`
- **All platforms**: `npm run build`

Built applications will be in the `desktop/build` directory.

## Application Structure

- `main.js` - Main Electron process
- `preload.js` - Preload script for security
- `package.json` - Desktop app configuration
- `entitlements.mac.plist` - macOS code signing entitlements

## Icons

You'll need to add the following icon files:
- `icon.png` - 512x512 PNG for Linux
- `icon.ico` - Windows icon
- `icon.icns` - macOS icon

## Security

The app uses context isolation and disables Node.js integration in the renderer process for security. Communication between the main and renderer processes is handled through the preload script.