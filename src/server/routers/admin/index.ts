import { router } from '../../trpc';
import { adminLessonsRouter } from './lessons';
import { adminUsersRouter } from './users';
import { adminAnalyticsRouter } from './analytics';

export const adminRouter = router({
  lessons: adminLessonsRouter,
  users: adminUsersRouter,
  analytics: adminAnalyticsRouter,
});
