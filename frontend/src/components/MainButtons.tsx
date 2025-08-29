'use client';
import { useState } from 'react';
import useRooms from '@/hooks/useRooms';
import useAuth from '@/hooks/useAuth';

import Modal from '@/components/modal/PortalModal';
import Button from '@/components/shared/Button';
import CreateRoom from './form/CreateRoom';

function MainButtons() {
  const { fetchRooms } = useRooms();
  const [isOpen, setIsOpen] = useState(false);
  const [hasUser, setHasUser] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex justify-end gap-4">
      {/* 새로고침 */}
      <Button type="amber" onClick={fetchRooms}>
        새로고침
      </Button>

      {/* 방만들기 버튼 */}
      <Button
        onClick={() => {
          if (user) {
            setIsOpen(true);
          } else {
            setHasUser(true);
          }
        }}
      >
        방만들기
      </Button>

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
        footer={<Button onClick={() => setHasUser(false)}>확인</Button>}
      />
    </div>
  );
}

export default MainButtons;
