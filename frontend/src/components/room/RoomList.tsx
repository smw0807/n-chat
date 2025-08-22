'use client';
import { useEffect } from 'react';
import { getRooms } from '@/apis/chat';
import useFetch from '@/hooks/useFetch';

import RoomCard from './RoomCard';
import Empty from './Empty';

const mockRooms = [
  {
    id: 1,
    name: 'Room 1',
    description: 'Room 1 description',
    maxUsers: 10,
    isPrivate: false,
    user: {
      id: 1,
      name: 'User 1',
    },
  },
  {
    id: 2,
    name: 'Room 2',
    description: 'Room 2 description',
    maxUsers: 10,
    isPrivate: false,
    user: {
      id: 2,
      name: 'User 2',
    },
  },
  {
    id: 3,
    name: 'Room 3',
    description: 'Room 3 description',
    maxUsers: 10,
    isPrivate: false,
    user: {
      id: 3,
      name: 'User 3',
    },
  },
  {
    id: 4,
    name: 'Room 4',
    description: 'Room 4 description',
    maxUsers: 15,
    isPrivate: true,
    user: {
      id: 4,
      name: 'User 4',
    },
  },
  {
    id: 5,
    name: 'Room 5',
    description: 'Room 5 description',
    maxUsers: 20,
    isPrivate: false,
    user: {
      id: 5,
      name: 'User 5',
    },
  },
  {
    id: 6,
    name: 'Room 6',
    description: 'Room 6 description',
    maxUsers: 8,
    isPrivate: false,
    user: {
      id: 6,
      name: 'User 6',
    },
  },
  {
    id: 7,
    name: 'Room 7',
    description: 'Room 7 description',
    maxUsers: 12,
    isPrivate: true,
    user: {
      id: 7,
      name: 'User 7',
    },
  },
  {
    id: 8,
    name: 'Room 8',
    description: 'Room 8 description',
    maxUsers: 25,
    isPrivate: false,
    user: {
      id: 8,
      name: 'User 8',
    },
  },
];
function RoomList() {
  const { isLoading, error, fetchData } = useFetch();
  useEffect(() => {
    const fetchRooms = async () => {
      const data = await fetchData(getRooms, 'GET');
      console.log(data);
    };
    fetchRooms();
  }, []);
  return (
    <>
      {mockRooms.length === 0 ? (
        <Empty />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {mockRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </>
  );
}
export default RoomList;
