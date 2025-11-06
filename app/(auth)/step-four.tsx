import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SignupHeader from "@/components/auth/signup-header";
import { Link } from "expo-router";
import { useState } from "react";
import { LockKeyhole, ScanFace } from "lucide-react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { Alert } from "react-native";

export default function StepFour() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const handleLocalAuthentication = async () => {
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    console.log(isEnrolled);
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Confirmerer l'authentification",
        cancelLabel: "Annuler",
        fallbackLabel: "Utiliser le code",
        disableDeviceFallback: false,
      });

      if (result.success) {
        Alert.alert("Succès", "Authentification réussie !");
      } else {
        if (result.error === "not_available") {
          // showPermissionGuide();
        } else if (result.error === "not_enrolled") {
          Alert.alert(
            "Biométrie non configurée",
            "Veuillez configurer les empreintes digitales ou Face ID dans les paramètres de votre appareil."
          );
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
      enabled
      style={{
        flex: 1,
      }}
    >
      <SafeAreaView className="flex-1 p-4  bg-white">
        <View className="px-4 py-8 flex-1">
          <SignupHeader label="Sécurisez votre accès" progress="60%" step={4} />

          <Text className="text-xl text-muted-foreground mb-3">
            Choisissez comment vous souhaitez déverrouiller et accéder à vot
          </Text>

          <View className="border-b border-border">
            <TouchableOpacity
              onPress={handleLocalAuthentication}
              className=" flex-row gap-6 py-4 items-center"
            >
              <ScanFace color={"#F97316"} size={32} />
              <Text className="font-bold text-xl ">Face ID & Passcode</Text>
            </TouchableOpacity>
          </View>

          <Link href={"/(auth)/access-code"} asChild>
            <TouchableOpacity className="flex-row gap-6 py-4 items-center">
              <LockKeyhole color={"#F97316"} size={32} />
              <Text className="font-bold text-xl ">
                Code d&apos;accès uniquement
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
