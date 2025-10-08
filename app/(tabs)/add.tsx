import { View, Text, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/dashboard/header";
import { Link } from "expo-router";

export default function add() {
  return (
    <SafeAreaView className="bg-gray-50 min-h-screen">
      <ScrollView className="">
        <Header />
        <View className="px-4 py-6">
          <View className="bg-white rounded-xl px-4 py-6 mb-4">
            <View className="bg-card rounded-xl flex-row items-center justify-center py-3 px-3">
              <Text className="font-bold">Todo: </Text>

              <Text> Add +</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
