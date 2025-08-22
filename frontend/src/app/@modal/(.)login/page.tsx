'use client';
import Modal from '@/components/Modal';
import { useRouter } from 'next/navigation';

function LoginPage() {
  const router = useRouter();
  return (
    <Modal title="로그인">
      Login
      <button onClick={() => router.back()}>닫기</button>
    </Modal>
  );
}

export default LoginPage;
