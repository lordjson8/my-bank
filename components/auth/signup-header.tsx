import { View, Text } from "react-native";
import React from "react";
import Progress from "./progress";
import Tabs from "./tabs";

export default function SignupHeader({
  label,
  step,
  progress,
  showProgress = true,
}: {
  label: string;
  step: number;
  progress: string;
  showProgress?: boolean;
}) {
  return (
    <View>
      <Progress showProgress={showProgress} step={step} progress={progress} />
        <View className={`pt-6 ${!showProgress && 'px-3'} `}>
          <Text className="mb-8 text-primary font-bold text-4xl">{label}</Text>
        </View>
    </View>
  );
}
