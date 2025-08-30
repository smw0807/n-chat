'use client';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { kakaoCallbackApi, googleCallbackApi } from '@/apis/auth';

import useToken from '@/hooks/useToken';

import Modal from '@/components/modal/ParallelModal';

function AuthPage() {
  const { setToken } = useToken();
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const apiUrl = {
    kakao: kakaoCallbackApi,
    google: googleCallbackApi,
  };

  useEffect(() => {
    if (state === 'kakao') {
      login('kakao');
    } else {
      login('google');
    }
  }, [state]);

  const login = async (type: 'kakao' | 'google') => {
    try {
      const res = await fetch(`${apiUrl[type]}?code=${code}`);
      const json = await res.json();
      setToken('access', json.access_token);
      setToken('refresh', json.refresh_token);
      router.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal>
      <div className="flex flex-col items-center justify-center">
        <div className="text-center">로그인 중입니다.</div>
      </div>
    </Modal>
  );
}

export default AuthPage;
