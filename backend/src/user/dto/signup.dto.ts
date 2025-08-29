import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SignUpType } from '../entity/user.entity';

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SocialSignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(SignUpType)
  @IsNotEmpty()
  type: SignUpType;

  @IsString()
  profileImage: string;
}
