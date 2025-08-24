'use client';
import { useState } from 'react';
import useRooms from '@/hooks/useRooms';
import Modal from '@/components/modal/PortalModal';
import CreateRoom from './form/CreateRoom';

function MainButtons() {
  const { fetchRooms } = useRooms();
  const [isOpen, setIsOpen] = useState(false);

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
        onClick={() => setIsOpen(true)}
        // onClick={() => router.push('/createRoom')}
      >
        방만들기
      </button>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="방만들기"
        content={<CreateRoom setIsOpen={setIsOpen} />}
      />
    </div>
  );
}

export default MainButtons;
