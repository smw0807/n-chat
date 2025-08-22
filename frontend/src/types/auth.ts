export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  type: string;
  profileImage: string | null;
  iat: number;
  exp: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: {
    access_token: string;
    refresh_token: string;
  };
}

export interface VerifyResponse {
  success: boolean;
  message: string;
  data?: User;
}

export interface RefreshResponse {
  success: boolean;
  message: string;
  token?: {
    access_token: string;
    refresh_token: string;
  };
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
