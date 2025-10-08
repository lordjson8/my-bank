import { View, Text, TextInput } from 'react-native'
import React from 'react'

export default function Input({value,label,setValue,placeholder,keyboardType,secure} : {secure : boolean,label : string,value : string,setValue : (value : string) => void,placeholder : string,keyboardType : 'email-address' | 'phone-pad' | 'default'}) {
  return (
    <View className='mb-4'>
       <Text className="text-base mb-2 ">
            {label} <Text className="text-primary font-bold">*</Text>{" "}
          </Text>
          <TextInput
            placeholder={placeholder}
            value={value}
            keyboardType={keyboardType}
            autoCapitalize="none"
            onChangeText={setValue}
            secureTextEntry={secure}
            className="border rounded-xl px-3 text-base py-4 border-border"
          />
    </View>
  )
}