import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { CreditCard, Euro, LucideArrowUpRightFromCircle, PiggyBank } from "lucide-react-native";

export default function Accounts() {
  return (
    <View className="bg-white rounded-xl px-4 py-6 mb-4">
      <View className="flex-row justify-between mb-4">
        <Text className="text-muted-foreground">Mes Comptes</Text>
        <Link href={"/(tabs)/dashboard"}>
          <Text className="text-xs text-primary">Tout les comptes</Text>
        </Link>
      </View>
      <View className="gap-4">
         <View className="flex-row items-center justify-between">
        <View className="flex-row gap-2 items-center">

           <View className="flex items-center justify-center rounded-full bg-card px-2 py-2">
              <PiggyBank color={"#F97316"} size={20}/>
           </View>
           <View>
            <Text>Livret A</Text>
            <Text className="text-xs mt-[2px] text-green-500">+1.2%</Text>
           </View>

        </View>
        <View className="flex-row gap-2 items-center">
         <View className="flex-row gap-2 items-center">
          <Text className="text-base">6 243,50</Text>
          <Euro size={16} />
        </View>
        <Text className="text-muted-foreground text-xl"> {">"} </Text>
        </View>
        
      </View>
       <View className="flex-row items-center justify-between">
        <View className="flex-row gap-2 items-center">

           <View className="flex items-center justify-center rounded-full bg-card px-2 py-2">
              <LucideArrowUpRightFromCircle color={'green'} size={20}/>
           </View>
           <View>
            <Text>PEL</Text>
            <Text className="text-xs mt-[2px] text-green-500">+0.8%</Text>
           </View>

        </View>
        <View className="flex-row gap-2 items-center">
         <View className="flex-row gap-2 items-center">
          <Text className="text-base">6 243,50</Text>
          <Euro size={16} />
        </View>
        <Text className="text-muted-foreground text-xl"> {">"} </Text>
        </View>
        
      </View>
       <View className="flex-row items-center justify-between">
        <View className="flex-row gap-2 items-center">

           <View className="flex items-center justify-center rounded-full bg-card px-2 py-2">
              <CreditCard color={"gold"} size={20}/>
           </View>
           <View>
            <Text>Carte Gold</Text>
            <View className="mt-[2px] flex-row items-center gap-1"> 
                <Text className="text-xs text-muted-foreground">Limite: 3000 </Text> 
                <Euro color={'gray'} size={12}/></View>
           </View>

        </View>
        <View className="flex-row gap-2 items-center ">
         <View className="flex-row gap-2 items-center">
          <Text className="text-base text-red-500">-245,80</Text>
          <Euro size={16} color={'red'}/>
        </View>
        <Text className="text-muted-foreground text-xl"> {">"} </Text>
        </View>
        
      </View>
      </View>
    

      
    </View>
  );
}
