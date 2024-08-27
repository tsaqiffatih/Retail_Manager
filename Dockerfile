# Base image with Node.js
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

# Build the TypeScript files
RUN npm run build

# Expose the port your app will run on
EXPOSE 3000

# Define environment variables (override in docker-compose.yml)
ENV NODE_ENV=production

# Command to start the app
CMD ["npm", "start"]
