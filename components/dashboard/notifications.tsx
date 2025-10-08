import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";
import {
  ArrowDownRightFromCircleIcon,
  CreditCard,
  Euro,
  LucideArrowUpRightFromCircle,
  PiggyBank,
} from "lucide-react-native";

export default function Notifications() {
  return (
    <View className="bg-white rounded-xl px-4 py-6 mb-4">
      <View className="flex-row justify-between mb-4">
        <Text className="text-muted-foreground">Notifications</Text>
        <Link href={"/(tabs)/dashboard"}>
          <Text className="text-xs text-primary">Tout voir</Text>
        </Link>
      </View>
      <View className="gap-4">
        <View className="flex-row gap-3 items-center px-4 py-4 bg-red-50 rounded-xl">
          <View className="flex items-center justify-center rounded-full bg-red-100 px-2 py-2">
            <ArrowDownRightFromCircleIcon color={"red"} size={20} />
          </View>
          <View>
            <Text>Depassement de budget</Text>
            <Text className="text-xs mt-[2px] text-muted-foreground leading-6">
              Category Restaurant: 95% utiliser
            </Text>
          </View>
        </View>
         <View className="flex-row gap-3 items-center px-4 py-4 bg-blue-50 rounded-xl">
          <View className="flex items-center justify-center rounded-full bg-blue-100 px-2 py-2">
            <CreditCard color={"#F97316"} size={20} />
          </View>
          <View>
            <Text>Depassement de budget</Text>
            <Text className="text-xs mt-[2px] text-muted-foreground leading-6">
              Category Restaurant: 95% utiliser
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
