import useFetch from './useFetch';
import { getRooms } from '@/apis/chat';
import { useRoomsStore } from '@/store/rooms';

export default function useRooms() {
  const { rooms, setRooms } = useRoomsStore();
  const { isLoading, error, fetchData } = useFetch();

  const fetchRooms = async () => {
    const data = await fetchData(getRooms, 'GET');
    setRooms(data);
  };

  return { rooms, fetchRooms, isLoading, error };
}
