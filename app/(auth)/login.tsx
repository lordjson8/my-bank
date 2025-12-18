import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SignupHeader from "@/components/auth/signup-header";
import PasswordInput from "@/components/auth/password-input";
import { Link } from "expo-router";
import { useState } from "react";
import Input from "@/components/auth/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormType, LoginSchema } from "@/utils/zod-schemas";

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

  const onSubmit = async (data: LoginFormType) => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Login Data:", data);
      // On success, you would navigate the user
    } catch (error) {
      setErrorMessage("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
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
            label="Welcome back!"
            step={1}
            progress="20%"
          />
          {errorMessage && (
            <View className="px-4 py-3 mb-4 bg-red-100 border border-red-400 rounded-lg">
              <Text className="text-red-700 font-medium">{errorMessage}</Text>
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
          {/* {errors.email && <Text className="text-red-500 mt-1">{errors.email.message}</Text>} */}

          <PasswordInput
            name="password"
            control={control}
            keyboardType="default"
            label="Password"
            placeholder="Your password"
            disable={isLoading}
          />
          {/* {errors.password && <Text className="text-red-500 mt-1">{errors.password.message}</Text>} */}
          
          <View className="mt-4 mb-4 flex-row justify-end">
            <Link href={"/(auth)/forget-password"} asChild>
              <TouchableOpacity>
                <Text className="text-primary font-bold">Forgot password?</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
        <View>
          <View className="mt-2">
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              className={`rounded-xl ${isLoading ? "bg-orange-200" : "bg-primary"} flex flex-row items-center py-4 justify-center gap-2`}
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
                <TouchableOpacity>
                  <Text className="text-primary font-bold text-pretty underline text-base">
                    Signup
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


