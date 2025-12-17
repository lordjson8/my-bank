import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { general_features } from "@/constants";
import { ChevronRight, LogOut } from "lucide-react-native";

export default function roof() {
  return (
    <View className="flex-1 bg-white">
      <Features />
    </View>
  );
}

export function Features() {
  return (
    <ScrollView className="px-4 py-6">
      <View className="flex-1">
        <Text className="font-bold">Statut compte Ma Bnque</Text>
        <View className="rounded-xl items-center p-y flex flex-row  mt-4 justify-between">
          <Text className="text-md  text-muted-foreground">
            Transfert par mobile money
          </Text>
          <Text className="mt-2  text-primary ">En attente</Text>
        </View>
        <View className="rounded-xl items-center p-y flex flex-row  mt-2 justify-between">
          <Text className="text-md  text-muted-foreground">
            Transfert par carte bancaire
          </Text>
          <Text className="mt-2  text-primary ">En attente</Text>
        </View>
      </View>

      <View className="flex-1 mt-6">
        <Text className="font-bold">Plafond mobile moneyMa Bnque</Text>
        <View className="rounded-xl items-center p-y flex flex-row  mt-4 justify-between">
          <Text className="text-md  text-muted-foreground">Journalier</Text>
          <Text className="mt-2 font-bold">3 000 000 FCFA</Text>
        </View>
        <View className="rounded-xl items-center p-y flex flex-row  mt-2 justify-between">
          <Text className="text-md  text-muted-foreground">Hebdomadaire</Text>
          <Text className="mt-2 font-bold">10 000 000 FCFA</Text>
        </View>
        <View className="rounded-xl items-center p-y flex flex-row  mt-2 justify-between">
          <Text className="text-md  text-muted-foreground">Mensuel</Text>
          <Text className="mt-2 font-bold">30 000 000 FCFA</Text>
        </View>
      </View>

        <View className="flex-1 mt-6">
        <Text className="font-bold">Plafond carte bancaire Ma Bnque</Text>
        <View className="rounded-xl items-center p-y flex flex-row  mt-4 justify-between">
          <Text className="text-md  text-muted-foreground">Journalier</Text>
          <Text className="mt-2 font-bold">3 000 000 FCFA</Text>
        </View>
        <View className="rounded-xl items-center p-y flex flex-row  mt-2 justify-between">
          <Text className="text-md  text-muted-foreground">Hebdomadaire</Text>
          <Text className="mt-2 font-bold">10 000 000 FCFA</Text>
        </View>
        <View className="rounded-xl items-center p-y flex flex-row  mt-2 justify-between">
          <Text className="text-md  text-muted-foreground">Mensuel</Text>
          <Text className="mt-2 font-bold">30 000 000 FCFA</Text>
        </View>
      </View>
    </ScrollView>
  );
}
