'use client';
import { useEffect } from 'react';
import useRooms from '@/hooks/useRooms';
import { useRoomsStore } from '@/store/rooms';

import RoomCard from './RoomCard';
import Empty from './Empty';

function RoomList() {
  const { rooms } = useRoomsStore();
  const { fetchRooms } = useRooms();

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <>
      {rooms.length === 0 ? (
        <Empty />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </>
  );
}
export default RoomList;
