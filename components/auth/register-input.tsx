import { View, Text, TextInput } from "react-native";
import React from "react";
import { Control, FieldError, useController, UseControllerProps, UseFormRegister } from "react-hook-form";
import { emailSchema, InfoFormType } from "@/utils/zod-schemas";
import { InfoFormFields } from "@/types";

export default function RInput({
  name,
  label,
  placeholder,
  keyboardType,
  secure,
  control,
  error,
}: {
  error?: FieldError;
  control: Control<emailSchema>;
  secure: boolean;
  label: string;
  name: 'email';
  placeholder: string;
  keyboardType: "email-address" | "phone-pad" | "default";
}) {
  // const { onChange, ref, onBlur } = register(name);
  const { field } = useController({
    control : control,
    name : name,
  })
  // console.log('hello')

  return (
    <View className="mb-4">
      <Text className="text-base mb-2 ">
        {label} <Text className="text-primary font-bold">*</Text>{" "}
      </Text>
      <TextInput
        placeholder={placeholder}
        value={field.value}
        keyboardType={keyboardType}
        autoCapitalize="none"
        onChangeText={field.onChange}
        placeholderTextColor={"gray"}
        secureTextEntry={secure}
        className="border rounded-xl text-black px-3 text-base py-4 border-border"
      />
      {error && <Text className="mt-1 text-red-500">{error.message}</Text>}
    </View>
  );
}
