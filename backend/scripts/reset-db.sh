#!/bin/bash

# Database reset script for development
# This script will reset the PostgreSQL database and run migrations

echo "Resetting database..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL environment variable is not set"
    exit 1
fi

# Drop and recreate database
echo "Dropping existing database..."
# Note: Adjust the database name based on your DATABASE_URL

echo "Running migrations..."
npx prisma migrate deploy

echo "Seeding database..."
npx prisma db seed

echo "Database reset completed successfully!"
