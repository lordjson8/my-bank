import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { setStatusBarStyle, StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "@/global.css";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuthStore } from "@/store/authStore";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { 
    hasCompletedOnboarding, 
    isAuthenticated, 
    isEmailVerified,
    _hasHydrated 
  } = useAuthStore();

  const [loaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
  });

  // Hide splash screen after both fonts and store hydration complete
  useEffect(() => {
    if (loaded && _hasHydrated) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 100);
    }
  }, [loaded, _hasHydrated]);

  // Don't render until both are ready
  if (!loaded || !_hasHydrated) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* ONBOARDING - Show only if NOT completed */}
        <Stack.Protected guard={!hasCompletedOnboarding}>
          <Stack.Screen name="(onboarding)" />
        </Stack.Protected>

        {/* AUTH - Show only if onboarded but NOT authenticated */}
        <Stack.Protected guard={hasCompletedOnboarding && !isAuthenticated}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>

        {/* TABS - Show only if authenticated AND verified */}
        <Stack.Protected guard={isAuthenticated && isEmailVerified}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>

        {/* Global screens (always accessible) */}
        <Stack.Screen name="+not-found" />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar backgroundColor="#fff" style="dark" />
    </GestureHandlerRootView>
  );
}
