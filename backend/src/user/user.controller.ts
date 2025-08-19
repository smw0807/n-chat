import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
