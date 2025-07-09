# Use official Node.js runtime
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application source
COPY . .

# Build the application
RUN npm run build

# Expose port (Cloud Run uses PORT env variable)
EXPOSE 8080

# Start the application
CMD ["npm", "start"]