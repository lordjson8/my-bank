import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from 'react-native-toast-message';


export default function KYCLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="update-profile"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="upload-kyc-docs"
        options={{
          headerShown: false,
        }}
      />
      <StatusBar style="dark" />
    </Stack>
  );
}
