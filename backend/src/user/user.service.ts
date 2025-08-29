import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { AuthUtils } from 'src/utils/auth.utils';
import { SignupDto, SocialSignupDto } from './dto/signup.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private authUtils: AuthUtils,
  ) {}

  async signup(user: SignupDto): Promise<User> {
    const hashedPassword = await this.authUtils.hashPassword(user.password);
    const newUser = this.userRepository.create({
      ...user,
      password: hashedPassword,
    });
    this.logger.log(newUser, 'newUser');
    return this.userRepository.save(newUser);
  }

  async addSocialUser(user: SocialSignupDto): Promise<User> {
    // const hashedPassword = await this.authUtils.hashPassword(user.password);
    const newUser = this.userRepository.create({
      ...user,
      // password: hashedPassword,
    });
    return this.userRepository.save(newUser);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete({ id });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async updateLastLogin(email: string): Promise<void> {
    await this.userRepository.update({ email }, { lastLoginAt: new Date() });
  }

  async verifyPassword(email: string, password: string): Promise<boolean> {
    const user = await this.findOne(email);
    if (!user) return false;
    return await this.authUtils.comparePassword(password, user.password);
  }
}
