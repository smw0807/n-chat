import { create } from 'zustand';
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  type: string;
  profileImage: string | null;
  iat: number;
  exp: number;
}
interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => {
    console.log('user : ', user);
    set({ user });
  },
}));
