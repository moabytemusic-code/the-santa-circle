-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnums safely
DO $$ BEGIN CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "FamilyRole" AS ENUM ('ADMIN', 'MEMBER'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "ExchangeStatus" AS ENUM ('DRAFT', 'CONFIRMING', 'READY_TO_DRAW', 'DRAWN', 'COMPLETED', 'ARCHIVED'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "ParticipantStatus" AS ENUM ('INVITED', 'CONFIRMED', 'DECLINED'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "ProgressStatus" AS ENUM ('PLANNING', 'SHOPPING', 'PURCHASED', 'WRAPPED', 'COMPLETED'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "MusicCategory" AS ENUM ('CLASSIC', 'INSTRUMENTAL', 'PEACEFUL', 'FESTIVE', 'CUSTOM'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "MusicSource" AS ENUM ('BUILTIN', 'UPLOADED'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "avatarUrl" TEXT,
    "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "FamilyGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdById" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "FamilyMembership" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "familyGroupId" TEXT NOT NULL REFERENCES "FamilyGroup"("id") ON DELETE CASCADE,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "role" "FamilyRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FamilyMembership_familyGroupId_userId_key" UNIQUE ("familyGroupId", "userId")
);

CREATE TABLE IF NOT EXISTS "Invitation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "familyGroupId" TEXT NOT NULL REFERENCES "FamilyGroup"("id") ON DELETE CASCADE,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL UNIQUE,
    "role" "FamilyRole" NOT NULL DEFAULT 'MEMBER',
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "PasswordReset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "token" TEXT NOT NULL UNIQUE,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "EmailVerification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "token" TEXT NOT NULL UNIQUE,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "GiftExchange" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "familyGroupId" TEXT NOT NULL REFERENCES "FamilyGroup"("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "budget" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "exchangeDate" TIMESTAMP(3) NOT NULL,
    "drawDate" TIMESTAMP(3),
    "participationDeadline" TIMESTAMP(3),
    "location" TEXT,
    "instructions" TEXT,
    "status" "ExchangeStatus" NOT NULL DEFAULT 'DRAFT',
    "drawnAt" TIMESTAMP(3),
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "stripeSessionId" TEXT,
    "stripeCustomerId" TEXT,
    "createdById" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GiftExchange_familyGroupId_year_key" UNIQUE ("familyGroupId", "year")
);

CREATE TABLE IF NOT EXISTS "ExchangeParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "exchangeId" TEXT NOT NULL REFERENCES "GiftExchange"("id") ON DELETE CASCADE,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "status" "ParticipantStatus" NOT NULL DEFAULT 'INVITED',
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExchangeParticipant_exchangeId_userId_key" UNIQUE ("exchangeId", "userId")
);

CREATE TABLE IF NOT EXISTS "ExclusionRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "exchangeId" TEXT NOT NULL REFERENCES "GiftExchange"("id") ON DELETE CASCADE,
    "userAId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "userBId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExclusionRule_exchangeId_userAId_userBId_key" UNIQUE ("exchangeId", "userAId", "userBId")
);

CREATE TABLE IF NOT EXISTS "GiftAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "exchangeId" TEXT NOT NULL REFERENCES "GiftExchange"("id") ON DELETE CASCADE,
    "giverId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "recipientId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "drawnAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revealedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GiftAssignment_exchangeId_giverId_key" UNIQUE ("exchangeId", "giverId"),
    CONSTRAINT "GiftAssignment_exchangeId_recipientId_key" UNIQUE ("exchangeId", "recipientId")
);

CREATE TABLE IF NOT EXISTS "WishList" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "exchangeId" TEXT NOT NULL REFERENCES "GiftExchange"("id") ON DELETE CASCADE,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "notes" TEXT,
    "favoriteColors" TEXT,
    "sizes" TEXT,
    "interests" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WishList_exchangeId_userId_key" UNIQUE ("exchangeId", "userId")
);

CREATE TABLE IF NOT EXISTS "WishListItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wishListId" TEXT NOT NULL REFERENCES "WishList"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "price" DECIMAL(10,2),
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "isPurchased" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "GiftProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "exchangeId" TEXT NOT NULL REFERENCES "GiftExchange"("id") ON DELETE CASCADE,
    "giverId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "status" "ProgressStatus" NOT NULL DEFAULT 'PLANNING',
    "notes" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GiftProgress_exchangeId_giverId_key" UNIQUE ("exchangeId", "giverId")
);

