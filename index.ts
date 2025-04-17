import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import config from './config';
import router from './lib/routes';
import { connect, disconnect } from './lib/models/connection';
import logger from './lib/utils/logger';
import { errorHandler } from './lib/middleware/error-handler';

const app = new Koa();

// Middleware
app.use(errorHandler);
app.use(bodyParser());

// Routes
app.use(router.routes());
app.use(router.allowedMethods());

// Error handling
app.on('error', (err, ctx) => {
    logger.error('Server error:', err);
});

// Start server
const startServer = async () => {
    try {
      await connect();
      app.listen(config.port, () => {
        logger.info(`Listening on http://localhost:${config.port}`);
      });
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  };

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    await disconnect();
    process.exit(0);
  });