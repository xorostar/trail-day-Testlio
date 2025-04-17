import Router from 'koa-router';
import { AuthController } from '../controllers/api/auth';

const router = new Router();
const controller = new AuthController();

router.post('/login', controller.login.bind(controller));
router.post('/register', controller.register.bind(controller));

export default router; 