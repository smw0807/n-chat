'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, verifyToken, googleLoginApi, kakaoLoginApi } from '@/apis/auth';
import useToken from '@/hooks/useToken';
import { useUserStore } from '@/store/user';

import Modal from '@/components/modal/ParallelModal';
import Error from '@/components/form/Error';

function LoginPage() {
  const router = useRouter();
  const { setToken } = useToken();
  const { setUser } = useUserStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const verify = async (token: string) => {
    try {
      const res = await verifyToken(token);
      const { message, success, data } = await res.json();
      console.log(message);
      if (success) {
        setUser(data);
      }
    } catch (err) {
      console.error('토큰 검증 실패:', err);
      setError('로그인 후 사용자 정보를 가져오는데 실패했습니다.');
    }
  };

  const validateInputs = () => {
    if (!email.trim()) {
      setError('이메일을 입력해주세요.');
      return false;
    }
    if (!password.trim()) {
      setError('비밀번호를 입력해주세요.');
      return false;
    }
    if (!email.includes('@')) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError('');

    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await login(email, password);

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || '로그인에 실패했습니다.');
        return;
      }

      const { message, success, token } = await res.json();

      if (!success) {
        setError(message);
        return;
      }

      setToken('access', token.access_token);
      setToken('refresh', token.refresh_token);

      await verify(token.access_token);

      router.back();
    } catch (err) {
      console.error('로그인 에러:', err);
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async () => {
    const res = await fetch(googleLoginApi);
    const { message, success, url } = await res.json();
    console.log(message);
    if (success) {
      window.location.href = url;
    }
  };

  const kakaoLogin = async () => {
    const res = await fetch(kakaoLoginApi);
    const { message, success, url } = await res.json();
    console.log(message);
    if (success) {
      router.push(url);
      // window.location.href = url;
    }
  };

  return (
    <Modal title="로그인">
      <div className="flex flex-col gap-4">
        {error && <Error error={error} />}

        <input
          className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        {/* 이메일 로그인 */}
        <button
          className={`text-white p-2 rounded-md transition-colors ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? '로그인 중...' : '이메일 로그인'}
        </button>

        {/* 구글 로그인 */}
        <button
          className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={googleLogin}
          disabled={isLoading}
        >
          구글 로그인
        </button>

        {/* 카카오 로그인 */}
        <button
          className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={kakaoLogin}
          disabled={isLoading}
        >
          카카오 로그인
        </button>

        {/* 닫기 */}
        <button
          className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          닫기
        </button>
        <p className="text-sm text-gray-500">
          아직 회원이 아니신가요?
          <button
            className="text-blue-500 hover:underline ml-1"
            onClick={() => router.push('/signup')}
            disabled={isLoading}
          >
            회원가입
          </button>
        </p>
      </div>
    </Modal>
  );
}

export default LoginPage;
