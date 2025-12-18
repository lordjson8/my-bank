import * as SecureStore from "expo-secure-store";
import { StateStorage } from "zustand/middleware";

export const secureStore : StateStorage = {
    getItem: async (name:string) => {
        const result =  await SecureStore.getItemAsync(name);
        return result?? null; 
    },
    setItem: async (name:string, value:string) => {
        await SecureStore.setItemAsync(name, value);
    },
    removeItem: async (name:string) => {
        await SecureStore.deleteItemAsync(name);
    }
}