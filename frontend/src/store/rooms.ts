import { create } from 'zustand';
import { Room } from '@/models/room';

export const useRoomsStore = create<{
  rooms: Room[];
  setRooms: (rooms: Room[]) => void;
}>((set) => ({
  rooms: [],
  setRooms: (rooms) => set({ rooms }),
}));
