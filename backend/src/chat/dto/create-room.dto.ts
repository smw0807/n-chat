export class CreateRoomDto {
  name: string;
  description?: string;
  maxUsers?: number;
  isPrivate?: boolean;
}
