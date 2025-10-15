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
import { RefreshCcw } from "lucide-react-native";

export default function StepThree() {
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
              label="Quel est ton numéro de portable ?"
              progress="60%"
              step={3}
            />

            <Text className="text-xl text-muted-foreground mb-3">
              Sécurisez votre accès{" "}
            </Text>
            <View className="flex-row gap-3">
              <Text className="text-xl text-muted-foreground">
                +237 8085472417
              </Text>
              <Link href={"/(auth)/step-two"} asChild>
                <TouchableOpacity>
                  <Text className="text-xl ">Modifier le numéro</Text>
                </TouchableOpacity>
              </Link>
            </View>
            <View className="flex-1 flex-row gap-3 mt-4 mb-4">
              <View className="mt-6 flex-1 flex-row flex-wrap gap-3  items-center ">
                {code.map((digit, index) => (
                  <TextInput
                    value={digit}
                    key={index}
                    onChangeText={(digit) => handleChange(index, digit)}
                    keyboardType="numeric"
                    maxLength={1}
                    className="w-14 h-14  border rounded-xl border-border text-center font-bold "
                  />
                ))}
              </View>
            </View>

            <View className="flex-1 flex-row gap-2 mt-4 mb-4">
              <Text>Vous n&apos;avez pas reçu le code ?</Text>
              <TouchableOpacity className=" rounded-xl text-white ">
                <Text className="text-base text-primary font-semibold">
                  Renvoyer le code
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="mt-6">
            <View className="flex-row items-center gap-3 mb-4">
              <Text className="text-base text-muted-foreground">
                En fournissant votre numéro de téléphone, vous acceptez que nous
                puissions vous contacter par SMS/messagerie texte. Des frais de
                messagerie et de données peuvent s&apos;appliquer.
              </Text>
            </View>
            <View className="mt-4 mb-12">
              <Link href={"/(auth)/step-four"} asChild>
                <TouchableOpacity className="rounded-xl bg-primary flex flex-row items-center py-4 justify-center gap-2">
                  <Text className="text-white text-base">Soumettre</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
