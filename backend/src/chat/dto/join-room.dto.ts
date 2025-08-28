import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class JoinRoomDto {
  userId: string;
  username: string;
}

export class CheckPasswordDto {
  @IsNumber()
  roomId: number;

  @IsNotEmpty()
  @IsString()
  password: string;
}
