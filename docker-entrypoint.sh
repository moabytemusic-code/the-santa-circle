#!/bin/sh

echo "🎄 Christmas Together - Starting container..."

if [ -n "$DATABASE_URL" ]; then
  DB_HOST="${DB_HOST:-db}"
  DB_PORT="${DB_PORT:-5432}"

  echo "⏳ Checking PostgreSQL connection at $DB_HOST:$DB_PORT..."
  for i in $(seq 1 30); do
    if pg_isready -h "$DB_HOST" -p "$DB_PORT" > /dev/null 2>&1; then
      echo "✅ PostgreSQL is ready and accepting connections!"
      break
    fi
    echo "Database not ready yet (attempt $i/30). Waiting 2s..."
    sleep 2
  done

  # Run idempotent schema initialization
  if [ -f "/app/prisma/init.sql" ]; then
    echo "📦 Ensuring database schema is up-to-date (prisma/init.sql)..."
    DB_URL_CLEAN="${DATABASE_URL%%\?*}"
    echo "Connecting to PostgreSQL database..."
    psql "$DB_URL_CLEAN" -f /app/prisma/init.sql || echo "⚠️ Notice: SQL init finished with notices."
  fi

  # Run seed script (idempotent: seeds admin user & initial exchange if empty)
  if [ -f "/app/prisma/seed.js" ]; then
    echo "🌱 Running seed script..."
    node /app/prisma/seed.js || echo "⚠️ Notice: Seed script finished."
  fi
fi

echo "🚀 Launching Next.js application server..."
exec node server.js
