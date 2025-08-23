'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useRooms from '@/hooks/useRooms';
import Modal from '@/components/modal/ParallelModal';

function CreateRoomPage() {
  const router = useRouter();
  const { create } = useRooms();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [maxUsers, setMaxUsers] = useState(2);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!name || !description || !maxUsers) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    if (isPrivate && !password) {
      setError('비밀번호를 입력해주세요.');
      return;
    }
    await create({ name, description, maxUsers, isPrivate, password });
    router.back();
  };

  return (
    <Modal title="방 만들기" size="sm">
      <div>
        <div className="text-red-500">{error}</div>
        <div className="flex gap-4 mb-4 items-center">
          <label htmlFor="name" className="w-1/5">
            방 이름
          </label>
          <input
            name="name"
            className="border border-gray-300 rounded-md p-2"
            type="text"
            placeholder="방 이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex gap-4 mb-4 items-center">
          <label htmlFor="description" className="w-1/5">
            방 설명
          </label>
          <input
            name="description"
            className="border border-gray-300 rounded-md p-2"
            type="text"
            placeholder="방 설명"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex gap-4 mb-4 items-center">
          <label htmlFor="maxUsers" className="w-1/5">
            최대 인원
          </label>
          <input
            name="maxUsers"
            className="border border-gray-300 rounded-md p-2"
            type="number"
            placeholder="최대 인원"
            value={maxUsers}
            onChange={(e) => setMaxUsers(Number(e.target.value))}
          />
        </div>

        <div className="flex gap-4 mb-4 items-center">
          <label htmlFor="isPrivate" className="w-1/5">
            비공개
          </label>
          <input
            name="isPrivate"
            className="border border-gray-300 rounded-md p-2"
            type="checkbox"
            id="isPrivate"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
        </div>

        <div className="flex gap-4 mb-4 items-center">
          <label htmlFor="password" className="w-1/5">
            비밀번호
          </label>
          <input
            name="password"
            className={`border border-gray-300 rounded-md p-2 ${
              isPrivate ? '' : 'bg-gray-200'
            }`}
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!isPrivate}
          />
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          방 만들기
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
          onClick={() => router.back()}
        >
          닫기
        </button>
      </div>
    </Modal>
  );
}

export default CreateRoomPage;
