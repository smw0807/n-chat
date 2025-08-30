import { API_BASE_URL } from '@/constants/api';

export async function login(
  username: string,
  password: string
): Promise<Response> {
  if (!username || !password) {
    throw new Error('이메일과 비밀번호를 입력해주세요.');
  }

  return fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${username}:${password}`)}`,
    },
  });
}

// 토큰 검증
export async function verifyToken(token: string): Promise<Response> {
  if (!token) {
    throw new Error('토큰이 필요합니다.');
  }

  return fetch(`${API_BASE_URL}/auth/verify/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}

// 토큰 재발급
export async function refreshToken(token: string): Promise<Response> {
  if (!token) {
    throw new Error('리프레시 토큰이 필요합니다.');
  }

  return fetch(`${API_BASE_URL}/auth/refresh/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}

export const googleLoginApi = `${API_BASE_URL}/auth/google/signin`;
export const googleCallbackApi = `${API_BASE_URL}/auth/google/callback`;

export const kakaoLoginApi = `${API_BASE_URL}/auth/kakao/signin`;
export const kakaoCallbackApi = `${API_BASE_URL}/auth/kakao/callback`;
