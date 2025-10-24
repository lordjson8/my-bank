import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Link, router } from "expo-router";
import { ArrowLeft, ArrowRight } from "lucide-react-native";

export default function SubmitButtons({
  href,
  label,
  onPressFN,
}: {
  onPressFN: () => void;
  href:
    | "/(auth)/verify"
    | "/(auth)/security"
    | "/(auth)/success"
    | "/(auth)/info";
  label: string;
}) {
  return (
    <View className="flex-1 mt-6">
      <View className="flex flex-row gap-3 mb-5">
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          className="flex-2 flex-row gap-1 py-4 px-8 items-center bg-gray-50 rounded-xl"
        >
          <Text className="font-bold">
            <ArrowLeft size={17} />
          </Text>
          <Text className="font-bold">Retour</Text>
        </TouchableOpacity>
        <Link href={href} asChild>
          <TouchableOpacity
            onPress={onPressFN}
            className="flex-1 flex-row bg-primary py-4 items-center justify-center gap-2 rounded-xl"
          >
            <Text>
              <ArrowRight className="font-bold" size={17} color={"#fff"} />
            </Text>
            <Text className="text-white font-bold">{label}</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
