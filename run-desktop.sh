#!/bin/bash

echo "Starting ContraMind Desktop App..."

# Check if the main app is running on port 5000
if ! nc -z localhost 5000 2>/dev/null; then
    echo "Main app not running on port 5000. Starting it first..."
    npm run dev &
    echo "Waiting for server to start..."
    while ! nc -z localhost 5000 2>/dev/null; do
        sleep 1
    done
    echo "Server started!"
fi

# Navigate to desktop folder and start the app
cd desktop

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing desktop dependencies..."
    npm install
fi

# Start the desktop app
echo "Starting Electron app..."
npm run start:dev