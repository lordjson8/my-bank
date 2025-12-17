import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SignupHeader from "@/components/auth/signup-header";
import { RefreshCcw } from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function SignupVerifyScreen() {
  const { email } = useLocalSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  const { control, handleSubmit, formState: { errors, isValid }, setValue, watch } = useForm<SignupVerifyType>({
    resolver: zodResolver(SignupVerifySchema),
    mode: "onChange",
    defaultValues: {
      code: "",
    },
  });

  const codeValue = watch("code");

  // Auto-focus next input when digit is entered
  useEffect(() => {
    if (codeValue.length > 0) {
      const nextIndex = Math.min(codeValue.length, inputRefs.length - 1);
      if (inputRefs[nextIndex]?.current) {
        inputRefs[nextIndex].current?.focus();
      }
    }
  }, [codeValue]);

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleDigitChange = (index: number, value: string) => {
    const sanitized = value.replace(/[^0-9]/g, "");
    if (sanitized.length <= 1) {
      const currentCode = codeValue;
      const newCode = currentCode.substring(0, index) + sanitized + currentCode.substring(index + 1);
      setValue("code", newCode);

      if (sanitized && index < inputRefs.length - 1) {
        setTimeout(() => inputRefs[index + 1]?.current?.focus(), 50);
      }
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === "Backspace" && !codeValue[index] && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    }
  };

  const onSubmit = async (data: SignupVerifyType) => {
    try {
      setIsLoading(true);
      // TODO: Call backend to verify OTP
      // const response = await verifyOTP(email, data.code);
      console.log("OTP submitted:", data.code, "for email:", email);

      // Navigate to password setup
      router.push({
        pathname: "/(auth)/signup-password",
        params: { email: email },
      });
    } catch (error) {
      console.error("Verification error:", error);
      // TODO: Show error toast and allow retry
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsLoading(true);
      // TODO: Call backend to resend OTP
      // await resendOTP(email);
      console.log("Resending OTP to:", email);
      setResendTimer(60); // 60 second cooldown
    } catch (error) {
      console.error("Resend error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
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
              label="Verify your email"
              step={2}
              progress="32%"
            />

            <View className="mt-8 px-3">
              <Text className="text-gray-700 text-base font-medium mb-2">
                We sent a 6-digit code to
              </Text>
              <Text className="text-gray-900 text-base font-bold mb-8">
                {email}
              </Text>

              <Text className="text-gray-600 text-sm mb-6">
                Enter the code below to verify your email address.
              </Text>

              {/* OTP Input Fields */}
              <Controller
                control={control}
                name="code"
                render={({ field: { value } }) => (
                  <View>
                    <View className="flex-row gap-3 justify-center mb-6">
                      {inputRefs.map((ref, index) => (
                        <TextInput
                          key={index}
                          ref={ref}
                          value={value[index] || ""}
                          onChangeText={(text) => handleDigitChange(index, text)}
                          onKeyPress={(e) => handleKeyPress(index, e.nativeEvent.key)}
                          keyboardType="numeric"
                          maxLength={1}
                          editable={!isLoading}
                          className="w-14 h-14 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold text-gray-900"
                          placeholderTextColor="#D1D5DB"
                          placeholder="0"
                        />
                      ))}
                    </View>

                    {errors.code && (
                      <Text className="text-red-500 text-sm text-center font-medium mb-4">
                        {errors.code.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {/* Resend Code Button */}
              <TouchableOpacity
                onPress={handleResend}
                disabled={resendTimer > 0 || isLoading}
                className="flex-row gap-2 items-center justify-center py-3"
              >
                <RefreshCcw size={16} color={resendTimer > 0 ? "#D1D5DB" : "#F97316"} />
                <Text
                  className={`text-sm font-semibold ${
                    resendTimer > 0 ? "text-gray-400" : "text-orange-500"
                  }`}
                >
                  {resendTimer > 0
                    ? `Resend code in ${resendTimer}s`
                    : "Didn't receive code? Resend"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Verify Button */}
          <View className="mb-12">
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
                <Text className="text-white text-lg font-semibold">Verify</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
