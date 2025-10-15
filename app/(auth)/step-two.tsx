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



export default function StepTwo() {


  return (
      <SafeAreaView className="flex-1 p-4  bg-white">
        <ScrollView
          contentContainerStyle={{
            display: "flex",
            justifyContent: "space-between",
            minHeight: "100%",
          }}
          className="flex-1 px-4 py-8"
        >
          <View className="">
            <SignupHeader
              label="Quel est ton numéro de portable ?"
              progress="40%"
              step={2}
            />
            <Text className="text-xl text-muted-foreground">
              Nous utiliserons ce numéro comme numéro de compte Swift Pay.
            </Text>
            <View className="flex-row gap-3 mt-4">
              <View className="mb-4 border-b border-border">
                <Text className="text-sm text-muted-foreground">Pays</Text>
              </View>
              <View className="flex-1 mb-4 border-b border-border ">
                <Text className="text-sm invisible text-muted-foreground">
                  {"placeholder"}
                </Text>
                <View className="flex-row justify-between items-center">
                  <TextInput
                    placeholder={"Numéro de téléphone"}
                    placeholderTextColor={"gray"}
                    className={`rounded-xl w-full text-black px-0 text-base py-4 border-border `}
                  />
                </View>
              </View>
            </View>
          </View>
          <View>
            <View className="flex-row items-center gap-3 mb-4">
              <Text className="text-base text-muted-foreground">
                En fournissant votre numéro de téléphone, vous acceptez que nous
                puissions vous contacter par SMS/messagerie texte. Des frais de
                messagerie et de données peuvent s&apos;appliquer.
              </Text>
            </View>
            <View className="mt-4 mb-12">
              <Link href={"/(auth)/step-three"} asChild>
                <TouchableOpacity className="rounded-xl bg-primary flex flex-row items-center py-4 justify-center gap-2">
                  <Text className="text-white text-base">Soumettre</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
  );
}
