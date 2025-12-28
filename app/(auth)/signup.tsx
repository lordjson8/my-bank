import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
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
import { Link, router } from "expo-router";
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
import api from "../../services/api";

export default function EmailSignup() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiErrors, setApiEroors] = useState<null | any>(null);

  const OnSubmit = async (data: SignupFormData) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);
    setApiEroors(null);

    try {
      // Build phone in E.164 format, e.g. +2250748672248
      const phone = `${selectedCountry.code}${data.phoneNumber.replace(/^0+/, "")}`;

      const payload = {
        email: data.email.trim(),
        phone,
        password: data.password,
        // full_name: data.fullName ?? "",      // if you have this in your schema
        country: selectedCountry.iso, // e.g. "CI"
      };

      console.log(payload);
      const res = await api.post("/auth/register/", payload);

      if (!res.data?.success) {
        setErrorMessage(
          typeof res.data?.error === "string"
            ? res.data.error
            : "Une erreur est survenue lors de l'inscription."
        );
        return;
      }

      const userId = res.data.data.user_id;
      const email = res.data.data.email;
      const phoneFromApi = res.data.data.phone;

      setSuccessMessage("Compte créé avec succès ! Redirection...");

      // Go to OTP verification, pass what you need
      setTimeout(() => {
        setSuccessMessage(null);
        router.push({
          pathname: "/(auth)/verify-otp",
          params: {
            userId: String(userId),
            email,
            phone: phoneFromApi,
            type: "email_verification",
          },
        });
      }, 1000);
    } catch (err: any) {
      // Try to show backend validation errors
      //  setTimeout(() => {
      // router.push({
      // pathname: "/(auth)/verify-otp",
      // params: {
      //   userId: String(userId),
      //   email,
      //   phone: phoneFromApi,
      // },
      // });
      // }, 1000);
      const backendError =
        err.response?.data?.error?.details ||
        "Une erreur est survenue lors de l'inscription. Veuillez réessayer.";
      setErrorMessage(
        typeof backendError === "string"
          ? backendError
          : "Une erreur est survenue lors de l'inscription."
      );
      setApiEroors(backendError);
      console.log(apiErrors, backendError);
      // setTimeout(() => {
      //   setApiEroors(null)
      // },3000)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4  bg-white">
      <PhoneModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setSelectedCountry={setSelectedCountry}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            display: "flex",
            justifyContent: "space-between",
            flexGrow: 1,
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
              <View className="px-4 py-3 mb-4 bg-red-100 border border-red-400 rounded-lg">
                <Text className="text-red-700 font-medium">{errorMessage}</Text>
              </View>
            )}
            {successMessage && (
              <View className="px-4 py-3 mb-4 bg-green-100 border border-green-400 rounded-lg">
                <Text className="text-green-700 font-medium">
                  {successMessage}
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
            {/* {errors.email && <Text className="text-red-500 mt-1">{errors.email.message}</Text>} */}
            {apiErrors?.email && (
              <Text className="text-red-500 mt-1">{apiErrors?.email[0]}</Text>
            )}
            <CountrySelect
              disable={isLoading}
              control={control}
              name="phoneNumber"
            />
            {/* {errors.phoneNumber && <Text className="text-red-500 mt-1">{errors.phoneNumber.message}</Text>} */}
            {apiErrors?.phone && (
              <Text className="text-red-500 mt-1">{apiErrors?.phone[0]}</Text>
            )}
            <PasswordInput
              disable={isLoading}
              name="password"
              control={control}
              keyboardType="default"
              label="Mot de passe"
              placeholder="Votre mot de passe"
            />
            {/* {errors.password && <Text className="text-red-500 mt-1">{errors.password.message}</Text>} */}
            {apiErrors?.password && (
              <Text className="text-red-500 mt-1">
                {apiErrors?.password[0]}
              </Text>
            )}
          </View>

          <View>
            <View className="flex-row items-center gap-3">
              <Checkbox
                color={"#F97316"}
                onValueChange={() => setAgreeTerms(!agreeTerms)}
                value={agreeTerms}
                disabled={isLoading}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
