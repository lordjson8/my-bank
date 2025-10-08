import { ScrollView } from "react-native";

import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SignupHeader from "@/components/auth/signup-header";
import Input from "@/components/auth/input";
import SignupButtons from "@/components/auth/signup-buttons";
import Politics from "@/components/auth/politics";

export default function EmailSignup() {
  const [phone, setPhone] = useState("");

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <ScrollView className="px-4 py-8">
        <SignupHeader />
        <Input
          secure={false}
          label="Numéro de téléphone"
          value={phone}
          setValue={setPhone}
          placeholder="06 12 34 56 78"
          keyboardType="phone-pad"
        />
        <SignupButtons href="/(auth)/verify" label="Continuer" />
        <Politics />
      </ScrollView>
    </SafeAreaView>
  );
}