CREATE TABLE IF NOT EXISTS "ExchangeNotification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "exchangeId" TEXT NOT NULL REFERENCES "GiftExchange"("id") ON DELETE CASCADE,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "type" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "error" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "MusicTrack" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "artist" TEXT,
    "category" "MusicCategory" NOT NULL DEFAULT 'FESTIVE',
    "source" "MusicSource" NOT NULL DEFAULT 'BUILTIN',
    "filePath" TEXT NOT NULL,
    "mimeType" TEXT,
    "duration" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "uploadedById" TEXT REFERENCES "User"("id") ON DELETE SET NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "UserPreference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE REFERENCES "User"("id") ON DELETE CASCADE,
    "musicEnabled" BOOLEAN NOT NULL DEFAULT false,
    "musicVolume" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "snowEnabled" BOOLEAN NOT NULL DEFAULT true,
    "soundEffectsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "reducedMotion" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "AuditEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT REFERENCES "User"("id") ON DELETE SET NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "details" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");
CREATE INDEX IF NOT EXISTS "FamilyGroup_createdById_idx" ON "FamilyGroup"("createdById");
CREATE INDEX IF NOT EXISTS "FamilyMembership_familyGroupId_idx" ON "FamilyMembership"("familyGroupId");
CREATE INDEX IF NOT EXISTS "FamilyMembership_userId_idx" ON "FamilyMembership"("userId");
CREATE INDEX IF NOT EXISTS "Invitation_familyGroupId_idx" ON "Invitation"("familyGroupId");
CREATE INDEX IF NOT EXISTS "Invitation_token_idx" ON "Invitation"("token");
CREATE INDEX IF NOT EXISTS "Invitation_email_idx" ON "Invitation"("email");
CREATE INDEX IF NOT EXISTS "GiftExchange_familyGroupId_idx" ON "GiftExchange"("familyGroupId");
CREATE INDEX IF NOT EXISTS "GiftExchange_status_idx" ON "GiftExchange"("status");
CREATE INDEX IF NOT EXISTS "ExchangeParticipant_exchangeId_idx" ON "ExchangeParticipant"("exchangeId");
CREATE INDEX IF NOT EXISTS "ExchangeParticipant_userId_idx" ON "ExchangeParticipant"("userId");
CREATE INDEX IF NOT EXISTS "ExclusionRule_exchangeId_idx" ON "ExclusionRule"("exchangeId");
CREATE INDEX IF NOT EXISTS "GiftAssignment_exchangeId_idx" ON "GiftAssignment"("exchangeId");
CREATE INDEX IF NOT EXISTS "GiftAssignment_giverId_idx" ON "GiftAssignment"("giverId");
CREATE INDEX IF NOT EXISTS "GiftAssignment_recipientId_idx" ON "GiftAssignment"("recipientId");
CREATE INDEX IF NOT EXISTS "WishList_exchangeId_idx" ON "WishList"("exchangeId");
CREATE INDEX IF NOT EXISTS "WishList_userId_idx" ON "WishList"("userId");
CREATE INDEX IF NOT EXISTS "WishListItem_wishListId_idx" ON "WishListItem"("wishListId");
CREATE INDEX IF NOT EXISTS "GiftProgress_exchangeId_idx" ON "GiftProgress"("exchangeId");
CREATE INDEX IF NOT EXISTS "GiftProgress_giverId_idx" ON "GiftProgress"("giverId");
CREATE INDEX IF NOT EXISTS "MusicTrack_category_idx" ON "MusicTrack"("category");
CREATE INDEX IF NOT EXISTS "MusicTrack_isActive_idx" ON "MusicTrack"("isActive");

-- Idempotent upgrades for Host Pass & monetization
ALTER TABLE "GiftExchange" ADD COLUMN IF NOT EXISTS "isPremium" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "GiftExchange" ADD COLUMN IF NOT EXISTS "stripeSessionId" TEXT;
ALTER TABLE "GiftExchange" ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT;
