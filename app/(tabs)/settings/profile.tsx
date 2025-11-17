import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/dashboard/header";
import { Link } from "expo-router";
import { WarningBanner } from "@/components/warning-barner";
import { CircleCheckBig, Clock, Search } from "lucide-react-native";
import { TextInput } from "react-native";

export default function add() {
  const image = require("@/assets/images/Container.png");

  return (
    <View className="bg-gray-50 flex-1">
      <ScrollView className="">
        <View className="px-6 py-6">
          <Text className="font-bold text-lg">Données personnelles</Text>

          <View className="gap-1">
            <View className="border-b border-border py-4">
              <Text className="font-bold text-xl">Jean Kouassi</Text>
              <View className="flex-row gap-3 items-center mt-2">
                <Clock color={"#eab308"} />
                <Text className="text-yellow-500  font-semibold ">Validation en cours</Text>
              </View>
            </View>
            <View className="py-4 border-border border-b">
              <View className="flex-row gap-3 items-center mt-2">
                <CircleCheckBig color={"#22C55E"} />
                <View className="gap-1">
                  <Text className="text-muted-foreground ">Numéro</Text>
                  <Text className="text-[#eab308] font-bold text-pretty">
                    +225 07 12 34 56 78
                  </Text>
                </View>
              </View>
            </View>

            <View className="py-4 border-border border-b">
              <View className="flex-row gap-3 items-center mt-2">
                <CircleCheckBig color={"#22C55E"} />
                <View className="gap-1">
                  <Text className="text-muted-foreground ">Email</Text>
                  <Text className="text-[#eab308] font-bold text-pretty">
                    jean.kouassi@email.com
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View className="mt-3">
            <Text className="text-muted-foreground ">
              Photo carte d&apos;identité/passeport
            </Text>
            <View className="border-b border-border py-4">
              <Text className="font-semibold text-lg">Jean Kouassi</Text>
              <View className="flex-row gap-3 items-center mt-2">
                <Clock color={"#eab308"} />
                <Text className="text-yellow-500 font-semibold ">Validation en cours</Text>
              </View>
            </View>
          </View>
          <View className="mt-3">
            <Text className="text-muted-foreground ">
              Photo carte d&apos;identité/passeport
            </Text>
            <View className="py-4">
              <Text className="font-semibold text-lg">Jean Kouassi</Text>
              <View className="flex-row gap-3 items-center mt-2">
                <Clock color={"#eab308"} />
                <Text className="text-yellow-500 font-semibold">
                  Selfie avec carte d&apos;identité/passeport
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
