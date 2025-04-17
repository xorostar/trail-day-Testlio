import Router from 'koa-router';
import issues from '../controllers/api/issues';

const issueRouter = new Router();

issueRouter.get('/:id', issues.get);

export default issueRouter;
