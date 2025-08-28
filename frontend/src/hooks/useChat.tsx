import { useEffect, useState } from 'react';
import { checkPassword, getRoomInfo } from '@/apis/chat';
import { Room } from '@/models/room';
import useFetch from './useFetch';

export default function useChat(roomId: number) {
  const [room, setRoom] = useState<Room>();
  const { fetchData } = useFetch();

  useEffect(() => {
    const fetchRoomInfo = async () => {
      const response = await fetch(getRoomInfo(roomId));
      const data = await response.json();
      setRoom(data);
    };
    fetchRoomInfo();
  }, [roomId]);

  const handleCheckPassword = async (password: string) => {
    const response = await fetchData(checkPassword, 'POST', {
      roomId,
      password,
    });
    return response;
  };

  return { room, handleCheckPassword };
}
