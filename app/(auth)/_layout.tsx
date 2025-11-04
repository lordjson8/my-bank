import { useAuth } from "@/services/providers/auth-context";
// import { HeaderTitle } from "@react-navigation/elements";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function AuthLayout() {
  const p = useAuth();

  if(true){
    return <Redirect href={'/transfer'}/>
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <StatusBar style="auto" />

      {/* <Stack.Protected guard={p.onBoarding && !p.isLoggedIn}> */}
        {/* <Stack.Screen name="welcome" /> */}
        <Stack.Screen
          name="index"
          options={{
            title: "Hello",
            headerTitle: "Same",
          }}
        />
        {/* <Stack.Screen name="[id]" options={({route}) => ({
          headerTitle : route.params?.id
         })} /> */}
        <Stack.Screen name="auth-options" />
      {/* </Stack.Protected> */}
      {/* <Stack.Protected guard={!p.isLoggedIn}> */}
        <Stack.Screen name="step-one" />
        <Stack.Screen name="signup-email" />
        <Stack.Screen name="step-two" />
        <Stack.Screen name="step-three" />
        <Stack.Screen name="step-four" />
        <Stack.Screen name="step-five" />
        <Stack.Screen name="success" />
        <Stack.Screen name="info" />
        <Stack.Screen name="login" />
        <Stack.Screen name="verify" />
        <Stack.Screen name="security" />
        <Stack.Screen name="access-code" />
        <Stack.Screen name="forget-password" />

        <Stack.Screen name="signup-phone" />
      {/* </Stack.Protected> */}
    </Stack>
  );
}
