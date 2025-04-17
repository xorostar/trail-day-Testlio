import { Context } from 'koa';
import { AuthService } from '../../services/auth.service';
import { authResponseSchema, loginSchema, registerSchema } from '../../schemas/auth.schema';
import { success } from '../../utils/responses';
import { ValidationError } from '../../utils/errors';

export class AuthController {
  private service: AuthService;

  constructor(service: AuthService = new AuthService()) {
    this.service = service;
  }

  async login(ctx: Context): Promise<void> {
    const validationResult = loginSchema.safeParse(ctx.request.body);
    if (!validationResult.success) {
      throw new ValidationError('Invalid login data', validationResult.error.errors);
    }
    const result = await this.service.login(validationResult.data);
    success(ctx, authResponseSchema.parse(result));
  }

  async register(ctx: Context): Promise<void> {
    const validationResult = registerSchema.safeParse(ctx.request.body);
    if (!validationResult.success) {
      throw new ValidationError('Invalid registration data', validationResult.error.errors);
    }
    const result = await this.service.register(validationResult.data);
    success(ctx, authResponseSchema.parse(result));
  }
} 