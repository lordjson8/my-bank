import { View, Text } from "react-native";
import React from "react";
import Progress from "./progress";
import Tabs from "./tabs";

export default function SignupHeader({
  label,
  step,
  progress,
}: {
  label: string;
  step: number;
  progress: string;
}) {
  return (
    <View>
      <Progress step={step} progress={progress} />
      <View className="pt-6">
        <Text className="mb-8 text-primary font-bold text-4xl">{label}</Text>
      </View>
    </View>
  );
}
