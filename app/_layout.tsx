import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Redirect, Stack, usePathname, useRouter } from "expo-router";
import { setStatusBarStyle, StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "@/global.css";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { useColorScheme } from "@/hooks/use-color-scheme";
import AuthProvider from "@/services/providers/auth-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const unstable_settings = {
  anchor: "(tabs)",
};

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 2000,
  fade: true,
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const p = usePathname();
  const [loaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
  });

  // const [images] = useImages

  useEffect(() => {
    if (loaded) {
      SplashScreen.hide();
    }
  }, [loaded]);

  console.log(p.toLowerCase());
  // const colorScheme = useColorScheme();

  // return <Redirect href="/dashboard" />;

  return (
    <GestureHandlerRootView>
      {/* // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}> */}
      {/* // <AuthProvider> */}
      <>
        <Stack>
          {/* <Stack.Protected guard={false}> */}
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          {/* </Stack.Protected> */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        <StatusBar backgroundColor="#fff" style="dark" />
      </>

      {/* // </AuthProvider> */}
      {/* </ThemeProvider> */}

      {/* // </> */}
    </GestureHandlerRootView>
  );
}
