import { LoginDto, RegisterDto, AuthResponseDto } from '../dto/auth.dto';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import User from '../models/user';
import Role from '../models/role';
import { ValidationError } from '../utils/errors';
import jwt from 'jsonwebtoken';

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private readonly JWT_EXPIRES_IN = '1d';

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const validationResult = loginSchema.safeParse(loginDto);
    if (!validationResult.success) {
      throw new ValidationError('Invalid login data', validationResult.error.errors);
    }

    const user = await User.findOne({ 
      where: { email: loginDto.email },
      include: [Role]
    });
    if (!user) {
      throw new ValidationError('Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(loginDto.password);
    if (!isPasswordValid) {
      throw new ValidationError('Invalid email or password');
    }

    const token = this.generateToken(user);
    return {
      token,
      user: {
        id: user.id,
        email: user.email
      }
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const validationResult = registerSchema.safeParse(registerDto);
    if (!validationResult.success) {
      throw new ValidationError('Invalid registration data', validationResult.error.errors);
    }

    const existingUser = await User.findOne({ where: { email: registerDto.email } });
    if (existingUser) {
      throw new ValidationError('Email already registered');
    }

    const user = await User.create({
      email: registerDto.email,
      password: registerDto.password
    });

    // Assign default user role
    const userRole = await Role.findOne({ where: { name: 'user' } });
    if (userRole) {
      await user.addRole(userRole);
    }

    const token = this.generateToken(user);
    return {
      token,
      user: {
        id: user.id,
        email: user.email
      }
    };
  }

  private generateToken(user: User): string {
    return jwt.sign(
      { id: user.id, email: user.email },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );
  }
} 