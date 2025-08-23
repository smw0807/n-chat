'use client';
import { useEffect, useState } from 'react';
import { getRooms } from '@/apis/chat';
import useFetch from '@/hooks/useFetch';

import RoomCard from './RoomCard';
import Empty from './Empty';
import { Room } from '@/models/room';

function RoomList() {
  const { isLoading, error, fetchData } = useFetch();
  const [rooms, setRooms] = useState<Room[]>([]);
  useEffect(() => {
    const fetchRooms = async () => {
      const data = await fetchData(getRooms, 'GET');
      console.log(data);
      setRooms(data);
    };
    fetchRooms();
  }, []);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
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
