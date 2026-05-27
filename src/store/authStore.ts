import { create } from 'zustand';
import type { UserProfile } from '../types';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  login: (email: string, password: string) => Promise<void>;
  completeOnboarding: (name: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isOnboarded: false,

  // Simulated auth for the challenge — replace with real API call in production
  login: async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    if (email === 'demo@kambista.com' && password === 'demo1234') {
      set({
        user: { name: 'Usuario Demo', email, koinks: 1250 },
        isAuthenticated: true,
        isOnboarded: true,
      });
    } else {
      throw { data: { message: 'Credenciales incorrectas. Verifica tu correo y contraseña.' } };
    }
  },

  completeOnboarding: (name: string) => {
    set((s) => ({
      user: s.user ? { ...s.user, name } : { name, email: '', koinks: 0 },
      isOnboarded: true,
      isAuthenticated: true,
    }));
  },

  logout: () => set({ user: null, isAuthenticated: false, isOnboarded: false }),
}));
