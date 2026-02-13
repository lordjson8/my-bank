import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SignupHeader from "@/components/auth/signup-header";
import PasswordInput from "@/components/auth/password-input";
import { Checkbox } from "expo-checkbox";
import { Link, router } from "expo-router";
import TextBold from "@/components/auth/text-bold";
import { useState } from "react";
import Input from "@/components/auth/input";
import { countries } from "@/constants";
import CountrySelect from "@/components/shared/CountrySelect";
import { useForm } from "react-hook-form";
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
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiErrors, setApiErrors] = useState<Record<string, string[]> | null>(null);

  const onSubmit = async (data: SignupFormData) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);
    setApiErrors(null);

    try {
      const phone = `${selectedCountry.code}${data.phoneNumber}`;

      const payload = {
        email: data.email.trim(),
        phone,
        password: data.password,
        country: selectedCountry.iso,
      };

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
      const backendError =
        err.response?.data?.error?.details ||
        "Une erreur est survenue lors de l'inscription. Veuillez réessayer.";
      setErrorMessage(
        typeof backendError === "string"
          ? backendError
          : "Une erreur est survenue lors de l'inscription."
      );
      if (typeof backendError === "object") {
        setApiErrors(backendError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            display: "flex",
            justifyContent: "space-between",
            flexGrow: 1,
            gap: 20,
          }}
          className="flex-1 px-4 py-8"
        >
          <View>
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
            {apiErrors?.email && (
              <Text className="text-red-500 mt-1">{apiErrors.email[0]}</Text>
            )}
            <CountrySelect
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              disable={isLoading}
              control={control}
              name="phoneNumber"
            />
            {apiErrors?.phone && (
              <Text className="text-red-500 mt-1">{apiErrors.phone[0]}</Text>
            )}
            <PasswordInput
              disable={isLoading}
              name="password"
              control={control}
              keyboardType="default"
              label="Mot de passe"
              placeholder="Votre mot de passe"
            />
            {apiErrors?.password && (
              <Text className="text-red-500 mt-1">
                {apiErrors.password[0]}
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
                onPress={handleSubmit(onSubmit)}
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
