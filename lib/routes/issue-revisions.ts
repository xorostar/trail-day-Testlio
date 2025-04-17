import Router from 'koa-router';
import { IssueRevisionController } from '../controllers/api/issue-revisions';

const router = new Router();
const controller = new IssueRevisionController();

router.get('/issues/:issueId/revisions', controller.list.bind(controller));
router.get('/issues/:issueId/revisions/compare/:revisionIdA/:revisionIdB', controller.compare.bind(controller));

export default router; 