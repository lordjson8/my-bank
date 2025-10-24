import { View, Text } from 'react-native'
import React from 'react'
import { Bell, List, ListCollapse, Menu, User } from 'lucide-react-native'
import { useAuth } from '@/services/providers/auth-context'

export default function Header() {
  const {setIsLoging, isLoggedIn} = useAuth()
  return (
    <View className='flex-row justify-between items-center px-4 py-5 bg-white'>
     <Menu />
     <Text className='font-bold text-lg text-blue-950'>
        Ma Banque
     </Text>

     <View className='flex-row gap-6'>
        <View className='relative'>
        <Bell onPress={() => setIsLoging(!isLoggedIn)} />
        <Text className='bg-red-500 rounded-full text-6xl w-2 h-2 absolute -top-1 -right-1'></Text>
        </View>
        <User />
     </View>
    </View>
  )
}