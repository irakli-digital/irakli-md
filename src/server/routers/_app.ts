import { router } from '../trpc';
import { scenarioRouter } from './scenario';
import { attemptRouter } from './attempt';
import { progressRouter } from './progress';
import { achievementsRouter } from './achievements';
import { leaderboardRouter } from './leaderboard';
import { subscriptionRouter } from './subscription';
import { profileRouter } from './profile';
import { certificationsRouter } from './certifications';
import { reflectionsRouter } from './reflections';
import { adminRouter } from './admin';

export const appRouter = router({
  scenario: scenarioRouter,
  attempt: attemptRouter,
  progress: progressRouter,
  achievements: achievementsRouter,
  leaderboard: leaderboardRouter,
  subscription: subscriptionRouter,
  profile: profileRouter,
  certifications: certificationsRouter,
  reflections: reflectionsRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
