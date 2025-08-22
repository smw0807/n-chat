export type TokenType = 'access' | 'refresh';
export const ACCESS_TOKEN_NAME =
  (process.env.NEXT_PUBLIC_ACCESS_TOKEN as string) || '';
export const REFRESH_TOKEN_NAME =
  (process.env.NEXT_PUBLIC_REFRESH_TOKEN as string) || '';
