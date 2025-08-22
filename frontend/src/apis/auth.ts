import { API_BASE_URL } from '@/constants/api';

export async function login(username: string, password: string) {
  return fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${username}:${password}`)}`,
    },
  });
}

// 토큰 검증
export async function verifyToken(token: string) {
  return fetch(`${API_BASE_URL}/auth/verify/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });
}

// 토큰 재발급
export async function refreshToken(token: string) {
  return fetch(`${API_BASE_URL}/auth/refresh/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });
}
