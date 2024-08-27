#!/bin/sh

# Check environment and run necessary commands
if [ "$NODE_ENV" = "development" ]; then
  echo "Running migrations and seeding for $NODE_ENV environment..."
  npx sequelize-cli db:drop
  npx sequelize-cli db:create
  npx sequelize-cli db:migrate
  npx sequelize-cli db:seed:all
fi

if [ "$NODE_ENV" = "production" ]; then
  echo "Running migrations for $NODE_ENV environment..."
  npx sequelize-cli db:migrate
  npx sequelize-cli db:seed:all
fi

# Start the application
npm run build
npm start
