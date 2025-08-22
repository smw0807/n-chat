'use client';

import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

function Header() {
  const router = useRouter();
  const { user, handleLogout, isLoading } = useAuth();

  const handleLogin = () => {
    router.push('/login');
  };

  const handleButton = () => {
    if (isLoading) {
      return (
        <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
      );
    } else if (user) {
      return (
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md si"
          onClick={handleLogout}
        >
          Logout
        </button>
      );
    } else {
      return (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={handleLogin}
        >
          Login
        </button>
      );
    }
  };
  return (
    <>
      {/* 헤더 */}
      <header className="flex justify-between items-center p-4 bg-gray-300">
        <h1 className="text-2xl font-bold">N-Chat</h1>
        <div className="flex items-center gap-4">{handleButton()}</div>
      </header>
    </>
  );
}

export default Header;
