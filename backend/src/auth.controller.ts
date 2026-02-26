import { Body, Controller, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';

interface SignupDto {
  username: string;
  role: UserRole;
  password: string;
}

interface LoginDto {
  username: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  @Post('signup')
  async signup(@Body() body: SignupDto) {
    const existing = await this.userRepo.findOne({
      where: { username: body.username },
    });
    if (existing) {
      return {
        success: false,
        message: 'Username already exists',
      };
    }

    const user = this.userRepo.create({
      username: body.username,
      role: body.role,
      passwordHash: body.password,
    });
    const saved = await this.userRepo.save(user);

    return {
      success: true,
      user: {
        id: saved.id,
        username: saved.username,
        role: saved.role,
      },
    };
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { username: body.username },
    });
    if (!user || user.passwordHash !== body.password) {
      throw new NotFoundException('Invalid username or password');
    }

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  @Get('profile/:id')
  async getProfile(@Param('id') id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash: _, ...safe } = user as any;
    return { success: true, user: safe };
  }

  @Put('profile/:id')
  async updateProfile(@Param('id') id: string, @Body() body: Partial<User>) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const allowed: (keyof User)[] = ['name', 'age', 'email', 'heightCm', 'weightKg', 'bmi', 'goals', 'cause'];
    for (const key of allowed) {
      if (body[key] !== undefined) {
        (user as any)[key] = body[key];
      }
    }
    const saved = await this.userRepo.save(user);
    const { passwordHash: _, ...safe } = saved as any;
    return { success: true, user: safe };
  }
}

