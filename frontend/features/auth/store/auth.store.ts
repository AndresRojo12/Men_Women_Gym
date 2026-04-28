import { create } from 'zustand';
import { loginRequest, getCurrentUser } from '../services/auth.api';
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

    const user = await getCurrentUser(access_token);

    set({
      user,
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

    const isTokenExpired = (tokenValue: string): boolean => {
      if (!tokenValue) {
        return true;
      }

      try {
        const payloadBase64 = tokenValue.split('.')[1];
        const payloadJson =
          typeof atob === 'function'
            ? atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
            : Buffer.from(payloadBase64, 'base64').toString('utf8');

        const payload = JSON.parse(payloadJson);
        return typeof payload.exp === 'number'
          ? payload.exp * 1000 < Date.now()
          : true;
      } catch (err) {
        return true;
      }
    };
    if (token && !isTokenExpired(token)) {
      const user = await getCurrentUser(token);

      set({ token, user, isAuthenticated: true });
    } else {
      await removeToken();

      set({
        token: null,
        user: null,
        isAuthenticated: false,
      });
    }
  },
}));
