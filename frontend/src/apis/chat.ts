import { API_BASE_URL } from '@/constants/api';

export const getRooms = `${API_BASE_URL}/chat/rooms`;

export const createRoom = `${API_BASE_URL}/chat/rooms`;

export const getRoomInfo = (roomId: number) =>
  `${API_BASE_URL}/chat/rooms/${roomId}`;
