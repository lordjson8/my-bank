import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      {/* <Stack.Screen name="welcome" /> */}
        <Stack.Screen name="index" />
        <Stack.Screen name="signup-email" />
        <Stack.Screen name="signup-phone" />
        <StatusBar style="auto" />
        
    </Stack>
  );
}
