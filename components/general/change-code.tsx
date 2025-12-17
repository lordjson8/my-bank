import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Eye, EyeOff, MessageCircle, Phone } from "lucide-react-native";
import { TextInput } from "react-native-gesture-handler";
import { Link } from "expo-router";

function Input({
  error,
  value,
  label,
  setValue,
  placeholder,
  keyboardType,
  required,
}: {
  required?: boolean;
  error?: string;
  label: string;
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  keyboardType: "email-address" | "phone-pad" | "default";
}) {
  const [secure, setSecure] = React.useState<boolean>(true);
  return (
    <View className="fex-1">
        <TextInput  className="text-black px-2 py-4 mb-2 border border-border rounded-lg"/>

{/* <View className="mb-4">
      <Text className="text-md text-muted-foreground mb-2 ">
        {label} {required && <Text className="text-primary font-bold">*</Text>}
      </Text>
      <View className="flex-row justify-between items-center border border-border px-2 rounded-lg">
        <TextInput
          placeholder={placeholder}
          value={value}
          keyboardType={keyboardType}
          onChangeText={setValue}
          placeholderTextColor={"gray"}
          secureTextEntry={secure}
          className={`rounded-xl text-black px-0 text-base py-4 flex-1`}
        />
        <TouchableOpacity onPress={() => setSecure(!secure)}>
          {secure ? (
            <EyeOff color={"#777777"} size={20} />
          ) : (
            <Eye color={"#777777"} size={20} />
          )}
        </TouchableOpacity>
      </View>
      {!!error && <Text className="text-red-500 text-sm">{error}</Text>}
    </View> */}
    </View>
    
  );
}

export default function ChangeCode() {
  const [current_password, setCurrentPassword] = React.useState("");
  const [new_password, setNewPassword] = React.useState("");
  const [confirm_password, setConfirmPassword] = React.useState("");
  return (
    <Link href={'/settings/change-code'} className="py-2">
      <Input
        value={current_password}
        keyboardType="default"
        setValue={setCurrentPassword}
        label="Ancien code secret"
        placeholder="********"
      />
      <Input
        value={new_password}
        keyboardType="default"
        setValue={setNewPassword}
        label="Nouveau code secret"
        placeholder="********"
      />
      <Input
        value={confirm_password}
        keyboardType="default"
        setValue={setConfirmPassword}
        label="Confirmer code secret"
        placeholder="********"
      />

      <View className="mt-4 mb-4">
        <Link href={"/(auth)/auth-options"} asChild>
          <TouchableOpacity className="rounded-xl bg-primary flex flex-row items-center py-4 justify-center gap-2 mb-12">
            <Text className="text-white">Changer le code</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </Link>
  );
}
