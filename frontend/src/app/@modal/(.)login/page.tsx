'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, verifyToken } from '@/apis/auth';
import useToken from '@/hooks/useToken';
import { useUserStore } from '@/store/user';

import Modal from '@/components/Modal';

function LoginPage() {
  const router = useRouter();
  const { setToken } = useToken();
  const { setUser } = useUserStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const verity = async (token: string) => {
    const res = await verifyToken(token);
    const { message, success, data } = await res.json();
    console.log(message);
    if (success) {
      setUser(data);
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const res = await login(email, password);
    const { message, success, token } = await res.json();

    if (!success) {
      alert(message);
      return;
    }

    setToken('access', token.access_token);
    setToken('refresh', token.refresh_token);

    verity(token.access_token);

    router.back();
  };
  return (
    <Modal title="로그인">
      <div className="flex flex-col gap-4">
        <input
          className="p-2 rounded-md"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* 이메일 로그인 */}
        <button
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          onClick={handleSubmit}
        >
          이메일 로그인
        </button>

        {/* 구글 로그인 */}
        <button
          className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
          onClick={() => {}}
        >
          구글 로그인
        </button>

        {/* 카카오 로그인 */}
        <button
          className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600"
          onClick={() => {}}
        >
          카카오 로그인
        </button>

        {/* 닫기 */}
        <button
          className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
          onClick={() => router.back()}
        >
          닫기
        </button>
        <p className="text-sm text-gray-500">
          아직 회원이 아니신가요?
          <button
            className="text-blue-500 hover:underline"
            onClick={() => router.push('/signup')}
          >
            회원가입
          </button>
        </p>
      </div>
    </Modal>
  );
}

export default LoginPage;
