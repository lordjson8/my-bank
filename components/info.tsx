import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { useState } from "react";
import Input from "@/components/auth/input";
import DateInput from "@/components/auth/date-picker";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PersonalInfoSchema, PersonalInfoFormData } from "@/utils/zod-schemas";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";
import { createOrUpdateKYCProfile } from "@/services/user.service";
import { AxiosError } from "axios";
import { date } from "zod/v3";
import { useAuthStore } from "@/store/authStore";

export function Back({
  progress,
  step,
  showProgress = true,
}: {
  progress?: string;
  step: number;
  showProgress?: boolean;
}) {
  const total = 5;
  const style = ["w-[20%]", "w-[40%]", "w-[60%]", "w-[80%]", "w-[100%]"];
  console.log(style);
  return (
    <View className="fixed left-0 top-0 ">
      <View
        className={`flex flex-row justify-between items-center text-gray-300`}
      >
        <TouchableOpacity
          className="rounded-full bg-border"
          onPress={() => {
            router.back();
          }}
        >
          <ChevronLeft size={32} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

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

export default function Info() {
  // const [isSubmitting,setisSubmitting] = useState<boolean>(false)
  const {updateUser} = useAuthStore()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(PersonalInfoSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      postal_code: "",
      state_province: "",
      date_of_birth: undefined,
      gender: undefined,
    },
  });

  const onSubmit = async (data: PersonalInfoFormData) => {
    console.log(data);
    try {
      await createOrUpdateKYCProfile({
        ...data,
        date_of_birth: data.date_of_birth
          ? data.date_of_birth.toISOString().split("T")[0]
          : undefined,
      });
      await updateUser()
      router.replace("/(kyc)/upload-kyc-docs");

    } catch (error: AxiosError | any) {
      console.log(
        "Error updating KYC profile:",
        error instanceof AxiosError
          ? JSON.stringify(error.response?.data)
          : error
      );
      return;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View className="px-6 py-8">
        <Back step={4} progress="80%" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          <View className="mt-6 mb-4">
            <Text className="text-center font-bold text-2xl">
              Vérification d&apos;identité
            </Text>
            <Text className="text-center text-base font-[400] text-muted-foreground mt-4 leading-6">
              Ces informations sont nécessaires pour sécuriser votre compte
            </Text>
          </View>

          <Input
            name="first_name"
            control={control}
            label="Prénom"
            placeholder="Votre prénom"
            secure={false}
            keyboardType="default"
          />

          <Input
            name="last_name"
            control={control}
            label="Nom"
            placeholder="Votre nom"
            secure={false}
            keyboardType="default"
          />

          <Controller
            control={control}
            name="date_of_birth"
            render={({ field: { onChange, value } }) => (
              <DateInput
                label="Date de naissance"
                placeholder="mm/dd/yyyy"
                date={value}
                setDate={onChange}
                error={errors.date_of_birth?.message}
                secure={false}
                keyboardType="default"
              />
            )}
          />

          <GenderSelector
            name="gender"
            control={control}
            error={errors.gender}
          />

          <Input
            name="address_line_1"
            control={control}
            label="Adresse Ligne 1"
            placeholder="Votre adresse"
            secure={false}
            keyboardType="default"
          />

          <Input
            name="address_line_2"
            control={control}
            label="Adresse Ligne 2 (Optionnel)"
            placeholder="Appartement, suite, etc."
            secure={false}
            keyboardType="default"
          />

          <Input
            name="city"
            control={control}
            label="Ville"
            placeholder="Votre ville"
            secure={false}
            keyboardType="default"
          />

          <Input
            name="state_province"
            control={control}
            label="État/Province"
            placeholder="Votre état ou province"
            secure={false}
            keyboardType="default"
          />

          <Input
            name="postal_code"
            control={control}
            label="Code Postal"
            placeholder="Votre code postal"
            secure={false}
            keyboardType="default"
          />
          {/* <Controller
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
          /> */}

          {/* <Controller
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
          /> */}

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="bg-primary rounded-xl py-4 flex-row justify-center items-center mt-6"
          >
            {isSubmitting ? (
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
