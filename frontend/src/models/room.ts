import { User } from './user';

export interface Room {
  id: number;
  name: string;
  description: string;
  isPrivate: boolean;
  maxUsers: number;
  createdAt: string;
  user: User;
}
