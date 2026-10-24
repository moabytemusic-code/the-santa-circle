# 🛡️ Security Architecture & Privacy Checklist

This document details the security posture and privacy guarantees enforced in **Christmas Together**.

---

## 1. Secret Santa Privacy Guarantee

### The Zero-Leakage Assignment Model
1. **Giver-Only Access:**
   Assignments can only ever be queried by the specific authenticated participant who is giving the gift:
   ```typescript
   // Query strictly filtered by authenticated session giverId
   const assignment = await prisma.giftAssignment.findUnique({
     where: {
       exchangeId_giverId: {
         exchangeId,
         giverId: session.id,
       },
     },
   });
   ```
2. **Administrator Privilege Separation:**
   Family administrators can view participation lists, invite family members, and trigger drawings, but **cannot view secret recipient pairings**. The application intentionally does not render global assignment lists to administrators.
3. **Email Notification Privacy:**
   Emails sent to participants inform them that their drawing is ready and provide a secure link to the web app. **Recipient names are NEVER included in transactional email messages**, protecting against email interception, snooping, or mailbox sharing.

---

## 2. Authentication & Session Security

- **Password Hashing:**
  All user passwords are encrypted using `bcrypt` with **12 salt rounds**. Passwords are never stored in plaintext or logged.
- **Session Tokens:**
  Sessions utilize encrypted JSON Web Tokens (`HS256` signed with a high-entropy `AUTH_SECRET`) stored in `HttpOnly`, `SameSite=Lax`, and `Secure` (production) cookies.
- **Invitation & Password Reset Tokens:**
  Generated using cryptographic random bytes (`crypto.randomBytes(32)`). Tokens have strict expiration windows (2 hours for password resets, 7 days for family invitations) and are single-use.
- **Enumeration Protection:**
  The forgot-password endpoint returns an identical generic confirmation message regardless of whether an email exists in the database.

---

## 3. Uploaded File Security & Music Storage

- **Format Validation via Magic Bytes:**
  File uploads are not trusted by filename or `Content-Type` header alone. Audio buffers are inspected for valid magic byte headers:
  - MP3: `ID3` tag or audio frame sync bits (`0xFFFB`)
  - OGG: `OggS` container header
  - WAV: `RIFF` ... `WAVE`
- **Execution Prevention:**
  Uploaded files are saved with newly generated random UUID filenames and forced safe extensions (`.mp3`, `.ogg`, `.wav`).
  The upload directory is mounted as a data volume without execute permissions.
- **Path Traversal Guard:**
  File resolution verifies that paths strictly stay within `UPLOAD_DIR`.

---

## 4. Drawing Engine Integrity & Concurrency

- **Atomic Transactions:**
  Drawing assignments, status changes, and notification queues are committed in a single atomic PostgreSQL transaction (`prisma.$transaction`).
- **Idempotency & Race Protection:**
  The drawing engine checks `exchange.status`. If an exchange has already been marked `DRAWN`, duplicate drawing requests are immediately rejected.
- **Emergency Reset Safety:**
  Any administrative reset of drawn assignments requires entering an explicit verification code (`CONFIRM_RESET_DRAWING`) and logs an audit event.

---

## 5. Security Checklist for Production

- [x] Dedicated PostgreSQL container isolated on private Docker network
- [x] No sensitive database ports exposed to public internet
- [x] HTTPS enforced via reverse proxy (Coolify/Traefik)
- [x] Strict session cookie flags: `HttpOnly`, `SameSite=Lax`, `Secure`
- [x] Recipient names excluded from email notifications
- [x] Passwords hashed with bcrypt (12 rounds)
- [x] Unguessable invitation and password recovery tokens
- [x] Audio file buffer validation with magic bytes
- [x] Verified automated database backups with SHA-256 checksums
