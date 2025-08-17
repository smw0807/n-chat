export interface Room {
  id: string;
  name: string;
  description?: string;
  maxUsers?: number;
  isPrivate: boolean;
  createdBy: string;
  createdAt: Date;
  users: string[];
}
