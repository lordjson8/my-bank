import { View, Text } from 'react-native'
import React from 'react'
import Progress from './progress'
import Tabs from './tabs'

export default function SignupHeader() {
  return (
    <View>
       <Progress step={2} progress="40%" />
        <View className="pt-32">
          <Text className="text-center mb-2 text-2xl font-bold">
            Créez votre compte
          </Text>
          <Text className="text-center text-base mb-8 text-muted-foreground">
            Entrez vos coordonnées pour commencer
          </Text>

         <Tabs />
        </View>
    </View>
  )
}