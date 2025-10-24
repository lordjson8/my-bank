import { View, Text } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'

const IDpage = () => {

    const {id} = useLocalSearchParams<{id : string}>()

  return (
    <View>
        <Stack.Screen options={{
            headerTitle:'jj',
            // animationTypeForReplace: ''
        }}/>
     <Text>
           {id}
        </Text>
      <Text>IDpage</Text>
    </View>)
}
export default IDpage