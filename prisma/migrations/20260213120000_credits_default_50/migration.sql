-- New sign-ups get 50 credits by default (no Stripe).
ALTER TABLE "User" ALTER COLUMN "credits" SET DEFAULT 50;
