import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SignupHeader from "@/components/auth/signup-header";
import { Link } from "expo-router";
import { useState } from "react";
import { Code, LockKeyhole, RefreshCcw, ScanFace } from "lucide-react-native";

export default function StepFour() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const handleChange = (index: number, value: string) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 3) {
      // You would need to use refs for actual auto-focus
    }
  };
  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
      }}
    >
      <SafeAreaView className="flex-1 p-4  bg-white">
        <ScrollView
          contentContainerStyle={{
            display: "flex",
            justifyContent: "space-between",
            minHeight: "100%",
          }}
          className="flex-1 px-4 py-8"
        >
          <View>
            <SignupHeader
              label="Sécurisez votre accès"
              progress="60%"
              step={4}
            />

            <Text className="text-xl text-muted-foreground mb-3">
              Choisissez comment vous souhaitez déverrouiller et accéder à vot
            </Text>

            <View className="border-b border-border flex-1">
              <TouchableOpacity className="flex-1 flex-row gap-6 py-4 items-center">
                <ScanFace color={"#F97316"} size={32} />
                <Text className="font-bold text-xl ">Face ID & Passcode</Text>
              </TouchableOpacity>
            </View>

            <Link href={'/(auth)/access-code'} asChild>
              <TouchableOpacity className="flex-1 flex-row gap-6 py-4 items-center">
                <LockKeyhole color={"#F97316"} size={32} />
                <Text className="font-bold text-xl ">
                  Code d&apos;accès uniquement
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
