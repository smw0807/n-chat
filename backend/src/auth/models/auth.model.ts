export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum SignUpType {
  EMAIL = 'EMAIL',
  KAKAO = 'KAKAO',
  GOOGLE = 'GOOGLE',
}

export type Token = {
  access_token: string;
  refresh_token: string;
};

export type TokenInfo = {
  token_type: string;
  expiry_date: number | string;
} & Token;

export type TokenUser = {
  email: string;
  id: string;
  name: string;
  role: Role;
  type: SignUpType;
  profileImage?: string;
} & TokenInfo;
