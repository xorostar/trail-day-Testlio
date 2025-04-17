import { Context, Next } from 'koa';
import { UnauthorizedError } from '../utils/errors';

export const clientIdMiddleware = async (ctx: Context, next: Next): Promise<void> => {
  const clientId = ctx.headers['x-client-id'];
  
  if (!clientId) {
    throw new UnauthorizedError('X-Client-ID header is required');
  }

  // You might want to validate the client ID format or check it against a list of valid clients
  // For now, we'll just ensure it's present and not empty
  if (typeof clientId !== 'string' || clientId.trim() === '') {
    throw new UnauthorizedError('Invalid X-Client-ID header');
  }

  // Store the client ID in the context for later use
  ctx.state.clientId = clientId;
  
  await next();
}; 