import { Context, Next } from 'koa';
import { ValidationError, NotFoundError, UnauthorizedError, ForbiddenError } from '../utils/errors';

export const errorHandler = async (ctx: Context, next: Next): Promise<void> => {
  try {
    await next();
  } catch (error) {
    if (error instanceof ValidationError) {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: error.message,
        errors: error.errors
      };
    } else if (error instanceof NotFoundError) {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: error.message
      };
    } else if (error instanceof UnauthorizedError) {
      ctx.status = 401;
      ctx.body = {
        status: 'error',
        message: error.message
      };
    } else if (error instanceof ForbiddenError) {
      ctx.status = 403;
      ctx.body = {
        status: 'error',
        message: error.message
      };
    } else {
      ctx.status = 500;
      ctx.body = {
        status: 'error',
        message: 'Internal server error'
      };
      console.error(error);
    }
  }
}; 