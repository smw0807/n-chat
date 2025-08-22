import { useCookies } from 'next-client-cookies';
import {
  TokenType,
  ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_NAME,
} from '@/constants/token';

export default function useToken() {
  const cookies = useCookies();

  return {
    getToken: (type: TokenType) =>
      cookies.get(type === 'access' ? ACCESS_TOKEN_NAME : REFRESH_TOKEN_NAME),
    setToken: (type: TokenType, token: string) =>
      cookies.set(
        type === 'access' ? ACCESS_TOKEN_NAME : REFRESH_TOKEN_NAME,
        token
      ),
    removeToken: (type: TokenType) =>
      cookies.remove(
        type === 'access' ? ACCESS_TOKEN_NAME : REFRESH_TOKEN_NAME
      ),
  };
}
