#!/bin/bash
# Import resources to database on Render server
# This script should be executed in Render Shell

echo "==================================="
echo "Resource Articles Import Script"
echo "==================================="
echo ""

# Check if SQL file exists
if [ ! -f "./scripts/import_resources.sql" ]; then
  echo "❌ Error: import_resources.sql not found!"
  exit 1
fi

echo "✅ SQL file found: $(wc -l < ./scripts/import_resources.sql) lines"
echo ""

# Import using mysql command
echo "Importing resources to database..."
echo ""

# Extract database credentials from DATABASE_URL
DB_URL=$(grep "DATABASE_URL" .env | cut -d '=' -f2)

# Parse connection string
# Format: mysql://user:password@host:port/database?ssl=true
USER=$(echo $DB_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
PASS=$(echo $DB_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
HOST=$(echo $DB_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
PORT=$(echo $DB_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB=$(echo $DB_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

echo "Database: $DB"
echo "Host: $HOST:$PORT"
echo "User: $USER"
echo ""

# Execute SQL import
mysql -h "$HOST" -P "$PORT" -u "$USER" -p"$PASS" -D "$DB" --connect-timeout=30 < ./scripts/import_resources.sql

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Import completed successfully!"
  echo ""
  
  # Verify
  echo "Verifying import..."
  mysql -h "$HOST" -P "$PORT" -u "$USER" -p"$PASS" -D "$DB" -e "SELECT COUNT(*) as total_resources FROM resources; SELECT title, language, status FROM resources LIMIT 5;" 2>/dev/null
  
  echo ""
  echo "==================================="
  echo "Import completed! Please verify the Resources page on the website."
  echo "==================================="
else
  echo ""
  echo "❌ Import failed! Please check the error messages above."
  exit 1
fi
