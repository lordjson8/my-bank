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
import { Link } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema, emailType } from "@/utils/zod-schemas";
import Input from "@/components/auth/input";
import { useState } from "react";

export default function ForgotPassword() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<emailType>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (data: emailType) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Forgot Password for:", data.email);
      setSuccessMessage("A password reset link has been sent to your email.");
    } catch (error) {
      setErrorMessage("Could not process request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            display: "flex",
            flexGrow: 1,
            justifyContent: "space-between",
          }}
          className="flex-1 px-4 py-8"
        >
          <View className="">
            <SignupHeader
              showProgress
              label="Forgot Password"
              step={1}
              progress="20%"
            />
            <View className="px-3">
              {errorMessage && (
                <View className="px-4 py-3 mb-4 bg-red-100 border border-red-400 rounded-lg">
                  <Text className="text-red-700 font-medium">
                    {errorMessage}
                  </Text>
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
                name="email"
                control={control}
                secure={false}
                keyboardType="email-address"
                label="Email Address"
                placeholder="Enter your email"
                disable={isLoading}
              />
              {/* {errors.email && (
              <Text className="text-red-500 mt-1">{errors.email.message}</Text>
            )} */}
              <View className="flex-row justify-center items-center mt-4 mb-4 gap-2">
                <Text className="text-muted-foreground">
                  Remember your password?
                </Text>
                <Link
                  href={"/(auth)/login"}
                  className="font-bold text-primary text-base"
                >
                  Login
                </Link>
              </View>
            </View>
          </View>
          <View className="">
            <View className="mt-4">
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
                className={`rounded-xl ${isLoading ? "bg-orange-200" : "bg-primary"} flex flex-row items-center py-4 justify-center gap-2`}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-white text-xl font-bold">Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
