import { router } from '../trpc';
import { scenarioRouter } from './scenario';
import { attemptRouter } from './attempt';
import { progressRouter } from './progress';
import { achievementsRouter } from './achievements';
import { leaderboardRouter } from './leaderboard';
import { subscriptionRouter } from './subscription';
import { adminRouter } from './admin';

export const appRouter = router({
  scenario: scenarioRouter,
  attempt: attemptRouter,
  progress: progressRouter,
  achievements: achievementsRouter,
  leaderboard: leaderboardRouter,
  subscription: subscriptionRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
