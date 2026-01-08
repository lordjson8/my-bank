import { View, Text } from 'react-native'
import React from 'react'
import Info from '@/components/info'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function UpdateProfile() {
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Info />
    </SafeAreaView>
  )
}