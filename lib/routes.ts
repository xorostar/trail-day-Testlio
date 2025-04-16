import Router from 'koa-router';
import issues from './api/issues';
import discovery from './api/discovery';
import health from './api/health';

const router = new Router();

router.get('/', discovery);
router.get('/health', health);
router.get('/issues/:id', issues.get);

export default router; 