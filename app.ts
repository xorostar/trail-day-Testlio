import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { errorHandler } from './lib/middleware/error.middleware';
import router from './lib/routes';

const app = new Koa();

// Middleware
app.use(errorHandler);
app.use(bodyParser());

// Routes
app.use(router.routes());
app.use(router.allowedMethods());

// Export the Koa app instance
export { app };

// Export a callback function for supertest
export const callback = app.callback(); 