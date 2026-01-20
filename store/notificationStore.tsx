import { create } from "zustand";
import * as Notifications from 'expo-notifications';

interface NotificationState {
    expoPushToken: string | null;
    notification: Notifications.Notification | null;
    error: string | null;
    setExpoPushToken: (token: string | null) => void;
    setNotification: (notification: Notifications.Notification | null) => void;
    setError: (error: string | null) => void;
}

const useNotificationStore = create<NotificationState>((set) => ({
    expoPushToken: null,
    notification: null,
    error: null,
    setExpoPushToken: (token) => set({ expoPushToken: token }),
    setNotification: (notification) => set({ notification }),
    setError: (error) => set({ error }),
}));

export default useNotificationStore;