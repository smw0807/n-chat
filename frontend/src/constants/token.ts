export type TokenType = 'access' | 'refresh';

const accessTokenName = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
const refreshTokenName = process.env.NEXT_PUBLIC_REFRESH_TOKEN;

if (!accessTokenName || !refreshTokenName) {
  console.warn(
    '토큰 환경 변수가 설정되지 않았습니다. NEXT_PUBLIC_ACCESS_TOKEN과 NEXT_PUBLIC_REFRESH_TOKEN을 확인해주세요.'
  );
}

export const ACCESS_TOKEN_NAME = accessTokenName || 'access_token';
export const REFRESH_TOKEN_NAME = refreshTokenName || 'refresh_token';
