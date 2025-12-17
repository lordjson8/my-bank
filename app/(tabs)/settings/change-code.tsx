import { View, Text, ScrollView, KeyboardAvoidingView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Progress from "@/components/auth/progress";
import Input from "@/components/auth/input";
import SignupButtons from "@/components/auth/signup-buttons";
import { Fingerprint, Shield } from "lucide-react-native";
import { Checkbox } from "expo-checkbox";

export default function ChangeCode() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [biometric, setBiometric] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { text: "", color: "text-gray-400" };
    if (pwd.length < 6) return { text: "Faible", color: "text-red-500" };
    if (pwd.length < 8) return { text: "Moyen", color: "text-orange-500" };
    return { text: "Fort", color: "text-green-500" };
  };

  const strength = getPasswordStrength(password);
  const isFormValid =
    password && confirmPassword && password === confirmPassword;

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1">
      <SafeAreaView className="flex-1 p-4 bg-white">
        <ScrollView className="px-4">
          <View className="flex-1 mb-32">
            <View className=" mb-4">
              <Text className="text-center font-bold text-2xl">
                Sécurité du compte
              </Text>
              <Text className="text-center text-base font-[400] text-muted-foreground mt-4 leading-6">
                Configurez les options de sécurité pour protéger votre compte
              </Text>
            </View>
            <Input
              secure
              value={password}
              keyboardType="default"
              setValue={setPassword}
              label="Créer un mot de passe"
              placeholder="********"
            />

            <Input
              secure
              value={confirmPassword}
              keyboardType="default"
              setValue={setConfirmPassword}
              label="Confirmer le mot de passe"
              placeholder="********"
            />

            <SignupButtons href="/(auth)/success" label="Continuer" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
