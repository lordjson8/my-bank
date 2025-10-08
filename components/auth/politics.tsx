import { View, Text } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";

export default function Politics() {
  return (
    <View className="mt-6 mb-16">
      <Text className="text-base text-pretty text-center text-muted-foreground">
        En continuant, vous acceptez nos{" "}
        <Text className="text-primary"> Conditions d&apos;utilisation </Text>
        et notre
        <Text className="text-primary"> Politique de confidentialité </Text>
      </Text>

      <View className="flex-row items-center my-5">
        <View className="flex-1 h-px items-center bg-primary" />
        <Text className="text-lg text-primary"> Connexion avec </Text>
        <View className="flex-1 h-px bg-primary items-center"></View>
      </View>
      <View className="flex-row gap-3 items-center justify-center mt-4 mb-6">
        <FontAwesome name="google" size={30} className="mr-2" />

        <FontAwesome name="apple" size={30} color="#000000" className="ml-2" />
      </View>

      <Text className="text-lg text-pretty text-center text-primary">
        Vous n’avez pas de compte?{" "}
        <Link href={"/(auth)/security"}>
          {" "}
          <Text className="font-bold text-muted-foreground">S’incrire</Text>
        </Link>
      </Text>
    </View>
  );
}
