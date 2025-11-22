#!/bin/bash

# Database reset script for development
# This script will reset the PostgreSQL database and run migrations

echo "⚠️  WARNING: This will delete all data in your database!"
echo "This script should only be used in development environments."
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL environment variable is not set"
    exit 1
fi

# Confirm before proceeding
read -p "Are you sure you want to reset the database? (type 'yes' to confirm): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Database reset cancelled"
    exit 0
fi

echo ""
echo "Resetting database..."

# Reset Prisma migrations
echo "Resetting Prisma..."
npx prisma migrate reset --force

if [ $? -ne 0 ]; then
    echo "Error: Failed to reset database"
    exit 1
fi

echo ""
echo "Running migrations..."
npx prisma migrate deploy

if [ $? -ne 0 ]; then
    echo "Error: Failed to run migrations"
    exit 1
fi

echo ""
echo "Seeding database..."
npx prisma db seed

if [ $? -ne 0 ]; then
    echo "Warning: Seeding failed, but database was reset successfully"
    exit 0
fi

echo ""
echo "✅ Database reset completed successfully!"
echo ""
echo "Default users created:"
echo "  Admin: admin@stockmaster.com / Admin@123"
echo "  User:  user@stockmaster.com / User@123"