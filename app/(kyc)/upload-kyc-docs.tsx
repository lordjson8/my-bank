import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Progress from "@/components/auth/progress";
import Input from "@/components/auth/input";
import FileInput from "@/components/auth/file-input";
import { Camera, Upload } from "lucide-react-native";
import DateInput from "@/components/auth/date-picker";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PersonalInfoSchema,
  PersonalInfoFormData,
  KYCDocsFormData,
  KYCDocsSchema,
} from "@/utils/zod-schemas";
import { router } from "expo-router";
import { Back } from "@/components/info";

const GenderSelector = ({
  control,
  name,
  error,
}: {
  control: any;
  name: string;
  error?: any;
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View className="mb-4">
          <Text className="text-gray-700 text-base font-medium mb-2">
            Gender
          </Text>
          <View className="flex-row gap-4">
            <TouchableOpacity
              className={`flex-1 py-3 px-4 rounded-lg border ${
                value === "male"
                  ? "border-primary bg-orange-50"
                  : "border-gray-300 bg-white"
              }`}
              onPress={() => onChange("male")}
            >
              <Text
                className={`text-center font-medium ${
                  value === "male" ? "text-primary" : "text-gray-700"
                }`}
              >
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 px-4 rounded-lg border ${
                value === "female"
                  ? "border-primary bg-orange-50"
                  : "border-gray-300 bg-white"
              }`}
              onPress={() => onChange("female")}
            >
              <Text
                className={`text-center font-medium ${
                  value === "female" ? "text-primary" : "text-gray-700"
                }`}
              >
                Female
              </Text>
            </TouchableOpacity>
          </View>
          {error && <Text className="text-red-500 mt-1">{error.message}</Text>}
        </View>
      )}
    />
  );
};

export function Info() {
  const {
    control,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<KYCDocsFormData>({
    resolver: zodResolver(KYCDocsSchema),
    defaultValues: {
      id: null,
      selfie: null,
    },
  });

  const onSubmit = (data: KYCDocsFormData) => {
    console.log(data);
    // You can now submit this data to your backend
    // router.replace("/(kyc)/upload-kyc-docs");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View className="px-6 py-8">
        <Back step={2} progress="50%" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          <View className="mt-3 mb-4">
            <Text className="text-center font-bold text-2xl">
              Vérification d&apos;identité
            </Text>
            <Text className="text-center text-base font-[400] text-muted-foreground mt-4 leading-6">
              Ces informations sont nécessaires pour sécuriser votre compte
            </Text>
          </View>

          <Controller
            control={control}
            name="id"
            render={({ field: { onChange, value } }) => (
              <FileInput
                label="Pièce d'identité"
                inputLabel="Carte d'identité ou passeport"
                description="Cliquez pour téléverser"
                Icon={Upload}
                image={value}
                setImage={onChange}
                error={errors.id?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="selfie"
            render={({ field: { onChange, value } }) => (
              <FileInput
                label="Selfie"
                inputLabel="Photo de vous-même"
                description="Cliquez pour téléverser"
                Icon={Camera}
                image={value}
                setImage={onChange}
                error={errors.selfie?.message}
              />
            )}
          />

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="bg-primary rounded-xl py-4 flex-row justify-center items-center mt-6"
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-xl font-bold">Continuer</Text>
            )}
          </TouchableOpacity>

          <View className="mb-12 mt-3 bg-[#FEFCE8] px-3 py-4 rounded-xl ">
            <Text className="text-[#854D0E] text-center leading-6">
              Vos données sont traitées de manière sécurisée et conformément à
              notre politique de confidentialité.
            </Text>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

export default function UploadKYCDocs() {
  return (
    <View className="flex-1">
      <SafeAreaView className="flex-1">
        <Info />
      </SafeAreaView>
    </View>
  );
}
