import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Progress from "@/components/auth/progress";
import Input from "@/components/auth/input";
import SignupButtons from "@/components/auth/signup-buttons";
import { Fingerprint, Shield } from "lucide-react-native";
import { Checkbox } from "expo-checkbox";

export default function Security() {
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
    <SafeAreaView className="flex-1 p-4 bg-white">
      <ScrollView className="px-4 py-8">
        <Progress step={5} progress="100%" />
        <View className="flex min-h-[85vh] justify-center">
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
          {password.length > 0 && (
            <View className="mb-3">
              <View className="flex-row justify-between items-center ">
                <Text className="text-sm text-gray-600">
                  Force du mot de passe
                </Text>
                <Text className={`text-sm font-semibold ${strength.color}`}>
                  {strength.text}
                </Text>
              </View>
              <View className="h-2 bg-gray-300 rounded-full mt-2">
                <View
                  className={`h-2 bg-primary ${strength.text === "Faible" ? "w-[20%] bg-red-500" : strength.text === "Moyen" ? "w-[50%]" : strength.text === "Fort" ? "w-[100%] bg-green-500" : "w-0"} rounded-full`}
                ></View>
              </View>
            </View>
          )}
          <Input
            secure
            value={confirmPassword}
            keyboardType="default"
            setValue={setConfirmPassword}
            label="Confirmer le mot de passe"
            placeholder="********"
          />
          <View className="flex-row   items-center w-screen gap-2 mb-4">
            <Checkbox
              color={"#F97316"}
              onValueChange={() => setBiometric(!biometric)}
              value={biometric}
            />
            <View className="flex-row flex-1 items-center  gap-3">
              <Text>
                <Fingerprint color={"#F97316"} />
              </Text>
              <View className="flex-1">
                <Text>Activer l&apos;authentification biométrique</Text>
                <Text className=" text-muted-foreground text-pretty text-xs">
                  Utilisez votre empreinte ou Face ID pour vous connecter
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row items-center  gap-2">
            <Checkbox
              color={"#F97316"}
              onValueChange={() => setTwoFactor(!twoFactor)}
              value={twoFactor}
            />

            <View className="flex-row  flex-1 items-center  gap-3">
              <Text>
                <Shield color={"#F97316"} />
              </Text>
              <View className="flex-1">
                <Text>Activer l&apos;authentification à deux facteurs</Text>
                <Text className="text-muted-foreground text-pretty text-xs">
                  Une sécurité supplémentaire pour votre compte
                </Text>
              </View>
            </View>
          </View>

          <SignupButtons href="/(auth)/success" label="Continuer" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
