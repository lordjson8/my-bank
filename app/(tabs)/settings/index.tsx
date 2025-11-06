import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { general_features } from "@/constants";
import { ChevronRight } from "lucide-react-native";

export default function index() {
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
        {general_features.map((el, index) => (
          <TouchableOpacity
            key={index}
            className="rounded-xl items-start p-4 flex flex-row  mb-2 bg-card"
          >
            <el.icon color={"#F97316"} />
            <View className="ml-3 flex-1">
              <Text className="text-lg font-[500]">{el.title}</Text>
              <Text className="mt-2 text-muted-foreground  text-sm ">
                {el.description}
              </Text>
            </View>
            <ChevronRight size={24} color={"#64748B"} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
