import {
  ActivityIndicator,
  Alert,
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
import { Link, router } from "expo-router";
import { useState } from "react";
import Input from "@/components/auth/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormType, LoginSchema } from "@/utils/zod-schemas";
import api from "@/services/api";
import deviceServices from "@/services/device.services";
import { useAuthStore } from "@/store/authStore";

export default function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { loginSuccess } = useAuthStore();

  const onSubmit = async (data: LoginFormType) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const deviceInfo = deviceServices.getDeviceInfo();

      const response = await api.post("/auth/login/", {
        email: data.email.trim(),
        password: data.password,
        device_id: deviceInfo.device_id,
        device_name: deviceInfo.device_name,
        device_type: deviceInfo.device_type,
      });

      // Check response success
      if (!response.data?.success) {
        // Handle different error codes
        const errorCode = response.data?.error_code;
        const errorMsg = response.data?.error;

        if (errorCode === "ACCOUNT_NOT_VERIFIED") {
          // Account exists but not verified
          Alert.alert(
            "Account Not Verified",
            response.data?.message || "Please verify your account to continue.",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Verify Now",
                onPress: () => {
                  // Navigate to OTP verification
                  router.push({
                    pathname: "/(auth)/verify-otp",
                    params: {
                      userId: String(response.data.data.user_id),
                      email: response.data.data.email,
                      phone: response.data.data.phone,
                      type: response.data.data.email_verified
                        ? "phone_verification"
                        : "email_verification",
                    },
                  });
                },
              },
            ]
          );
          return;
        }

        // Other errors
        setErrorMessage(
          typeof errorMsg === "string"
            ? errorMsg
            : "Invalid email or password. Please try again."
        );
        return;
      }

      // Check if 2FA is required
      if (response.data.requires_2fa) {
        setSuccessMessage("OTP sent to your phone. Redirecting...");

        setTimeout(() => {
          router.push({
            pathname: "/(auth)/verify-otp",
            params: {
              userId: String(response.data.data.user_id),
              phone: response.data.data.phone_masked || "",
              type: "login_2fa",
            },
          });
        }, 1000);
        return;
      }

      // Login successful - save tokens and navigate
      if (response.data.data?.tokens) {
        const { user, tokens } = response.data.data;

        await loginSuccess({
          user,
          access: tokens.access,
          refresh: tokens.refresh,
        });
        setSuccessMessage("Login successful! Redirecting...");
      }
    } catch (err: any) {
      // Handle network errors
      if (err.code === "ECONNABORTED" || err.message === "Network Error") {
        setErrorMessage(
          "Network error. Please check your internet connection and try again."
        );
        return;
      }

      // Handle backend validation errors
      const backendError =
        err.response?.data?.error?.detail || err.response?.data?.error;

      if (backendError) {
        // Check if it's a field-specific error object
        if (typeof backendError === "object" && !Array.isArray(backendError)) {
          // Example: { "email": ["This field is required."], "password": [...] }
          const errorMessages = Object.entries(backendError)
            .map(([field, messages]) => {
              const msgArray = Array.isArray(messages) ? messages : [messages];
              return `${field}: ${msgArray.join(", ")}`;
            })
            .join("\n");

          setErrorMessage(errorMessages);
        } else if (typeof backendError === "string") {
          setErrorMessage(backendError);
        } else {
          setErrorMessage("Invalid email or password. Please try again.");
        }
      } else {
        setErrorMessage(
          "An unexpected error occurred. Please try again later."
        );
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
            flexGrow: 1,
            justifyContent: "space-between",
          }}
          className="flex-1 px-4 py-8"
          keyboardShouldPersistTaps="handled"
        >
          <View>
            <SignupHeader label="Welcome back!" step={1} progress="20%" />

            {/* Error Message */}
            {errorMessage && (
              <View className="px-4 py-3 mb-4 bg-red-100 border border-red-400 rounded-lg">
                <Text className="text-red-700 font-medium">{errorMessage}</Text>
              </View>
            )}

            {/* Success Message */}
            {successMessage && (
              <View className="px-4 py-3 mb-4 bg-green-100 border border-green-400 rounded-lg">
                <Text className="text-green-700 font-medium">
                  {successMessage}
                </Text>
              </View>
            )}

            <Input
              name="email"
              control={control}
              secure={false}
              keyboardType="email-address"
              label="Email"
              placeholder="Your email address"
              disable={isLoading}
            />

            <PasswordInput
              name="password"
              control={control}
              keyboardType="default"
              label="Password"
              placeholder="Your password"
              disable={isLoading}
            />

            <View className="mt-4 mb-4 flex-row justify-end">
              <Link href={"/(auth)/forget-password"} asChild>
                <TouchableOpacity disabled={isLoading}>
                  <Text className="text-primary font-bold">
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          <View>
            <View className="mt-2">
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
                className={`rounded-xl ${
                  isLoading ? "bg-orange-200" : "bg-primary"
                } flex flex-row items-center py-4 justify-center gap-2`}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-white text-xl font-bold">Login</Text>
                )}
              </TouchableOpacity>

              <View className="flex-row items-center justify-center px-4 mt-4 mb-2">
                <Text className="text-center font-bold text-base text-gray-700">
                  Don&apos;t have an account?{" "}
                </Text>
                <Link href={"/(auth)/signup"} asChild>
                  <TouchableOpacity disabled={isLoading}>
                    <Text className="text-primary font-bold text-pretty underline text-base">
                      Signup
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
