import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ChevronLeft } from "lucide-react-native";

export default function Progress({
  progress,
  step,
}: {
  progress?: string;
  step: number;
}) {
  const total = 5;
  const style = ["w-[20%]", "w-[40%]", "w-[60%]", "w-[80%]", "w-[100%]"];
  console.log(style);
  return (
    <View>
      <View className="flex flex-row justify-between items-center text-gray-300">
      <TouchableOpacity>
        <ChevronLeft />

      </TouchableOpacity>

        <Text className="text-base text-muted-foreground font-semibold">
          Étape {step}/{total}
        </Text>
      </View>
      <View className="h-1 bg-gray-300 rounded-full mt-6">
        <View className={`h-1 bg-primary rounded-full w-[${progress}]`}></View>
      </View>
    </View>
  );
}
