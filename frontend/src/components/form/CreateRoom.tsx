'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useRooms from '@/hooks/useRooms';
function CreateRoom({ setIsOpen }: { setIsOpen: (isOpen: boolean) => void }) {
  const router = useRouter();
  const { create } = useRooms();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [maxUsers, setMaxUsers] = useState(2);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!name || !description || !maxUsers) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    if (isPrivate && !password) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await create({
        name,
        description,
        maxUsers,
        isPrivate,
        password,
      });
      router.replace(`/chat/${data.id}`);
    } catch (err) {
      console.error('방 생성 실패:', err);
      setError('방 생성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <div>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
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
          disabled={isLoading}
          className={`px-4 py-2 rounded-md transition-colors ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {isLoading ? '생성 중...' : '방 만들기'}
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={() => setIsOpen(false)}
          disabled={isLoading}
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default CreateRoom;
