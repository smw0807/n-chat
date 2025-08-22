import Header from '@/components/Header';
import RoomList from '@/components/room/RoomList';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <Header />
      {/* 채팅 메인 */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-3xl font-bold text-right mb-8 text-gray-800">
          N-Chat
        </div>

        {/* 방 리스트 */}
        <RoomList />
      </main>
    </div>
  );
}
