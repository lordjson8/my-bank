import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/dashboard/header";
import { Link } from "expo-router";
import { WarningBanner } from "@/components/warning-barner";
import { Search } from "lucide-react-native";
import { TextInput } from "react-native";

export default function add() {
  const image = require("@/assets/images/Container.png");

  return (
    <View className="bg-gray-50 min-h-screen">
      <WarningBanner />
      <ScrollView className="mt-12">
        {/* <Header /> */}
        <View className="px-4 py-6">
          <View>
            <Text className="font-bold text-2xl">Historique</Text>
            <View className="mt-2 mb-5 bg-gray-100 flex-row  gap-2 items-center px-2 rounded-xl">
              <Search size={17} color={"gray"} />
              <TextInput
                className="border-none w-full outline-none px-4 py-4"
                placeholder="Rechercher une transaction"
                // value={search}
                placeholderTextColor={"gray"}
                // onChangeText={setSearch}
              />
            </View>
          </View>

          <View className="items-center justify-center mt-12">
            <Image source={image} />

            <Text className="font-bold text-2xl">Aucun résultat trouvé</Text>

            <Text className="text-gray-500 text-sm text-center mt-4 px-12 text-base">
              Désolé, il n&apos;y a aucun résultat pour cette recherche, veuillez
              essayer une autre chose.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
