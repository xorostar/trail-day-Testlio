import { Context, Next } from 'koa';
import { ValidationError, NotFoundError, UnauthorizedError } from '../utils/errors';
import logger from '../utils/logger';
import { badRequest, notFound, unauthorized, serverError } from '../utils/responses';

export const errorHandler = async (ctx: Context, next: Next): Promise<void> => {
  try {
    await next();
  } catch (error) {
    logger.error('Error occurred:', error);

    if (error instanceof ValidationError) {
      badRequest(ctx, {
        message: error.message,
        details: error.errors
      });
    } else if (error instanceof NotFoundError) {
      notFound(ctx, error.message);
    } else if (error instanceof UnauthorizedError) {
      unauthorized(ctx, error.message);
    } else {
      serverError(ctx);
    }
  }
}; 