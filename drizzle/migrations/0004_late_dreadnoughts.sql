CREATE TABLE "leads_ami" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone" text NOT NULL,
	"name" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "leads_ami_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "form_leads" ADD COLUMN "reason" text;