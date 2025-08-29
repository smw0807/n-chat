'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Room } from '@/models/room';

import Modal from '@/components/modal/PortalModal';
import useChat from '@/hooks/useChat';
import useAuth from '@/hooks/useAuth';

import Error from '@/components/form/Error';
import Button from '@/components/shared/Button';

interface RoomCardProps {
  room: Room;
}
function RoomCard({ room }: RoomCardProps) {
  const { handleCheckPassword } = useChat(room.id);
  const { user } = useAuth();
  const router = useRouter();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPasswordFail, setIsPasswordFail] = useState(false);

  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    setIsPasswordFail(false);
    const result = await handleCheckPassword(password);
    if (result) {
      router.push(`/chat/${room.id}`);
    } else {
      setIsPasswordFail(true);
    }
  };

  const handleJoinRoom = () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!room.isPrivate) {
      router.push(`/chat/${room.id}`);
    } else {
      setIsPasswordModalOpen(true);
    }
  };

  return (
    <>
      <Modal
        isOpen={isPasswordModalOpen}
        title="비밀번호를 입력해주세요."
        setIsOpen={setIsPasswordModalOpen}
        content={
          <div className="flex flex-col items-center justify-center">
            {isPasswordFail && <Error error="비밀번호가 일치하지 않습니다." />}
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        }
        footer={
          <div className="flex justify-end space-x-2">
            <Button onClick={handleSubmit}>확인</Button>
            <Button type="gray" onClick={() => setIsPasswordModalOpen(false)}>
              취소
            </Button>
          </div>
        }
      />
      <div
        onClick={handleJoinRoom}
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200"
      >
        {/* 방 이미지 또는 아이콘 */}
        <div className="h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-t-lg flex items-center justify-center">
          <div className="text-white text-4xl font-bold">
            {room.name.charAt(0)}
          </div>
        </div>

        {/* 방 정보 */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800 truncate">
              {room.name}
            </h3>
            {room.isPrivate && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                비공개
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {room.description}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>최대 {room.maxUsers}명</span>
            <span>방장: {room.user.name}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default RoomCard;
