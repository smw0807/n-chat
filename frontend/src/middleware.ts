import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@/constants/token';
import { verifyToken, refreshToken } from '@/apis/auth';

// 토큰 검증 함수 - 에러 처리 추가
async function handleVerifyToken(token: string): Promise<boolean> {
  try {
    const response = await verifyToken(token);
    const result = await response.json();

    return result.success === true;
  } catch (error) {
    console.error('토큰 검증 중 에러:', error);
    return false;
  }
}

// 토큰 재발급 함수 - 에러 처리 및 쿠키 설정 개선
async function handleRefreshToken(token: string): Promise<{
  success: boolean;
  newTokens?: { access: string; refresh: string };
}> {
  try {
    const response = await refreshToken(token);
    const data = await response.json();

    if (data.success && data.token) {
      return {
        success: true,
        newTokens: {
          access: data.token.access_token,
          refresh: data.token.refresh_token,
        },
      };
    }
    return { success: false };
  } catch (error) {
    console.error('토큰 재발급 중 에러:', error);
    return { success: false };
  }
}

export async function middleware(request: NextRequest) {
  console.log('middleware');
  const accessToken = request.cookies.get(ACCESS_TOKEN_NAME);
  const refreshToken = request.cookies.get(REFRESH_TOKEN_NAME);

  // 1. 토큰이 전혀 없는 경우
  if (!accessToken?.value && !refreshToken?.value) {
    // return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Access Token이 있는 경우 - 검증 시도
  if (accessToken?.value) {
    const isVerified = await handleVerifyToken(accessToken.value);
    if (isVerified) {
      return NextResponse.next(); // 토큰이 유효함
    }
  }

  // 3. Access Token이 없거나 만료된 경우 - Refresh Token으로 재발급 시도
  if (refreshToken?.value) {
    const refreshResult = await handleRefreshToken(refreshToken.value);

    if (refreshResult.success && refreshResult.newTokens) {
      // 새로운 토큰으로 응답 생성
      const response = NextResponse.next();

      // 새로운 토큰을 쿠키에 설정
      response.cookies.set(ACCESS_TOKEN_NAME, refreshResult.newTokens.access);
      response.cookies.set(REFRESH_TOKEN_NAME, refreshResult.newTokens.refresh);

      return response;
    }
  }

  // 4. 모든 인증 시도 실패 - 쿠키 정리 후 로그인 페이지로 리다이렉트
  // const redirectResponse = NextResponse.redirect(
  //   new URL('/login', request.url)
  // );
  // return clearAuthCookies(redirectResponse);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 다음으로 시작하는 경로를 제외한 모든 요청 경로를 매칭합니다:
     * - api (API 라우트)
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico (파비콘 파일)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },

    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      has: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },

    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      has: [{ type: 'header', key: 'x-present' }],
      missing: [{ type: 'header', key: 'x-missing', value: 'prefetch' }],
    },
  ],
};
