import { useEffect, useState } from 'react';
import { getRoomInfo } from '@/apis/chat';
import { Room } from '@/models/room';

export default function useChat(roomId: number) {
  const [room, setRoom] = useState<Room>();

  useEffect(() => {
    const fetchRoomInfo = async () => {
      const response = await fetch(getRoomInfo(roomId));
      const data = await response.json();
      setRoom(data);
    };
    fetchRoomInfo();
  }, [roomId]);

  return { room };
}
