#!/bin/bash
# ==============================================================================
# Christmas Together - Automated PostgreSQL Backup Script
# Performs compressed pg_dump, verifies integrity, and manages retention.
# ==============================================================================

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILENAME="christmas_together_${TIMESTAMP}.sql.gz"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_FILENAME}"

CONTAINER_NAME="${DB_CONTAINER:-christmas_db}"
POSTGRES_USER="${POSTGRES_USER:-postgres}"
POSTGRES_DB="${POSTGRES_DB:-christmas_together}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"

echo "🎄 [Backup] Starting Christmas Together database backup..."

# Ensure backup directory exists
mkdir -p "${BACKUP_DIR}"

# Execute pg_dump from Docker container or local psql
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "📦 Executing pg_dump inside container '${CONTAINER_NAME}'..."
  docker exec -t "${CONTAINER_NAME}" pg_dump -U "${POSTGRES_USER}" "${POSTGRES_DB}" | gzip > "${BACKUP_PATH}"
else
  echo "⚠️ Container '${CONTAINER_NAME}' not running, attempting direct pg_dump..."
  pg_dump -U "${POSTGRES_USER}" "${POSTGRES_DB}" | gzip > "${BACKUP_PATH}"
fi

# Verification 1: Check file exists and size is non-zero
if [ ! -s "${BACKUP_PATH}" ]; then
  echo "❌ [Backup Error] Backup file is empty or was not created!"
  rm -f "${BACKUP_PATH}"
  exit 1
fi

# Verification 2: Test gzip integrity
if ! gzip -t "${BACKUP_PATH}"; then
  echo "❌ [Backup Error] Gzip integrity test failed for ${BACKUP_PATH}!"
  rm -f "${BACKUP_PATH}"
  exit 1
fi

# Generate SHA-256 checksum for audit and integrity verification
if command -v shasum >/dev/null 2>&1; then
  shasum -a 256 "${BACKUP_PATH}" > "${BACKUP_PATH}.sha256"
elif command -v sha256sum >/dev/null 2>&1; then
  sha256sum "${BACKUP_PATH}" > "${BACKUP_PATH}.sha256"
fi

FILE_SIZE=$(du -h "${BACKUP_PATH}" | cut -f1)
echo "✅ [Backup Success] Verified backup created: ${BACKUP_PATH} (${FILE_SIZE})"

# Retention policy: remove backups older than RETENTION_DAYS
echo "🧹 Cleaning up backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -name "christmas_together_*.sql.gz*" -mtime +"${RETENTION_DAYS}" -delete || true

echo "🎁 Backup process finished successfully!"
