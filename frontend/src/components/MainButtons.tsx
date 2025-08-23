'use client';
import useRooms from '@/hooks/useRooms';
import { useRouter } from 'next/navigation';

function MainButtons() {
  const { fetchRooms } = useRooms();
  const router = useRouter();

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
        onClick={() => router.push('/createRoom')}
      >
        방만들기
      </button>
    </div>
  );
}

export default MainButtons;
