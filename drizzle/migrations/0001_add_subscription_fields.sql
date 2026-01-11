-- Add subscription fields to profiles table
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "subscription_status" text DEFAULT 'active';
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "subscription_plan" text;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "subscription_start_date" timestamp;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "subscription_end_date" timestamp;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "trial_start_date" timestamp;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "trial_end_date" timestamp;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "rectoken" text;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "rectoken_lifetime" text;

-- Create orders table
CREATE TABLE IF NOT EXISTS "orders" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "order_id" text NOT NULL UNIQUE,
  "user_id" uuid REFERENCES "profiles"("id") ON DELETE CASCADE,
  "order_type" text NOT NULL,
  "package_type" text NOT NULL,
  "amount" integer NOT NULL,
  "currency" text DEFAULT 'GEL',
  "status" text DEFAULT 'pending',
  "flitt_payment_id" text,
  "transaction_id" text,
  "is_recurring" boolean DEFAULT false,
  "retry_count" integer DEFAULT 0,
  "failure_reason" text,
  "completed_at" timestamp,
  "created_at" timestamp DEFAULT now()
);

-- Drop old subscription_expires_at if it exists (replaced by subscription_end_date)
-- ALTER TABLE "profiles" DROP COLUMN IF EXISTS "subscription_expires_at";
