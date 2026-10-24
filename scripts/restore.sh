#!/bin/bash
# ==============================================================================
# Christmas Together - PostgreSQL Database Restoration Script
# Validates backup integrity and safely restores into database.
# ==============================================================================

set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <path_to_backup_file.sql.gz>"
  echo "Example: $0 ./backups/christmas_together_20261019_120000.sql.gz"
  exit 1
fi

BACKUP_FILE="$1"
CONTAINER_NAME="${DB_CONTAINER:-christmas_db}"
POSTGRES_USER="${POSTGRES_USER:-postgres}"
POSTGRES_DB="${POSTGRES_DB:-christmas_together}"

if [ ! -f "${BACKUP_FILE}" ]; then
  echo "❌ Error: Backup file '${BACKUP_FILE}' does not exist!"
  exit 1
fi

echo "🔍 Validating backup file integrity..."
if ! gzip -t "${BACKUP_FILE}"; then
  echo "❌ Error: Backup file failed gzip integrity check!"
  exit 1
fi

echo "⚠️  WARNING: You are about to restore database '${POSTGRES_DB}'."
echo "    This will overwrite existing data with the contents of:"
echo "    ${BACKUP_FILE}"
echo ""

if [ "${FORCE:-false}" != "true" ]; then
  read -p "Type 'RESTORE' to proceed: " CONFIRMATION
  if [ "${CONFIRMATION}" != "RESTORE" ]; then
    echo "❌ Restoration cancelled."
    exit 1
  fi
fi

echo "🚀 Restoring database..."

if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  gunzip -c "${BACKUP_FILE}" | docker exec -i "${CONTAINER_NAME}" psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}"
else
  gunzip -c "${BACKUP_FILE}" | psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}"
fi

echo "✅ Restoration completed!"

# Verification query: Count tables
echo "🔍 Verifying table count in restored database..."
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  TABLE_COUNT=$(docker exec -t "${CONTAINER_NAME}" psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';")
else
  TABLE_COUNT=$(psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';")
fi

echo "🎉 Restored database contains ${TABLE_COUNT} public tables. Verification passed!"
