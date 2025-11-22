#!/bin/bash

# Database restore script
# Restores the database from a backup file

echo "Restoring database from backup..."

if [ -z "$1" ]; then
    echo "Usage: ./restore-db.sh <backup_file>"
    echo "Example: ./restore-db.sh ./backups/backup_20240101_120000.sql.gz"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL environment variable is not set"
    exit 1
fi

# Extract database info from DATABASE_URL
if [[ $DATABASE_URL =~ postgresql://([^:]+):([^@]+)@([^:]+):([^/]+)/(.+) ]]; then
    DB_USER="${BASH_REMATCH[1]}"
    DB_PASS="${BASH_REMATCH[2]}"
    DB_HOST="${BASH_REMATCH[3]}"
    DB_PORT="${BASH_REMATCH[4]}"
    DB_NAME="${BASH_REMATCH[5]}"
else
    echo "Error: Could not parse DATABASE_URL"
    exit 1
fi

# Check if backup is compressed
if [[ $BACKUP_FILE == *.gz ]]; then
    echo "Decompressing backup..."
    TEMP_FILE="${BACKUP_FILE%.gz}"
    gunzip -c "$BACKUP_FILE" > "$TEMP_FILE"
    RESTORE_FILE="$TEMP_FILE"
else
    RESTORE_FILE="$BACKUP_FILE"
fi

# Confirm before restoring
read -p "This will overwrite the current database. Are you sure? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Restore cancelled"
    [ "$TEMP_FILE" ] && rm -f "$TEMP_FILE"
    exit 0
fi

# Restore using pg_restore
export PGPASSWORD="$DB_PASS"
pg_restore -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c -v "$RESTORE_FILE"

if [ $? -eq 0 ]; then
    echo "Database restored successfully from: $BACKUP_FILE"
else
    echo "Error: Restore failed"
    unset PGPASSWORD
    [ "$TEMP_FILE" ] && rm -f "$TEMP_FILE"
    exit 1
fi

# Cleanup temporary file
[ "$TEMP_FILE" ] && rm -f "$TEMP_FILE"

unset PGPASSWORD

echo "Restore completed!"