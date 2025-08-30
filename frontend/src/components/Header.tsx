'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import useAuth from '@/hooks/useAuth';

import Modal from './modal/PortalModal';
import Button from './shared/Button';

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
                <Button onClick={handleLogout}>예</Button>
                <Button type="gray" onClick={() => setIsLogoutModalOpen(false)}>
                  아니오
                </Button>
              </div>
            }
          />
          <div className="flex items-center gap-2">
            <div>
              {user.profileImage && (
                <Image
                  src={user.profileImage}
                  alt="profile"
                  width={60}
                  height={60}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
            </div>
            <div>
              <p>{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <Button type="red" onClick={() => setIsLogoutModalOpen(true)}>
            Logout
          </Button>
        </>
      );
    } else {
      return (
        <Button type="blue" onClick={handleLogin}>
          Login
        </Button>
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
