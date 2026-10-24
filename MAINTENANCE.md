# 🛠️ Maintenance & Operations Guide

This guide covers ongoing maintenance, automated backup routines, database restoration, and application updates for **Christmas Together**.

---

## 1. Automated Backup Procedures

### Recommended Backup Schedule
- **Frequency:** Daily at 02:00 AM local time.
- **Retention:** 30 days of rolling automated backups.

### Setting up a Cron Job on Host / Server
Add the following entry to your server's crontab (`crontab -e`):

```bash
# Daily Christmas Together backup at 02:00 AM
0 2 * * * /path/to/christmas-together/scripts/backup.sh >> /var/log/christmas_backup.log 2>&1
```

### Manual Backup Execution
```bash
cd /path/to/christmas-together
./scripts/backup.sh
```

### Verification Checks Performed by `backup.sh`:
1. Verifies that the `.sql.gz` archive is non-empty.
2. Runs `gzip -t` to test archive integrity.
3. Calculates and stores a companion `.sha256` checksum file.
4. Prunes backups older than 30 days automatically.

---

## 2. Disaster Recovery & Database Restoration

To restore a previous backup snapshot:

```bash
./scripts/restore.sh ./backups/christmas_together_YYYYMMDD_HHMMSS.sql.gz
```

The script will:
1. Verify the gzip integrity of the backup file before touching the database.
2. Require typing `RESTORE` to confirm the destructive action.
3. Pipe the decompressed SQL directly into PostgreSQL.
4. Execute an automated SQL query counting public tables to verify successful restoration.

---

## 3. Updating the Application

When a new version or commit is available:

1. **Pull the latest code:**
   ```bash
   git pull origin main
   ```
2. **Rebuild the Docker containers:**
   ```bash
   docker compose build --no-cache app
   docker compose up -d
   ```
3. **Run pending database migrations:**
   ```bash
   docker compose exec app npx prisma migrate deploy
   ```
4. **Verify container health:**
   ```bash
   docker compose ps
   curl -i http://localhost:3000/api/health
   ```

---

## 4. Off-Server Backup Storage

For enterprise-grade resilience, sync your `./backups` folder to remote S3-compatible cloud storage (e.g. AWS S3, Cloudflare R2, Backblaze B2) using `rclone`:

```bash
# Example rclone sync command
rclone sync /path/to/christmas-together/backups remote-s3:family-christmas-backups/
```
