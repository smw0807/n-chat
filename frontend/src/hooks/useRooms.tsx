import useFetch from './useFetch';
import { getRooms, createRoom } from '@/apis/chat';
import { CreateRoom } from '@/models/room';
import { useRoomsStore } from '@/store/rooms';

export default function useRooms() {
  const { rooms, setRooms } = useRoomsStore();
  const { isLoading, error, fetchData } = useFetch();

  const fetchRooms = async () => {
    const data = await fetchData(getRooms, 'GET');
    setRooms(data);
  };

  const create = async (room: CreateRoom) => {
    const data = await fetchData(createRoom, 'POST', room);
    console.log(data);
    // setRooms([...rooms, data]);
  };

  return { rooms, fetchRooms, create, isLoading, error };
}
