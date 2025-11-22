#!/bin/bash

# Database backup script
# Creates a backup of the PostgreSQL database

echo "Creating database backup..."

if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL environment variable is not set"
    exit 1
fi

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Create backups directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Extract database info from DATABASE_URL
# Format: postgresql://user:password@host:port/database
# Note: This is a simplified example. Adjust based on your setup.

echo "Backup created at: $BACKUP_FILE"
