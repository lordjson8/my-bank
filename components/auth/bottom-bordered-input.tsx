import { View, Text, TextInput } from "react-native";
import React from "react";
import { Eye } from "lucide-react-native";

export default function BottomBorderedInput({
  error,
  value,
  setValue,
  placeholder,
  keyboardType,
  secure,
}: {
  error?: string;
  secure?: boolean;
  label?: string;
  value?: string;
  setValue?: (value: string) => void;
  placeholder: string;
  keyboardType?: "email-address" | "phone-pad" | "default";
}) {
  return (
    <View className="mb-4 border-b border-border ">
      <Text className="text-sm invisible text-muted-foreground">{placeholder}</Text>
      <View className="flex-row justify-between items-center">
        <TextInput
          placeholder={placeholder}
          value={value}
          keyboardType={keyboardType}
          autoCapitalize="none"
          onChangeText={setValue}
          placeholderTextColor={"gray"}
          secureTextEntry={secure}
          className={`rounded-xl text-black px-0 text-base py-4 ${error ? "border-red-500" : "border-border"} `}
        />
      </View>

      {error && <Text className="text-red-500 text-sm">{error}</Text>}
    </View>
  );
}
