import 'dotenv/config';
import { db, profiles } from '../src/lib/db';
import { eq } from 'drizzle-orm';

async function unlockUser() {
  const email = 'irakli.digital@gmail.com';

  const [user] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.email, email));

  if (!user) {
    console.log(`User ${email} not found`);
    process.exit(1);
  }

  console.log(`Found user: ${user.email} (id: ${user.id})`);
  console.log(`Current stage: ${user.currentStage}, Subscription: ${user.subscriptionTier}`);

  // Update to unlock all stages and give pro access
  const [updated] = await db
    .update(profiles)
    .set({
      currentStage: 4,
      subscriptionTier: 'pro',
      subscriptionStatus: 'active',
    })
    .where(eq(profiles.id, user.id))
    .returning();

  console.log(`\nUpdated user:`);
  console.log(`- currentStage: ${updated.currentStage}`);
  console.log(`- subscriptionTier: ${updated.subscriptionTier}`);
  console.log(`\nAll stages unlocked!`);

  process.exit(0);
}

unlockUser().catch(console.error);
