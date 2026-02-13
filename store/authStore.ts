import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { secureStore } from "@/utils/secureStoreAdapter";
import { User } from "@/types/auth.types";
import { getMe } from "@/services/user.service";
import { useRoutesStore } from "./route.store";

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
  updateUser: () => Promise<void>;
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
        await secureStore.setItem("accessToken", access);
        await secureStore.setItem("refreshToken", refresh);
        set({ user });
      },

      async logout() {
        await secureStore.removeItem("accessToken");
        await secureStore.removeItem("refreshToken");
        set({ user: null });
        useRoutesStore.getState().reset();
      },

      updateUser: async () => {
        try {
          const user = await getMe();
          set({ user: user.data });
        } catch (_error) {
          // Silently fail - user will see stale data
        }
      },

      setOnboarding: (hasCompleted: boolean) =>
        set({ hasCompletedOnboarding: hasCompleted }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "auth-ui-storage",
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
