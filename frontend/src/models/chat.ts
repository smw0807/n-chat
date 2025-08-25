import { Room } from './room';
import { User } from './user';
export interface Message {
  id: number;
  message: string;
  createdAt: Date;
  user: User;
  room: Room;
}
