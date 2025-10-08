import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { Euro } from "lucide-react-native";

export default function CurrentAccount() {
  return (
    <View className="bg-white rounded-xl px-4 py-6 mb-4">
      <View className="flex-row justify-between mb-4">
        <Text className="text-muted-foreground">Compte Courant</Text>
        <Link href={"/(tabs)/dashboard"}>
          <Text className="text-xs text-primary">Voir detail</Text>
        </Link>
      </View>
      <View className="flex-row gap-2 items-center">
        <Text className="text-2xl font-extrabold">6 243,50</Text>
        <Euro size={20} />
      </View>
    </View>
  );
}
