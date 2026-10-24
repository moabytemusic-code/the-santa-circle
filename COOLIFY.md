# 🚀 Deploying Christmas Together on Coolify

This guide walks you through deploying **Christmas Together** onto your self-hosted **Coolify** instance.

Christmas Together uses a self-contained Docker architecture with:
1. **Next.js 15 Web Application**
2. **Dedicated PostgreSQL 16 Database**
3. **Persistent Volume for PostgreSQL** (`postgres_data`)
4. **Persistent Volume for Music Uploads** (`music_uploads`)

---

## Method 1: Docker Compose Deployment (Recommended)

This method deploys both the application and the dedicated PostgreSQL database together inside a private Docker network.

### Step 1: Create a New Project in Coolify
1. In your Coolify dashboard, select your **Project** and **Environment** (e.g. Production).
2. Click **+ New Resource** &rarr; **Docker Compose**.
3. Name your service `christmas-together`.

### Step 2: Use the Coolify Compose File
Paste the contents of `docker-compose.coolify.yml` (or select the Git repository containing this project and point to `docker-compose.coolify.yml`):

```yaml
version: "3.8"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB:-christmas_together}?schema=public
      - AUTH_SECRET=${AUTH_SECRET}
      - NEXT_PUBLIC_APP_URL=${COOLIFY_URL:-http://localhost:3000}
      - BREVO_API_KEY=${BREVO_API_KEY:-}
      - EMAIL_FROM_ADDRESS=${EMAIL_FROM_ADDRESS:-santa@familydomain.com}
      - EMAIL_FROM_NAME=${EMAIL_FROM_NAME:-Christmas Together}
      - UPLOAD_DIR=/app/uploads/music
      - MAX_UPLOAD_SIZE_MB=15
    volumes:
      - music_uploads:/app/uploads/music
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_DB=${POSTGRES_DB:-christmas_together}
      - POSTGRES_USER=${POSTGRES_USER:-postgres}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-christmas_together}"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  music_uploads:
```

### Step 3: Configure Environment Variables in Coolify
In the **Environment Variables** tab of your resource in Coolify, add:

| Key | Example Value | Description |
|---|---|---|
| `POSTGRES_USER` | `postgres` | Database admin user |
| `POSTGRES_PASSWORD` | *(Click "Generate Secret")* | Strong database password |
| `POSTGRES_DB` | `christmas_together` | PostgreSQL database name |
| `AUTH_SECRET` | *(Click "Generate Secret")* | Minimum 32 characters for session signing |
| `COOLIFY_URL` | `https://secretsanta.yourfamily.com` | Your public HTTPS domain |
| `BREVO_API_KEY` | `xkeysib-...` | Brevo transactional API key |
| `EMAIL_FROM_ADDRESS` | `santa@yourfamily.com` | Verified sender in Brevo |
| `EMAIL_FROM_NAME` | `Christmas Together` | Friendly sender name |

### Step 4: Configure Domain and SSL
1. In the **General Settings** tab of the `app` service, enter your **FQDN** (e.g. `https://secretsanta.yourfamily.com`).
2. Coolify will automatically configure Traefik / Caddy to provision a free Let's Encrypt SSL certificate.

### Step 5: Initial Database Setup
Once the deployment finishes:
1. Open the **Terminal** tab for the `app` container in Coolify.
2. Run database migration and initial seed:
   ```bash
   npx prisma db push
   npm run prisma:seed
   ```
3. Log in with:
   - **Email:** `admin@family.com`
   - **Password:** `ChristmasAdmin2026!`

---

## 🔒 Security Best Practices in Coolify
- The `db` PostgreSQL service is **never exposed to the public internet**; only the internal Docker network connects `app` and `db`.
- All uploads are stored inside the persistent Docker volume `music_uploads` and served safely via an authenticated streaming endpoint.
- HTTPS is strictly enforced through Coolify's reverse proxy.
