import { create } from 'zustand';
import { User } from '@/models/user';

export const useUserStore = create<{
  user: User | null;
  setUser: (user: User) => void;
}>((set) => ({
  user: null,
  setUser: (user) => {
    set({ user });
  },
}));
