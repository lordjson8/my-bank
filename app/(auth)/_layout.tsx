// import { useAuth } from "@/services/providers/auth-context";
// import { HeaderTitle } from "@react-navigation/elements";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { KeyboardAvoidingView, Platform } from "react-native";
import { tr } from "zod/v4/locales";

export default function AuthLayout() {
  // const p = useAuth();

  //  if(true){
  //     return <Redirect href={'/settings'}/>
  //   }

  return (
   
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        {/* <StatusBar style="auto" /> */}

        <Stack.Screen name="signup" />
        <Stack.Screen name="signup-email" />
        <Stack.Screen name="success" />
        <Stack.Screen name="login" />
        <Stack.Screen name="verify" />
        <Stack.Screen name="security" />
        <Stack.Screen name="access-code" />
        <Stack.Screen name="forget-password" />
   </Stack>
  );
}
