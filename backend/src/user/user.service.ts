import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { AuthUtils } from 'src/utils/auth.utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private authUtils: AuthUtils,
  ) {}

  async signup(user: User): Promise<User> {
    const existingUser = await this.findOne(user.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    const hashedPassword = await this.authUtils.hashPassword(user.password);
    const newUser = this.userRepository.create({
      ...user,
      password: hashedPassword,
    });
    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}
