import Router from 'koa-router';
import { IssueController } from '../controllers/api/issues';

const router = new Router();
const controller = new IssueController();

router.post('/', controller.create.bind(controller));
router.get('/', controller.list.bind(controller));
router.patch('/:id', controller.update.bind(controller));

export default router;
