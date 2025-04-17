import Router from 'koa-router';
import issuesRouter from './issues';
import issueRevisionsRouter from './issue-revisions';
import health from './health';
import discovery from '../controllers/api/discovery';

const router = new Router();

router.get('/', discovery.get);
router.use('/health', health.routes(), health.allowedMethods());
router.use('/issues', issuesRouter.routes(), issuesRouter.allowedMethods());
router.use('/issue-revisions', issueRevisionsRouter.routes(), issueRevisionsRouter.allowedMethods());

export default router; 