import { View, Text } from 'react-native'
import React from 'react'

export default function Progress({progress,step} : {progress : string,step : number}) {
  const total = 5
  const style = ['w-[20%]','w-[40%]','w-[60%]','w-[80%]','w-[100%]']
  console.log(style)
  return (
    <View>
      <View className='flex flex-row justify-between text-gray-300'>
    <Text>Étape {step} sur {total}</Text>    
    <Text>{progress}</Text>    
    </View>     
    <View className='h-2 bg-gray-300 rounded-full mt-2'>
      <View className={`h-2 bg-primary rounded-full w-[${progress}]`}></View>
    </View>
    </View>
  )
}

