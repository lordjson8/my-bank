import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
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
import { countries } from "@/constants";
import PhoneModal from "@/components/auth/phone-modal";

export default function StepTwo() {

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [modalVisible, setModalVisible] = useState(false);

  return (
     <KeyboardAvoidingView
              style={{
                flex: 1,
              }}
              behavior={Platform.OS === "ios" ? "padding" : "height"}

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
       <PhoneModal modalVisible={modalVisible} setModalVisible={setModalVisible} setSelectedCountry={setSelectedCountry}/>
        <View className="">
          <SignupHeader
            label="Quel est ton numéro de portable ?"
            progress="40%"
            step={2}
          />
          <Text className="text-xl text-muted-foreground">
            Nous utiliserons ce numéro comme numéro de compte Swift Pay.
          </Text>
          <View className="flex-row gap-4 mt-4 items-center">
            <View className="border-b border-border  w-20 ">
              {/* <Text className="text-sm text-muted-foreground">Pays</Text> */}
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text className="text-center text-lg py-4 px-0 font-bold">
                  {selectedCountry.flag} {selectedCountry.code}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-1  border-b border-border ">
              {/* <Text className="text-sm invisible text-muted-foreground">
                {"placeholder"}
              </Text> */}
              <TextInput
                placeholder={"Numéro de téléphone"}
                keyboardType="phone-pad"
                placeholderTextColor={"gray"}
                className={` w-full text-black px-0 text-lg py-4 border-border `}
              />
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
                <Text className="text-white text-xl">Soumettre</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
