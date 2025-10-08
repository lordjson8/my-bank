import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link, usePathname } from 'expo-router'

export default function Tabs() {

    const pathname = usePathname()
  return (
     <View className="flex-row bg-gray-50 rounded-xl  mb-8">
          <Link href={'/(auth)/signup-email'} asChild>
          
            <TouchableOpacity className={`flex-1 py-4 ${pathname === '/signup-email' && 'bg-primary'}   rounded-l-xl`}>
              <Text className={`text-center text-base  ${pathname === '/signup-email'? 'font-medium text-white' : 'font-semibold'} `}>
                Email
              </Text>
            </TouchableOpacity>
          </Link>
            <Link href={'/(auth)/signup-phone'} asChild>
            <TouchableOpacity className={`flex-1 py-4 ${pathname === '/signup-phone' && 'bg-primary'}   rounded-r-xl`}>
              <Text className={`text-center text-base  ${pathname === '/signup-phone'? 'font-medium text-white' : 'font-semibold'} `}>
                Téléphone
              </Text>
            </TouchableOpacity>
            </Link>
           
          </View>
  )
}