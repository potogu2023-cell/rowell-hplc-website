-- Migration: Add password authentication support to users table
-- Date: 2026-01-29
-- Purpose: Enable email/password registration and login

-- Step 1: Modify openId to be nullable (for password-based users)
ALTER TABLE users MODIFY COLUMN openId VARCHAR(64) NULL;

-- Step 2: Add password hash column
ALTER TABLE users ADD COLUMN IF NOT EXISTS passwordHash VARCHAR(255) NULL;

-- Step 3: Make email unique and not null
ALTER TABLE users MODIFY COLUMN email VARCHAR(320) NOT NULL;
ALTER TABLE users ADD UNIQUE INDEX IF NOT EXISTS idx_users_email (email);

-- Step 4: Add additional user profile fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS company VARCHAR(255) NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50) NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS country VARCHAR(100) NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS industry VARCHAR(100) NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS purchasingRole VARCHAR(100) NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS annualPurchaseVolume VARCHAR(100) NULL;

-- Verification queries (run these to check the migration)
-- DESCRIBE users;
-- SELECT COUNT(*) FROM users;
