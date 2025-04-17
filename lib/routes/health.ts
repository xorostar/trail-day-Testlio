import Router from 'koa-router';
import health from '../controllers/api/health';

const healthRouter = new Router();

healthRouter.get('/', health.get);

export default healthRouter;