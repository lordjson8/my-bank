import { View, Text } from 'react-native'
import React from 'react'
import { features } from '@/constants'


export default function Features() {
  return (
      <View className="mt-6">
            {features.map((el, index) => (
              <View
                key={index}
                className="rounded-xl items-start p-4 flex flex-row  mb-6 bg-card  "
              >
                <el.icon color={"#F97316"} />
                <View className="ml-3 flex-1">
                  <Text className="text-base font-[500]">{el.title}</Text>
                  <Text className="mt-2 text-muted-foreground  text-pretty text-base">
                    {el.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
  )
}