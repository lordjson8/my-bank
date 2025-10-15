import { View, Text, ScrollView, KeyboardAvoidingView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Progress from "@/components/auth/progress";
import Input from "@/components/auth/input";
import FileInput from "@/components/auth/file-input";
import { Camera, Upload } from "lucide-react-native";
import DateInput from "@/components/auth/date-picker";
import SubmitButtons from "@/components/auth/submit-buttons";
import { InfoType } from "@/types";
import { ImagePickerAsset } from "expo-image-picker";
import { validateInfo } from "@/utils";

export default function Info() {
  const [info, setInfo] = useState<InfoType>({
    firstname: { value: "" },
    lastname: { value: "" },
    address: { value: "" },
    id: { value: null },
    date: { value: null },
    selfie: { value: null },
  });

  const [errors, setErrors] = useState(["", "", "", "", "", ""]);
  const [showErrors, setShowErrors] = useState<boolean>(false);

  useEffect(() => {
    if (showErrors) {
      validateInfo(info, setInfo, errors, setErrors);
    }
  }, [info]);
  const onsubmit = () => {
    validateInfo(info, setInfo, errors, setErrors);
    setShowErrors(true);
    setShowErrors(true);
    console.log(info, errors);
  };

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
            error={errors[0]}
            value={info.lastname.value}
            keyboardType="default"
            setValue={(text: string) =>
              setInfo({ ...info, lastname: { value: text } })
            }
            label="Prénom"
            placeholder="Votre prénom"
          />
          <Input
            secure={false}
            error={errors[1]}
            value={info.firstname.value}
            keyboardType="default"
            setValue={(text: string) =>
              setInfo({ ...info, firstname: { value: text } })
            }
            label="Nom"
            placeholder="Votre nom"
          />
          <DateInput
            error={errors[2]}
            secure={false}
            date={info.date.value}
            keyboardType="default"
            setDate={(date: Date) =>
              setInfo({ ...info, date: { value: date } })
            }
            label="Date de naissance"
            placeholder="mm/dd/yyyy"
          />

          <Input
            secure={false}
            error={errors[3]}
            value={info.address.value}
            keyboardType="default"
            setValue={(text: string) =>
              setInfo({ ...info, address: { value: text } })
            }
            label="Adresse"
            placeholder="Votre adresse complète"
          />

          <FileInput
            image={info.id.value}
            error={errors[4]}
            setImage={(file: ImagePickerAsset | null) =>
              setInfo({ ...info, id: { value: file } })
            }
            label="Pièce d'identité "
            Icon={Upload}
            inputLabel="Carte d'identité ou passeport"
            description="Cliquez pour téléverser"
          />
          <FileInput
            error={errors[6]}
            image={info.selfie.value}
            setImage={(file: ImagePickerAsset | null) =>
              setInfo({ ...info, selfie: { value: file } })
            }
            label="Selfie"
            Icon={Camera}
            inputLabel="Photo de vous-même"
            description="Cliquez pour téléverser"
          />

          <SubmitButtons
            onPressFN={onsubmit}
            href="/(auth)/security"
            label="Continuer"
          />

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
