import Router from 'koa-router';
import issues from './issues';
import health from './health';
import discovery from '../controllers/api/discovery';

const router = new Router();

router.get('/', discovery.get);
router.use('/health', health.routes(), health.allowedMethods());
router.use('/issues', issues.routes(), issues.allowedMethods());

export default router; 