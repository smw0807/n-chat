import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { SignupDto } from './dto/signup.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() user: SignupDto): Promise<User> {
    const existingUser = await this.userService.findOne(user.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    return this.userService.signup(user);
  }

  @Delete(':email')
  async remove(@Param('email') email: string): Promise<{ message: string }> {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userService.remove(user.id);
    return { message: 'User deleted successfully' };
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(): Promise<User[]> {
    const users = await this.userService.findAll();
    if (users.length === 0) {
      throw new NotFoundException('No users found');
    }
    return users;
  }

  @Get(':email')
  async findOne(@Param('email') email: string): Promise<User | null> {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
