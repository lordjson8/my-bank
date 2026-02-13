import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Bell, User } from "lucide-react-native";
import { WarningBanner } from "../warning-banner";
import { useAuthStore } from "@/store/authStore";

export default function Header() {
  const {logout, setOnboarding} = useAuthStore();
  return (
    <View className="bg-primary">
      <View className="flex-row justify-between items-center px-4 py-5 ">
        <Text className="font-bold text-lg text-white">Ma Banque</Text>

        <View className="flex-row gap-6">
          <View className="relative">
            <Bell color={"#FFF"} />
            <Text className="bg-red-500 border-white border-2 rounded-full text-6xl w-3 h-3 absolute -top-1 -right-1"></Text>
          </View>
          <TouchableOpacity onPress={() => {
            logout()
            setOnboarding(false);
            }} className="relative">
            <User color={"#FFF"} />
          </TouchableOpacity>
        </View>
      </View>
      <WarningBanner />
    </View>
  );
}
