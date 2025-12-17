import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupEmailSchema, SignupEmailType } from "@/utils/zod-schemas";
import SignupHeader from "@/components/auth/signup-header";
import BottomBorderedInput from "@/components/auth/bottom-bordered-input";
import { Link, useRouter } from "expo-router";
import { useState } from "react";

export default function SignupEmailScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupEmailType>({
    resolver: zodResolver(SignupEmailSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: SignupEmailType) => {
    try {
      setIsLoading(true);
      // TODO: Call backend to check if email exists and send verification code
      // const response = await checkEmailAndSendCode(data.email);
      console.log("Email submitted:", data);

      // Navigate to verification step
      router.push({
        pathname: "/(auth)/signup-verify",
        params: { email: data.email },
      });
    } catch (error) {
      console.error("Email signup error:", error);
      // TODO: Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{
          display: "flex",
          justifyContent: "space-between",
          minHeight: "100%",
        }}
        className="flex-1 px-4 py-8"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <SignupHeader
            showProgress={true}
            label="Create your MB account"
            step={1}
            progress="16%"
          />

          <View className="mt-8 px-3">
            <Text className="text-gray-700 text-base font-medium mb-6">
              We'll send a verification code to your email
            </Text>

            {/* Email Input */}
            <View>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <BottomBorderedInput
                      placeholder="Enter your email"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      editable={!isLoading}
                      placeholderTextColor="#9CA3AF"
                    />
                    {errors.email && (
                      <Text className="text-red-500 text-sm mt-3 font-medium">
                        {errors.email.message}
                      </Text>
                    )}
                    {!errors.email && (
                      <Text className="text-gray-500 text-xs mt-2">
                        We'll verify this email to keep your account secure
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
          </View>
        </View>

        {/* Continue & Back Buttons */}
        <View className="space-y-3 mb-12">
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || isLoading}
            className={`rounded-xl flex flex-row items-center py-4 justify-center gap-2 ${
              !isValid || isLoading
                ? "bg-gray-300"
                : "bg-orange-500 active:bg-orange-600"
            }`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text className="text-white text-lg font-semibold">Continue</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center items-center">
            <Text className="text-gray-600 text-sm">Already have an account? </Text>
            <Link href={"/(auth)/login"} asChild>
              <TouchableOpacity>
                <Text className="text-orange-500 font-bold text-sm">Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
