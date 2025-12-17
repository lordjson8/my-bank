import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { use, useState } from "react";
import { Eye, EyeOff } from "lucide-react-native";
import { Control, Controller } from "react-hook-form";

export default function PasswordInput({
  label,
  setValue,
  control,
  name,
  placeholder,
  keyboardType,
}: {
  label?: string;
  control: Control<any>;
  name: string;
  setValue?: (value: string) => void;
  placeholder?: string;
  keyboardType?: "email-address" | "phone-pad" | "default";
}) {
  const [secure, setSecure] = useState<boolean>(true);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = React.useCallback(() => setIsFocused(true), []);
  const handleBlur = React.useCallback(() => setIsFocused(false), []);

  return (
    <View className="mb-2">
      <Text className="text-base mb-2 ">
        {label} <Text className="text-primary font-bold">*</Text>{" "}
      </Text>

      <View
        className={`flex-row px-4 justify-between items-center border-2 rounded-lg ${isFocused ? "border-primary" : "border-border "} `}
      >
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <TextInput
                placeholder={placeholder}
                value={value}
                keyboardType={keyboardType}
                autoCapitalize="none"
                onBlur={handleBlur}
                onFocus={handleFocus}
                onChangeText={onChange}
                placeholderTextColor={"gray"}
                secureTextEntry={secure}
                className={`rounded-xl text-black px-0 text-base py-4 flex-1`}
              />
              {error && (
                <Text className="text-red-500 text-sm">{error.message}</Text>
              )}
            </>
          )}
        />

        <TouchableOpacity onPress={() => setSecure(!secure)}>
          {secure ? (
            <EyeOff color={"#777777"} size={20} />
          ) : (
            <Eye color={"#777777"} size={20} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
