'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import useAuth from '@/hooks/useAuth';

import Modal from './modal/PortalModal';

function Header() {
  const router = useRouter();
  const { user, handleLogout, isLoading } = useAuth();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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
        <>
          <Modal
            isOpen={isLogoutModalOpen}
            setIsOpen={setIsLogoutModalOpen}
            title="로그아웃"
            content={<div className="text-center">로그아웃 하시겠습니까?</div>}
            footer={
              <div className="space-x-2 w-full flex justify-center items-center">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                  onClick={handleLogout}
                >
                  예
                </button>
                <button
                  className="px-4 py-2 rounded-md"
                  onClick={() => setIsLogoutModalOpen(false)}
                >
                  아니오
                </button>
              </div>
            }
          />
          <div className="flex items-center gap-2">
            <div>
              {user.profileImage && (
                <Image
                  src={user.profileImage}
                  alt="profile"
                  width={32}
                  height={32}
                />
              )}
            </div>
            <div>
              <p>{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md"
            onClick={() => setIsLogoutModalOpen(true)}
          >
            Logout
          </button>
        </>
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
