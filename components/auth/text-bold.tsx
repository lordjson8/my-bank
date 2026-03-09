import { View, Text } from 'react-native'
import React from 'react'

export default function TextBold({label} : {label : string}) {
  return (
      <Text className="text-black dark:text-white font-bold flex-1"> {label} </Text>
  )
}