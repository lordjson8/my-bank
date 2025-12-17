import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SignupHeader from "@/components/auth/signup-header";
import PasswordInput from "@/components/auth/password-input";
import { Checkbox } from "expo-checkbox";
import { Link } from "expo-router";
import TextBold from "@/components/auth/text-bold";
import { useEffect, useState } from "react";
import Input from "@/components/auth/input";
import PhoneModal from "@/components/auth/phone-modal";
import { countries } from "@/constants";
import CountrySelect from "@/components/shared/CountrySelect";
import { set, useForm } from "react-hook-form";
import z from "zod/v3";
import { SignupFormData, SignupSchema } from "@/utils/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";

export default function EmailSignup() {
  const {
    control,
    handleSubmit,
    // setValue,
    // getValues,
    // reset,
    // trigger,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
    // mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      phoneNumber: "",
    },
  });

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErromessage] = useState<string | null>(null);

  const OnSubmit = async (data: SignupFormData) => {
    setErromessage(null);
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsLoading(false);
    setErromessage("An error occurred. Please try again.");
    console.log("Form Data: ", data);
    console.log("Selected Country", selectedCountry);
  };

  return (
    <SafeAreaView className="flex-1 p-4  bg-white">
      <PhoneModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setSelectedCountry={setSelectedCountry}
      />

      <ScrollView
        contentContainerStyle={{
          display: "flex",
          justifyContent: "space-between",
          flexGrow: 1,
          // minHeight: "100%",
        }}
        className="flex-1 px-4 py-8"
      >
        <View className="">
          
          <SignupHeader
            label="Get started with your account!"
            step={1}
            progress="20%"
          />
            {errorMessage && (
            <View className="px-4  py-2 mb-2 bg-red-500 rounded-lg">
              <Text className="font-bold text-white">Error : </Text>
              <Text className="text-white">
                {errorMessage}
              </Text>
            </View>
          )}
          <Input
            disable={isLoading}
            name="email"
            control={control}
            secure={false}
            keyboardType="email-address"
            label="Email"
            placeholder="Votre address email"
          />
          <CountrySelect
            disable={isLoading}
            control={control}
            name="phoneNumber"
          />
          <PasswordInput
            disable={isLoading}
            name="password"
            control={control}
            keyboardType="default"
            label="Mot de passe"
            placeholder="Votre mot de passe"
          />
        
        </View>

        <View>
          <View className="flex-row items-center gap-3">
            <Checkbox
              color={"#F97316"}
              onValueChange={() => setAgreeTerms(!agreeTerms)}
              value={agreeTerms}
            />
            <View className="flex-1">
              <Text className="flex-1 text-muted-foreground text-pretty text-base">
                J&apos;ai lu et compris les{" "}
                <TextBold label="conditions générales" />
                et la <TextBold label="politique" /> de
                <TextBold label="confidentialité" /> de Quick Finance.
              </Text>
            </View>
          </View>
          <View className="mt-2">
            <TouchableOpacity
              onPress={handleSubmit(OnSubmit)}
              disabled={!agreeTerms || isLoading}
              className={`rounded-xl ${!agreeTerms || isLoading ? "bg-orange-200" : "bg-primary"} flex flex-row items-center py-4 justify-center gap-2`}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-white text-xl">Commencer</Text>
              )}
            </TouchableOpacity>
            <View className="flex-row items-center justify-center px-4 mt-4 mb-2">
              <Text className="text-center font-bold text-base text-gray-700 items-center justify-center">
                Vous avez deja un compte ?{" "}
              </Text>
              <Link href={"/(auth)/login"} asChild>
                <TouchableOpacity>
                  <Text className="text-primary font-bold text-pretty underline text-base">
                    Login
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
