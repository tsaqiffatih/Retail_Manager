
FROM node:18-alpine

# Set working directory di dalam container
WORKDIR /app

# Copy package.json and package-lock.json file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code into container
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Run app
CMD ["npm", "run", "dev"]
