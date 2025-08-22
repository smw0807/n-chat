const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiBaseUrl) {
  console.warn(
    'API URL 환경 변수가 설정되지 않았습니다. NEXT_PUBLIC_API_URL을 확인해주세요.'
  );
}

export const API_BASE_URL = apiBaseUrl || 'http://localhost:3000/api';
