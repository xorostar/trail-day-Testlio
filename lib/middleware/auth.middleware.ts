import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/errors';

export const authMiddleware = async (ctx: Context, next: Next): Promise<void> => {
  const authHeader = ctx.headers.authorization;
  if (!authHeader) {
    throw new UnauthorizedError('No token provided');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new UnauthorizedError('Token not found');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: number; email: string };
    ctx.state.user = decoded;
    await next();
  } catch (error) {
    throw new UnauthorizedError('Invalid token');
  }
}; 