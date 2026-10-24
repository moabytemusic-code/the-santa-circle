# 🎅 The Santa Circle

> **Modern, Sleek & Ad-Free Secret Santa for Families & Teams**
> Live at [theSantaCircle.com](https://thesantacircle.com) / [theSantaCircle.app](https://thesantacircle.app)

The Santa Circle is a commercial SaaS and self-hosted Secret Santa application designed to replace clunky, ad-riddled gift exchange tools with an elegant, festive, privacy-first experience.

---

## ✨ Features & Architecture

- **Self-Service Circle Onboarding:**
  - Anyone can visit the site and create a Circle ("The Miller Family", "Marketing Department 2026") in under 60 seconds.
  - Automatic host assignment with an instant invitation link.
- **Monetization Engine (Host Pass $7.99):**
  - **Free Tier:** Up to 15 circle participants, full spouse/partner exclusion rules, secret wish lists, festive music & snow. 100% ad-free.
  - **Host Pass ($7.99 one-time per exchange):** Unlimited circle participants, 1-click Brevo email reminders for unconfirmed guests, exportable exchange summaries, custom reveal countdowns, and priority Brevo routing.
  - Integrated with **Stripe Checkout** & secure webhook validation.
- **Amazon Affiliate Auto-Tagger:**
  - Automatically identifies Amazon store links pasted into wish lists and injects your Associate tag (`thesantacircle-20`) for passive recurring revenue.
  - Formatted with `rel="noopener noreferrer sponsored"`.
- **Fair & Smart Drawing Engine:**
  - Guarantees true 1:1 derangements (every participant gives one gift and receives one gift).
  - Mutual exclusion rules (spouses, managers, past matches).
  - Strict privacy: Even the circle host cannot peek at drawn matches.
- **Transactional Email via Brevo:**
  - Automated drawing alerts, invite follow-up reminders, and password resets.
  - **Zero Privacy Leakage:** Recipient names are never sent over email.
- **Festive Atmosphere:**
  - Integrated Web Audio Christmas carols and customizable snow canvas.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide Icons.
- **Database:** PostgreSQL 16 + Prisma ORM.
- **Payments:** Stripe Checkout & Webhooks.
- **Affiliate:** Amazon Associates Auto-Tagger (`src/lib/affiliate.ts`).
- **Email:** Brevo Transactional SMTP/REST API v3.
- **Hosting:** Docker Compose & Coolify.

---

## 🚀 Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
NEXT_PUBLIC_APP_URL=https://thesantacircle.com
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/santacircle?schema=public"
AUTH_SECRET="your-super-long-random-secret"
BREVO_API_KEY="xkeysib-..."
EMAIL_FROM_ADDRESS="invites@thesantacircle.com"
EMAIL_FROM_NAME="The Santa Circle"
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
AMAZON_AFFILIATE_TAG="thesantacircle-20"
```

---

## 📦 Deployment

```bash
docker compose -f docker-compose.coolify.yml up -d --build
```
