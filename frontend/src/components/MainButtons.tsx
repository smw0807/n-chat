'use client';
import { useState } from 'react';
import useRooms from '@/hooks/useRooms';
import useAuth from '@/hooks/useAuth';

import Modal from '@/components/modal/PortalModal';
import CreateRoom from './form/CreateRoom';

function MainButtons() {
  const { fetchRooms } = useRooms();
  const [isOpen, setIsOpen] = useState(false);
  const [hasUser, setHasUser] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex justify-end gap-4">
      {/* 새로고침 */}
      <button
        className="bg-amber-500 text-white px-4 py-2 text-sm rounded-md"
        onClick={fetchRooms}
      >
        새로고침
      </button>

      {/* 방만들기 버튼 */}
      <button
        className="bg-blue-500 text-white px-4 py-2 text-sm rounded-md"
        onClick={() => {
          if (user) {
            setIsOpen(true);
          } else {
            setHasUser(true);
          }
        }}
      >
        방만들기
      </button>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="방만들기"
        content={<CreateRoom setIsOpen={setIsOpen} />}
      />
      <Modal
        isOpen={hasUser}
        setIsOpen={setHasUser}
        title="방만들기"
        content={<div className="text-center">로그인 후 이용해주세요.</div>}
        footer={
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={() => setHasUser(false)}
          >
            확인
          </button>
        }
      />
    </div>
  );
}

export default MainButtons;
