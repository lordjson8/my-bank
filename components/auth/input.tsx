import { View, Text, TextInput } from "react-native";
import React from "react";
import { Control, Controller } from "react-hook-form";

export default function Input<T>({
  error,
  control,
  label,
  name,
  placeholder,
  keyboardType,
  secure,
}: {
  name: string;
  error?: string;
  secure: boolean;
  label: string;
  control: Control<any>;
  placeholder: string;
  keyboardType: "email-address" | "phone-pad" | "default";
}) {
  const [isFocused, setIsFocused] = React.useState(false);
  const handleFocus = React.useCallback(() => setIsFocused(true), []);
  const handleBlur = React.useCallback(() => setIsFocused(false), []);

  return (
    <View className="mb-2">
      <Text className="text-base mb-2 ">
        {label} <Text className="text-primary font-bold">*</Text>{" "}
      </Text>
      <Controller
        control={control}
        name={name}
        render={({
          field: { onChange, value, onBlur, },
          fieldState: { error},
        }) => (
          <>
            <TextInput
              placeholder={placeholder}
              value={value}
              keyboardType={keyboardType}
              autoCapitalize="none"
              onBlur={() => setIsFocused(false)}
              onFocus={() => setIsFocused(true)}
              onChangeText={onChange}
              placeholderTextColor={"gray"}
              secureTextEntry={secure}
              className={`border-2 ${isFocused ? "border-primary" : "border-border"} rounded-xl text-black px-4 text-base py-4 ${error ? "border-red-500" : "border-border"} `}
            />
            {error && (
              <Text className="text-red-500 text-md mt-1">{error.message}</Text>
            )}
          </>
        )}
      />
    </View>
  );
}

