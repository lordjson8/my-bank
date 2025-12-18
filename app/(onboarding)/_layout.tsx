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
        <StatusBar style="auto" />

        {/* <Stack.Protected guard={false}> */}
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
        <Stack.Screen
          name="auth-options"
          // options={
          //   {
          //     title: "Profile",
          //     presentation: 'formSheet',
          //     gestureDirection: 'vertical',
          //     animation: 'slide_from_bottom',
          //     sheetGrabberVisible: true,
          //     sheetInitialDetentIndex: 0,
          //     sheetAllowedDetents: [1],
          //     sheetCornerRadius: 20,
          //     sheetExpandsWhenScrolledToEdge : true,
          //     sheetElevation: 24
          //   }
          // }
        />
        {/* </Stack.Protected> */}
        {/* <Stack.Protected guard={!p.isLoggedIn}> */}
      </Stack>
  );
}
