import Router from 'koa-router';
import issuesRouter from './issues';
import issueRevisionsRouter from './issue-revisions';
import authRouter from './auth';
import health from './health';
import discovery from '../controllers/api/discovery';
import { authMiddleware } from '../middleware/auth.middleware';
import { clientIdMiddleware } from '../middleware/client-id.middleware';
import { requireAdmin } from '../middleware/authorization.middleware';

const router = new Router();

// Public routes (no auth or client ID required)
router.get('/', discovery.get);
router.use('/health', health.routes(), health.allowedMethods());

// Routes that require client ID but not auth
router.use('/auth', clientIdMiddleware, authRouter.routes(), authRouter.allowedMethods());

// Routes that require both client ID and auth
router.use('/issues', clientIdMiddleware, authMiddleware, issuesRouter.routes(), issuesRouter.allowedMethods());
router.use('/issue-revisions', clientIdMiddleware, authMiddleware, issueRevisionsRouter.routes(), issueRevisionsRouter.allowedMethods());

// Admin routes
router.use('/admin', clientIdMiddleware, authMiddleware, requireAdmin, (ctx) => {
  ctx.body = { message: 'Admin access granted' };
});

export default router; 