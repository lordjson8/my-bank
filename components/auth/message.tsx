import { View, Text } from "react-native";
import React from "react";
import Features from "./features";
import MB from "./mb";

export default function Message() {
  return (
    <View className="mt-6">
      <View className="h-[80px] w-full flex items-center justify-center">
        <MB />
      </View>
      <View className="mt-6">
        <Text className="text-center font-bold text-3xl">
          Bienvenue sur ChicTransfer
        </Text>
        <Text className="text-center text-lg font-[400] text-muted-foreground mt-4 leading-6">
          Créez votre compte pour profiter de tous nos services bancaires en
          quelques étapes simples.
        </Text>
      </View>

      <Features />
    </View>
  );
}
