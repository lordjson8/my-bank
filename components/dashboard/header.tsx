import { View, Text } from "react-native";
import React from "react";
import { Bell, List, ListCollapse, Menu, User } from "lucide-react-native";
import { WarningBanner } from "../warning-barner";

export default function Header() {
  return (
    <View className="">
      <View className="flex-row justify-between items-center px-4 py-5 bg-white">
        <Menu color={"#F97316"} className="text-primary" />
        <Text className="font-bold text-lg text-blue-800">Ma Banque</Text>

        <View className="flex-row gap-6">
          <View className="relative">
            <Bell color={"#F97316"}  />
            <Text className="bg-red-500 rounded-full text-6xl w-2 h-2 absolute -top-1 -right-1"></Text>
          </View>
          <User color={"#F97316"} />
        </View>
      </View>
      <WarningBanner />

    </View>
  );
}
