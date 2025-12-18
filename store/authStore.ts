import  {create } from "zustand";
import { createJSONStorage, persist, } from "zustand/middleware";
import { secureStore } from "@/utils/secureStoreAdapter";

interface AuthStore {
  onboarding: boolean;
  setOnboarding: (value: boolean) => void;
}

export const useAuthStore = create(persist<AuthStore>( (set,get) => ({
    onboarding: true,
    setOnboarding: (value: boolean) => set({ onboarding: value }),
    
}), {
    name: "auth-storage",
    storage: createJSONStorage(() => secureStore),
}))