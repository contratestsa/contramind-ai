# ContraMind Desktop App Setup Instructions

## Initial Setup

Since we can't directly install packages in the desktop subfolder from Replit, follow these steps to set up the desktop app:

### Option 1: Manual Setup (Recommended for Development)

1. Open a shell terminal in Replit
2. Navigate to the desktop folder:
   ```bash
   cd desktop
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

### Option 2: Using the Startup Script

1. Open a shell terminal
2. Run the startup script:
   ```bash
   ./run-desktop.sh
   ```

This script will:
- Check if the main app is running on port 5000
- Start the main app if it's not running
- Install desktop dependencies if needed
- Launch the Electron desktop app

## Running the Desktop App

### Development Mode

1. Make sure the main app is running on port 5000:
   ```bash
   npm run dev
   ```

2. In a new terminal, run:
   ```bash
   cd desktop && npm run start:dev
   ```

### Building for Distribution

1. First build the web app:
   ```bash
   npm run build
   ```

2. Then build the desktop app:
   ```bash
   cd desktop
   npm run build:mac    # For macOS
   npm run build:win    # For Windows
   npm run build:linux  # For Linux
   ```

## Notes

- The desktop app wraps the existing web application
- In development, it connects to `http://localhost:5000`
- In production, it serves the built files from the `dist` directory
- Icons need to be added: `icon.png` (512x512), `icon.ico`, `icon.icns`

## Troubleshooting

If you encounter issues:
1. Ensure the main app is running on port 5000
2. Check that all desktop dependencies are installed
3. For production builds, ensure the web app is built first