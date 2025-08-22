'use client';

import { useRouter } from 'next/navigation';

function Header() {
  const router = useRouter();
  return (
    <>
      {/* 헤더 */}
      <header className="flex justify-between items-center p-4 bg-gray-300">
        <h1 className="text-2xl font-bold">N-Chat</h1>
        <div className="flex items-center gap-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={() => {
              router.push('/login');
            }}
          >
            Login
          </button>
        </div>
      </header>
    </>
  );
}

export default Header;
