import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
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
}

