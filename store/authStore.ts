// store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { secureStore } from '@/utils/secureStoreAdapter';

interface AuthState {
  hasCompletedOnboarding: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  user: { email: string; name: string } | null;
  _hasHydrated: boolean; // Track secureStore hydration
  
  completeOnboarding: () => void;
  login: (token: string, user: { email: string; name: string }) => void;
  verifyEmail: () => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      isAuthenticated: false,
      isEmailVerified: false,
      user: null,
      _hasHydrated: false,

      completeOnboarding: () => set({ hasCompletedOnboarding: true }),

      login: (token, user) => 
        set({ 
          isAuthenticated: true, 
          user,
        }),

      verifyEmail: () => set({ isEmailVerified: true }),

      logout: () =>
        set({
          isAuthenticated: false,
          isEmailVerified: false,
          user: null,
        }),

      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'auth-storage', // secureStore key
      storage: createJSONStorage(() => secureStore),
      
      // Only persist these fields (exclude _hasHydrated)
      partialize: (state) => ({
        // hasCompletedOnboarding: state.hasCompletedOnboarding,
        // isAuthenticated: state.isAuthenticated,
        // isEmailVerified: state.isEmailVerified,
        // user: state.user,
      }),

      // Handle hydration completion
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
