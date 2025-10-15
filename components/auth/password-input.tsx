import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { use, useState } from "react";
import { Eye, EyeOff } from "lucide-react-native";

export default function PasswordInput({
  error,
  value,
  setValue,
  placeholder,
  keyboardType,
}: {
  error?: string;
  label?: string;
  value?: string;
  setValue?: (value: string) => void;
  placeholder?: string;
  keyboardType?: "email-address" | "phone-pad" | "default";
}) {
  const [secure, setSecure] = useState<boolean>(true);

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
        <TouchableOpacity onPress={() => setSecure(!secure)}>
          {secure ? (
            <EyeOff color={"#777777"} size={20} />
          ) : (
            <Eye color={"#777777"} size={20} />
          )}
        </TouchableOpacity>
      </View>

      {error && <Text className="text-red-500 text-sm">{error}</Text>}
    </View>
  );
}
