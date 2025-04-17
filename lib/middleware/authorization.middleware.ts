import { Context, Next } from 'koa';
import User from '../models/user';
import { ForbiddenError } from '../utils/errors';

export const requireRole = (role: string) => {
  return async (ctx: Context, next: Next): Promise<void> => {
    const userId = ctx.state.user.id;
    const user = await User.findByPk(userId, { include: ['roles'] });
    
    if (!user) {
      throw new ForbiddenError('User not found');
    }

    const hasRole = await user.hasRole(role);
    if (!hasRole) {
      throw new ForbiddenError(`User does not have required role: ${role}`);
    }

    await next();
  };
};

export const requireAdmin = requireRole('admin'); 