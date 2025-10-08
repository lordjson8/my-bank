import { View, Text, ScrollView, KeyboardAvoidingView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Progress from "@/components/auth/progress";
import Input from "@/components/auth/input";
import SignupButtons from "@/components/auth/signup-buttons";
import FileInput from "@/components/auth/file-input";
import { Camera, Upload } from "lucide-react-native";
import DateInput from "@/components/auth/date-picker";

export default function Info() {
  const [info, setInfo] = useState({
    firstname: "",
    lastname: "",
    address: "",
    id: "",
    selfie: "",
  });
  const [id, setId] = useState<string>("");
  const [selfie, setSelfie] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 p-4 bg-white">
        <ScrollView className="px-4 py-8">
          <Progress step={4} progress="80%" />
          <View className="mt-6 mb-4">
            <Text className="text-center font-bold text-2xl">
              Vérification d&apos;identité
            </Text>
            <Text className="text-center text-base font-[400] text-muted-foreground mt-4 leading-6">
              Ces informations sont nécessaires pour sécuriser votre compte
            </Text>
          </View>
          <Input
            secure={false}
            value={info.lastname}
            keyboardType="default"
            setValue={(text) => setInfo({ ...info, lastname: text })}
            label="Prénom"
            placeholder="Votre prénom"
          />
          <Input
            secure={false}
            value={info.firstname}
            keyboardType="default"
            setValue={(text) => setInfo({ ...info, firstname: text })}
            label="Nom"
            placeholder="Votre nom"
          />
          <DateInput
            secure={false}
            date={date}
            keyboardType="default"
            setDate={setDate}
            label="Date de naissance"
            placeholder="mm/dd/yyyy"
          />

          <Input
            secure={false}
            value={info.address}
            keyboardType="default"
            setValue={(text) => setInfo({ ...info, address: text })}
            label="Adresse"
            placeholder="Votre adresse complète"
          />

          <FileInput
            image={id}
            setImage={setId}
            label="Pièce d'identité "
            Icon={Upload}
            inputLabel="Carte d'identité ou passeport"
            description="Cliquez pour téléverser"
          />
          <FileInput
            image={selfie}
            setImage={setSelfie}
            label="Selfie"
            Icon={Camera}
            inputLabel="Photo de vous-même"
            description="Cliquez pour téléverser"
          />

          <SignupButtons href="/(auth)/security" label="Continuer" />

          <View className="mb-12 mt-3 bg-[#FEFCE8] px-3 py-4 rounded-xl ">
            <Text className="text-[#854D0E] text-center leading-6">
              Vos données sont traitées de manière sécurisée et conformément à
              notre politique de confidentialité.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
