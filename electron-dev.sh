#!/bin/bash
# Start ContraMind Desktop App in development mode

echo "Starting ContraMind Desktop App..."

# Wait for server to be ready on port 5000
echo "Waiting for server on http://localhost:5000..."
npx wait-on http://localhost:5000

# Start Electron
echo "Launching Electron..."
NODE_ENV=development npx electron desktop/main.js