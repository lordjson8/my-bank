import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupPasswordSchema, SignupPasswordType } from "@/utils/zod-schemas";
import SignupHeader from "@/components/auth/signup-header";
import PasswordInput from "@/components/auth/password-input";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useMemo } from "react";

const PASSWORD_REQUIREMENTS = [
  { regex: /.{8,}/, label: "At least 8 characters" },
  { regex: /[a-z]/, label: "One lowercase letter" },
  { regex: /[A-Z]/, label: "One uppercase letter" },
  { regex: /\d/, label: "One number" },
  { regex: /[@$!%*?&]/, label: "One special character (@$!%*?&)" },
];

export default function SignupPasswordScreen() {
  const { email } = useLocalSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<SignupPasswordType>({
    resolver: zodResolver(SignupPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  // Check password requirements
  const requirements = useMemo(
    () =>
      PASSWORD_REQUIREMENTS.map((req) => ({
        ...req,
        met: req.regex.test(password),
      })),
    [password]
  );

  const allRequirementsMet = requirements.every((req) => req.met);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const onSubmit = async (data: SignupPasswordType) => {
    try {
      setIsLoading(true);
      // TODO: Password is validated on submit, store securely
      console.log("Password setup for:", email);

      // Navigate to personal info step
      router.push({
        pathname: "/(auth)/signup-info",
        params: { email: email },
      });
    } catch (error) {
      console.error("Password setup error:", error);
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
            label="Create a strong password"
            step={3}
            progress="48%"
          />

          <View className="mt-8 px-3">
            <Text className="text-gray-700 text-base font-medium mb-2">
              Your password will protect your account
            </Text>
            <Text className="text-gray-500 text-sm mb-6">
              Use a combination of uppercase, lowercase, numbers, and symbols
            </Text>

            {/* Password Input */}
            <View className="mb-6">
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <PasswordInput
                      placeholder="Enter password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={() => {
                        onBlur();
                        setShowRequirements(false);
                      }}
                      onFocus={() => setShowRequirements(true)}
                      editable={!isLoading}
                    />
                  </View>
                )}
              />

              {/* Password Requirements Checklist */}
              {(showRequirements || password) && (
                <View className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  {requirements.map((req, idx) => (
                    <View
                      key={idx}
                      className="flex-row items-center gap-3 mb-3 last:mb-0"
                    >
                      <View
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          req.met ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <Text className="text-white text-xs font-bold">
                          {req.met ? "✓" : ""}
                        </Text>
                      </View>
                      <Text
                        className={`text-sm ${
                          req.met
                            ? "text-green-600 font-medium"
                            : "text-gray-600"
                        }`}
                      >
                        {req.label}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {errors.password && (
                <Text className="text-red-500 text-sm mt-3 font-medium">
                  {errors.password.message}
                </Text>
              )}
            </View>

            {/* Confirm Password Input */}
            <View>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <PasswordInput
                      placeholder="Confirm password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={!isLoading}
                    />
                    {confirmPassword && !passwordsMatch && (
                      <Text className="text-red-500 text-sm mt-2 font-medium">
                        Passwords do not match
                      </Text>
                    )}
                    {confirmPassword && passwordsMatch && (
                      <Text className="text-green-600 text-sm mt-2 font-medium">
                        Passwords match ✓
                      </Text>
                    )}
                  </View>
                )}
              />

              {errors.confirmPassword && (
                <Text className="text-red-500 text-sm mt-2 font-medium">
                  {errors.confirmPassword.message}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Continue Button */}
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
              <Text className="text-white text-lg font-semibold">Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
