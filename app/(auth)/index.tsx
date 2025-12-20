import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore } from '@/store/authStore'
import { Link } from 'expo-router';

export default function Index() {
    // const onboarding = useAuthStore((state) => state.onboarding);
    // const setOnboarding = useAuthStore((state) => state.setOnboarding);
    // console.log('onboarding in auth index', onboarding);
    // setOnboarding(false);

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <Text>auth index</Text>
      <Link href="/(auth)/signup">Go to Tabs</Link>
    </SafeAreaView>
  )
}