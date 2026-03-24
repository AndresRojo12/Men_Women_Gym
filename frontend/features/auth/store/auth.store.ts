import { create } from 'zustand';
import { loginRequest } from '../services/auth.api';
import { setToken, getToken, removeToken } from '../services/storage';

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (email, password) => {
    const access_token = await loginRequest(email, password);

    await setToken(access_token);

    set({
      user: null,
      token: access_token,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    await removeToken();

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  initialize: async () => {
    const token = await getToken();
    if (token) {
      set({ token, isAuthenticated: true });
    } else {
      set({ token: null, isAuthenticated: false });
    }
  },
}));