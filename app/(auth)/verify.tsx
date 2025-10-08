import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Progress from "@/components/auth/progress";
import { RefreshCcw } from "lucide-react-native";
import SignupButtons from "@/components/auth/signup-buttons";

export default function Verify() {
  const [code, setCode] = useState(["", "", "", ""]);

  const handleChange = (index: number, value: string) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 3) {
      // You would need to use refs for actual auto-focus
    }
  };
  const handleNext = () => {
    console.log(code);
  };
  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 p-4 bg-white">
        <ScrollView className="px-4 py-8">
          <Progress step={3} progress="60%" />

          <View className="mt-[156px] mb-2">
            <Text className="text-center text-2xl font-bold">Vérification</Text>
            <Text className="text-center text-base text-muted-foreground">
              Nous avons envoyé un code à
            </Text>
            <Text className="text-center text-base font-semibold text-muted-foreground">
              inares726@gmail.com
            </Text>

            <View className="mt-6 flex-row gap-3 items-center justify-center">
              {code.map((digit, index) => (
                <TextInput
                  value={digit}
                  key={index}
                  onChangeText={(digit) => handleChange(index, digit)}
                  keyboardType="numeric"
                  maxLength={1}
                  className="w-16 h-16 border rounded-xl border-border text-center font-bold text-2xl"
                />
              ))}
            </View>

            <TouchableOpacity
              onPress={handleNext}
              className="mt-10  py-2 rounded-xl text-white text-center w-3/4 mx-auto"
            >
              <View className="flex-row gap-3  items-center justify-center">
                <RefreshCcw size={15} color={"#F97316"} />
                <Text className="text-base text-primary font-semibold">
                  Renvoyer le code
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View className="mb-16">
            <SignupButtons href="/(auth)/info" label="Verifier" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
