export interface User {
  id: number;
  email: string;
  name: string;
  role?: string;
  type?: string;
  profileImage?: string;
  iat?: number;
  exp?: number;
}
