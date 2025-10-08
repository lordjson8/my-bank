import { KeyboardAvoidingView, ScrollView } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SignupHeader from "@/components/auth/signup-header";
import Input from "@/components/auth/input";

import SignupButtons from "@/components/auth/signup-buttons";
import Politics from "@/components/auth/politics";

export default function EmailSignup() {
  const [email, setEmail] = useState("");

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1">
      <SafeAreaView className="flex-1 p-4 bg-white">
        <ScrollView
          className="flex-1 px-4 py-8"
        >
          <SignupHeader />
          <Input
            secure={false}
            label="Address email"
            value={email}
            setValue={setEmail}
            placeholder="votre.email@exemple.com"
            keyboardType="email-address"
          />
          <SignupButtons href="/(auth)/verify" label="Continuer" />

          <Politics />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
