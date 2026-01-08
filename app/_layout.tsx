import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
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
  const colorScheme = useColorScheme();

  const {
    user,
    logout,
    hasCompletedOnboarding,
    _hasHydrated,
  } = useAuthStore();

//  logout();

  const isAuthenticated = !!user;
  const isEmailVerified = user?.email_verified === true;

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
  });

  // Hide splash screen ONLY when everything is ready
  useEffect(() => {
    if (fontsLoaded && _hasHydrated) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, _hasHydrated]);

  // Block rendering until hydration + fonts
  // if (!fontsLoaded || !_hasHydrated) {
  //   return null;
  // }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}> */}
        <Stack screenOptions={{ headerShown: false }}>

          {/* 1️⃣ ONBOARDING */}
          <Stack.Protected guard={!hasCompletedOnboarding}>
            <Stack.Screen name="(onboarding)" />
          </Stack.Protected>

          {/* 2️⃣ AUTH (login / register / verify email) */}
          <Stack.Protected
            guard={hasCompletedOnboarding && !isAuthenticated}
          >
            <Stack.Screen name="(auth)" />
          </Stack.Protected>

          {/* 3️⃣ VERIFIED APP */}
          <Stack.Protected
            guard={isAuthenticated && isEmailVerified}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(kyc)" />
          </Stack.Protected>

          {/* 4️⃣ FALLBACKS */}
          <Stack.Screen name="+not-found" />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal" }}
          />
        </Stack>
      {/* </ThemeProvider> */}

      <StatusBar style="dark" />
      
    </GestureHandlerRootView>
  );
}
