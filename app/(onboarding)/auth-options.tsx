import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MB from "@/components/auth/mb";
import { Link } from "expo-router";

export default function AuthOptions() {
  const image = require("@/assets/images/PastedImage.png");

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView className="flex-1 bg-white">
        <View className="flex-1  pt-32 mx-auto">
          <Image className="flex-1 w-[302.01px] h-[232.77px]" source={image} />
        </View>
        <View className="px-12 py-12 gap-6">
          <View className="mx-auto">
            <MB />
          </View>
          <Text className="text-center text-4xl font-extrabold">
            Ouvrez un compte mobile en quelques minutes.
          </Text>
          <Text className="text-center text-xl text-muted-foreground">
            Créez votre compte pour profiter de tous nos services bancaires en
            quelques étapes simples.
          </Text>

          <View className="flex-1 mt-6">
            <View className="flex flex-row gap-3 mb-5">
              <Link asChild href={"/(auth)/login"}>
                <TouchableOpacity className="w-[40%]  gap-1 py-4 px-8 items-center bg-[#31313133] rounded-xl">
                  <Text className="font-bold">Login</Text>
                </TouchableOpacity>
              </Link>

              <Link href={"/(auth)/signup"} asChild>
                <TouchableOpacity className="w-[60%] flex-row bg-primary py-4 items-center justify-center gap-2 rounded-xl">
                  <Text className="text-white font-bold">Commencer</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
