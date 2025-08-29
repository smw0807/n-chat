'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import useUser from '@/hooks/useUser';

import Modal from '@/components/modal/ParallelModal';
import Error from '@/components/form/Error';
import { validateEmail } from '@/utils/validate';

function SignupPage() {
  const router = useRouter();
  const { checkEmail, signup } = useUser();

  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const validateInputs = async () => {
    if (!email) {
      setError('이메일을 입력해주세요.');
      return false;
    }
    if (!validateEmail(email)) {
      setError('이메일 형식이 올바르지 않습니다.');
      return false;
    }
    if (await checkEmail(email)) {
      setError('이미 존재하는 이메일입니다.');
      return false;
    }
    if (!name) {
      setError('이름을 입력해주세요.');
      return false;
    }
    if (!password) {
      setError('비밀번호를 입력해주세요.');
      return false;
    }
    if (!passwordConfirm) {
      setError('비밀번호 확인을 입력해주세요.');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!validateInputs()) {
      return;
    }
    setError('');
    handleSignup();
  };

  const handleSignup = async () => {
    const res = await signup({ email, name, password });
    if (res) {
      router.back();
    }
  };

  return (
    <Modal title="회원가입">
      <div className="flex flex-col gap-4 p-5">
        {error && <Error error={error} />}
        <input
          className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="email"
          name="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          name="name"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          name="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          name="passwordConfirm"
          placeholder="비밀번호 확인"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
      </div>
      <div className="flex justify-center items-center gap-4 border-t border-gray-300 pt-4 ">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={handleSubmit}
        >
          회원가입
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
          onClick={() => router.back()}
        >
          취소
        </button>
      </div>
    </Modal>
  );
}

export default SignupPage;
