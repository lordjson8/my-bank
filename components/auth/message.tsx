import { View, Text } from 'react-native'
import React from 'react'
import Features from './features'

export default function Message() {
  return (
   <View className="mt-6">
          <View className="h-[80px] w-full flex items-center justify-center">
            <View className="rounded-full bg-primary h-[80px] w-[80px] flex items-center justify-center ">
              <Text className="text-2xl font-extrabold text-white">MB</Text>
            </View>
          </View>
          <View className="mt-6">
            <Text className="text-center font-bold text-2xl">
              Bienvenue sur MobileBanque
            </Text>
            <Text className="text-center text-base font-[400] text-muted-foreground mt-4 leading-6">
              Créez votre compte pour profiter de tous nos services bancaires en
              quelques étapes simples.
            </Text>
          </View>

          <Features />
    </View>
  )
}