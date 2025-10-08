import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SignupHeader from "@/components/auth/signup-header";
import Input from "@/components/auth/input";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import { Link } from "expo-router";
import { router } from "expo-router";
import SignupButtons from "@/components/auth/signup-buttons";
import Politics from "@/components/auth/politics";

export default function EmailSignup() {
  const [email, setEmail] = useState("");

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <ScrollView className="px-4 py-8">
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
  );
}
