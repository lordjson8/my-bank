import { View, Text } from 'react-native'
import React from 'react'
import Progress from './progress'
import Tabs from './tabs'

export default function SignupHeader() {
  return (
    <View>
       <Progress step={1} progress="20%" />
        <View className="pt-6">
        
          <Text className="mb-8 text-primary font-bold text-4xl">
            Get started with your account!
          </Text>
        </View>
    </View>
  )
}