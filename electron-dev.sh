#!/bin/bash
# Start ContraMind Desktop App in development mode

echo "Starting ContraMind Desktop App..."

# Check if server is running on port 5000
if ! nc -z localhost 5000 2>/dev/null; then
    echo "Server not running on port 5000. Please start it first with: npm run dev"
    exit 1
fi

# Start Electron
echo "Launching Electron..."
NODE_ENV=development npx electron desktop/main.js