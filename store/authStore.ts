import { set } from 'react-hook-form';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { secureStore } from '@/utils/secureStoreAdapter';

export interface User {
  id: number;
  email: string;
  phone: string;
  full_name: string;
  country: string;
  email_verified: boolean;
  phone_verified: boolean;
  kyc_status: string;
  kyc_level: string;
  two_factor_enabled: boolean;
  can_transfer: boolean;
}

interface AuthState {
  user: User | null;
  setOnboarding: (hasCompleted: boolean) => void;
  hasCompletedOnboarding: boolean;
  _hasHydrated: boolean;

  loginSuccess: (payload: {
    user: User;
    access: string;
    refresh: string;
  }) => Promise<void>;

  logout: () => Promise<void>;
  completeOnboarding: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hasCompletedOnboarding: false,
      _hasHydrated: false,

      async loginSuccess({ user, access, refresh }) {
        await secureStore.setItem('accessToken', access);
        await secureStore.setItem('refreshToken', refresh);

        set({ user });
      },

      async logout() {
        await secureStore.removeItem('accessToken');
        await secureStore.removeItem('refreshToken');

        set({ user: null });
      },
      setOnboarding: (hasCompleted : boolean) =>
        set({ hasCompletedOnboarding: hasCompleted }),
      completeOnboarding: () =>
        set({ hasCompletedOnboarding: true }),

      setHasHydrated: (state) =>
        set({ _hasHydrated: state }),
    }),
    {
      name: 'auth-ui-storage',
      storage: createJSONStorage(() => secureStore),

      partialize: (state) => ({
        user: state.user,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);


export const store = useAuthStore;