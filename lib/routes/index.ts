import Router from 'koa-router';
import issuesRouter from './issues';
import issueRevisionsRouter from './issue-revisions';
import authRouter from './auth';
import health from './health';
import discovery from '../controllers/api/discovery';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/authorization.middleware';

const router = new Router();

router.get('/', discovery.get);
router.use('/health', health.routes(), health.allowedMethods());
router.use(authRouter.routes(), authRouter.allowedMethods());
router.use('/issues', authMiddleware, issuesRouter.routes(), issuesRouter.allowedMethods());
router.use('/issue-revisions', authMiddleware, issueRevisionsRouter.routes(), issueRevisionsRouter.allowedMethods());

// Admin routes
router.use('/admin', authMiddleware, requireAdmin, (ctx) => {
  ctx.body = { message: 'Admin access granted' };
});

export default router; 