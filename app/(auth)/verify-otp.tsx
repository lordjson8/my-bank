import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  ActivityIndicator,
  Pressable,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SignupHeader from "@/components/auth/signup-header";
import { Link, useLocalSearchParams, router } from "expo-router";
import { useState, useRef, useEffect } from "react";
import api from "../../services/api";

const CODE_LENGTH = 6;

export default function VerifyOtp() {
  const { userId, phone, type } = useLocalSearchParams<{
    userId?: string;
    phone?: string;
    type?: string;
  }>();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [apiErrors, setApiErrors] = useState<Record<string, string[]> | null>(null);

  const inputRef = useRef<TextInput | null>(null);
  const cursorOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 400,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [cursorOpacity]);

  const handleContainerPress = () => {
    inputRef.current?.focus();
  };

  const handleOtpChange = (text: string) => {
    setErrorMsg(null);
    setOtp(text.replace(/\D/g, ""));
  };

  const handleSubmit = async () => {
    if (otp.length !== CODE_LENGTH) {
      setErrorMsg("Veuillez entrer le code à 6 chiffres.");
      return;
    }

    if (!userId) {
      setErrorMsg(
        "Utilisateur introuvable. Veuillez recommencer l'inscription."
      );
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setApiErrors(null);
    try {
      const endpoint =
        type === "email_verification"
          ? "/auth/verify-email/"
          : type === "login_2fa"
            ? "/auth/verify-2fa/"
            : "/auth/verify-phone/";

      const otp_type =
        type === "email_verification"
          ? "email_verification"
          : type === "login_2fa"
            ? "login_2fa"
            : "phone_verification";

      const res = await api.post(endpoint, {
        user_id: Number(userId),
        otp,
        otp_type,
      });

      if (!res.data?.success) {
        setErrorMsg(
          typeof res.data?.error === "string"
            ? res.data.error
            : "Le code est invalide. Veuillez réessayer."
        );
        return;
      }

      setSuccessMsg("Code vérifié avec succès !");

      if (res.data.data?.account_active) {
        router.replace("/(auth)/login");
      }
    } catch (err: any) {
      const backendError =
        err.response?.data?.error?.details ||
        "Une erreur est survenue. Veuillez réessayer.";
      setErrorMsg("Une erreur est survenue. Veuillez réessayer.");
      if (typeof backendError === "object") {
        setApiErrors(backendError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!userId) {
      setErrorMsg("Utilisateur introuvable.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setApiErrors(null);

    try {
      const otp_type =
        type === "email_verification"
          ? "email_verification"
          : type === "login_2fa"
            ? "login_2fa"
            : "phone_verification";

      const res = await api.post("/auth/resend-otp/", {
        user_id: Number(userId),
        otp_type,
      });

      if (res.data?.success) {
        setSuccessMsg(res.data.message || "Nouveau code envoyé.");
      } else {
        setErrorMsg(
          typeof res.data?.error === "string"
            ? res.data.error
            : "Impossible de renvoyer le code."
        );
      }
    } catch (err: any) {
      const backendError =
        err.response?.data?.error ||
        "Impossible de renvoyer le code.";
      setErrorMsg(
        typeof backendError === "string"
          ? backendError
          : JSON.stringify(backendError)
      );
      if (typeof backendError === "object") {
        setApiErrors(backendError);
      }
    } finally {
      setLoading(false);
    }
  };

  const displayPhone = phone ?? "+237 8085472417";

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
          }}
          className="flex-1 px-4 py-4"
        >
          <View>
            <SignupHeader
              label="Quel est ton numéro de portable ?"
              progress="60%"
              step={3}
            />

            {errorMsg && (
              <View className="px-4 py-3 mb-4 bg-red-100 border border-red-400 rounded-lg">
                <Text className="text-red-700 font-medium">{errorMsg}</Text>
              </View>
            )}
            {successMsg && (
              <View className="px-4 py-3 mb-4 bg-green-100 border border-green-400 rounded-lg">
                <Text className="text-green-700 font-medium">{successMsg}</Text>
              </View>
            )}

            <Text className="text-2xl font-bold text-gray-800 mb-2">
              Vérifiez votre numéro
            </Text>
            <Text className="text-base text-gray-600 mb-4">
              Nous avons envoyé un code de vérification à
            </Text>
            <View className="flex-row gap-2 items-center mb-6">
              <Text className="text-base font-semibold text-gray-800">
                {displayPhone}
              </Text>
              <Link href={"/(auth)/step-two"} asChild>
                <TouchableOpacity>
                  <Text className="text-base text-primary font-semibold">
                    Modifier
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>

            <Pressable
              onPress={handleContainerPress}
              className="flex-row justify-center gap-2 mb-6"
            >
              {[...Array(CODE_LENGTH)].map((_, index) => {
                const digit = otp[index] || "";
                const isFocused = index === otp.length;
                return (
                  <View
                    key={index}
                    className={`w-14 h-14 bg-gray-100 border-2 rounded-xl justify-center items-center ${
                      isFocused ? "border-primary" : "border-gray-200"
                    }`}
                  >
                    <Text className="text-2xl font-bold text-gray-800">
                      {digit}
                    </Text>
                    {isFocused && (
                      <Animated.View
                        style={{ opacity: cursorOpacity }}
                        className="absolute w-0.5 h-6 bg-primary"
                      />
                    )}
                  </View>
                );
              })}
            </Pressable>

            <TextInput
              ref={inputRef}
              value={otp}
              onChangeText={handleOtpChange}
              keyboardType="number-pad"
              maxLength={CODE_LENGTH}
              textContentType="oneTimeCode"
              autoComplete="one-time-code"
              style={{
                position: "absolute",
                width: 1,
                height: 1,
                opacity: 0,
                top: -100,
              }}
              caretHidden
            />

            {apiErrors?.errors && (
              <Text className="text-red-500 font-bold text-center">
                {apiErrors.errors[0]}
              </Text>
            )}
            {apiErrors?.error && (
              <Text className="text-red-500 font-bold text-center">
                {apiErrors.error}
              </Text>
            )}

            <View className="flex-row justify-center gap-1">
              <Text className="text-base text-gray-600">
                Vous n&apos;avez pas reçu le code ?
              </Text>
              <TouchableOpacity disabled={loading} onPress={handleResend}>
                <Text className="text-base text-primary font-semibold">
                  Renvoyer le code
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mt-8">
            <Text className="text-xs text-gray-500 text-center mb-4">
              En fournissant votre numéro de téléphone, vous acceptez nos termes
              et conditions. Des frais de messagerie peuvent s&apos;appliquer.
            </Text>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              className={`rounded-lg ${
                loading ? "bg-orange-200" : "bg-primary"
              } py-4 flex-row items-center justify-center`}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white text-lg font-bold text-center">
                  Soumettre
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
