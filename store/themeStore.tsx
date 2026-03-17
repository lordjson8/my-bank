import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { secureStore } from "@/utils/secureStoreAdapter";
import { colorScheme } from "nativewind";

export type ThemePreference = "light" | "dark" | "system";

interface ThemeState {
  preference: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preference: "system",
      setTheme: (preference) => {
        colorScheme.set(preference);
        set({ preference });
      },
    }),
    {
      name: "theme-ui-storage",
      storage: createJSONStorage(() => secureStore),
      onRehydrateStorage: () => (state) => {
        if (state?.preference) {
          colorScheme.set(state.preference);
        }
      },
    }
  )
);
