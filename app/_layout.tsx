import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "@/global.css";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuthStore } from "@/store/authStore";
import Toast from "react-native-toast-message";
import { NotificationProvider } from "@/notifications/NotificationContext";
import { useThemeStore } from "@/store/themeStore";
import { colorScheme, useColorScheme } from "nativewind";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { user, hasCompletedOnboarding, _hasHydrated } = useAuthStore();
  const { preference } = useThemeStore();
  const { colorScheme: currentScheme } = useColorScheme();

  const isAuthenticated = !!user;
  const isEmailVerified = user?.email_verified === true;

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
  });

  useEffect(() => {
    colorScheme.set(preference);
  }, [preference]);

  useEffect(() => {
    if (fontsLoaded && _hasHydrated) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, _hasHydrated]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NotificationProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={!hasCompletedOnboarding}>
            <Stack.Screen name="(onboarding)" />
          </Stack.Protected>

          <Stack.Protected guard={hasCompletedOnboarding && !isAuthenticated}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>

          <Stack.Protected guard={isAuthenticated && isEmailVerified}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(kyc)" />
          </Stack.Protected>

          <Stack.Screen name="+not-found" />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
      </NotificationProvider>

      <StatusBar style={currentScheme === "dark" ? "light" : "dark"} />
      <Toast />
    </GestureHandlerRootView>
  );
}
