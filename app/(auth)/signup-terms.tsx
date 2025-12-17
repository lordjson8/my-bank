import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupTermsSchema, SignupTermsType } from "@/utils/zod-schemas";
import SignupHeader from "@/components/auth/signup-header";
import { Checkbox } from "expo-checkbox";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

export default function SignupTermsScreen() {
  const { email } = useLocalSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupTermsType>({
    resolver: zodResolver(SignupTermsSchema),
    mode: "onChange",
    defaultValues: {
      agreeToTerms: false,
      agreeToPrivacy: false,
      agreeToMarketing: false,
    },
  });

  const onSubmit = async (data: SignupTermsType) => {
    try {
      setIsLoading(true);
      // TODO: Call backend to complete registration with all collected data
      // const response = await completeSignup({
      //   email,
      //   ...allPreviousFormData,
      //   ...data
      // });

      console.log("Terms accepted:", data);

      // Navigate to success screen
      router.push({
        pathname: "/(auth)/signup-success",
        params: { email: email },
      });
    } catch (error) {
      console.error("Terms submission error:", error);
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
            label="Review and agree"
            step={6}
            progress="96%"
          />

          <View className="mt-8 px-3">
            <Text className="text-gray-700 text-base font-medium mb-6">
              Please review and accept our policies to complete your signup
            </Text>

            {/* Terms and Conditions Checkbox */}
            <View className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Controller
                control={control}
                name="agreeToTerms"
                render={({ field: { onChange, value } }) => (
                  <View>
                    <View className="flex-row items-flex-start gap-3">
                      <Checkbox
                        color={"#F97316"}
                        value={value}
                        onValueChange={onChange}
                        disabled={isLoading}
                      />
                      <View className="flex-1">
                        <Text className="text-gray-900 text-sm font-medium leading-5">
                          I agree to the{" "}
                          <Text className="font-bold text-orange-600">
                            Terms and Conditions
                          </Text>
                        </Text>
                        <Text className="text-gray-500 text-xs mt-1">
                          Read our full terms at www.mybank.com/terms
                        </Text>
                      </View>
                    </View>
                    {errors.agreeToTerms && (
                      <Text className="text-red-500 text-xs mt-2 font-medium ml-8">
                        {errors.agreeToTerms.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            {/* Privacy Policy Checkbox */}
            <View className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Controller
                control={control}
                name="agreeToPrivacy"
                render={({ field: { onChange, value } }) => (
                  <View>
                    <View className="flex-row items-flex-start gap-3">
                      <Checkbox
                        color={"#F97316"}
                        value={value}
                        onValueChange={onChange}
                        disabled={isLoading}
                      />
                      <View className="flex-1">
                        <Text className="text-gray-900 text-sm font-medium leading-5">
                          I agree to the{" "}
                          <Text className="font-bold text-orange-600">
                            Privacy Policy
                          </Text>
                        </Text>
                        <Text className="text-gray-500 text-xs mt-1">
                          Read our privacy policy at www.mybank.com/privacy
                        </Text>
                      </View>
                    </View>
                    {errors.agreeToPrivacy && (
                      <Text className="text-red-500 text-xs mt-2 font-medium ml-8">
                        {errors.agreeToPrivacy.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            {/* Marketing Checkbox (Optional) */}
            <View className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Controller
                control={control}
                name="agreeToMarketing"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row items-flex-start gap-3">
                    <Checkbox
                      color={"#F97316"}
                      value={value}
                      onValueChange={onChange}
                      disabled={isLoading}
                    />
                    <View className="flex-1">
                      <Text className="text-gray-900 text-sm font-medium leading-5">
                        Send me updates and offers (Optional)
                      </Text>
                      <Text className="text-gray-500 text-xs mt-1">
                        We'll send you monthly updates on new features and exclusive offers
                      </Text>
                    </View>
                  </View>
                )}
              />
            </View>
          </View>
        </View>

        {/* Create Account Button */}
        <View className="mb-12">
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || isLoading}
            className={`rounded-xl flex flex-row items-center py-4 justify-center gap-2 ${
              !isValid || isLoading
                ? "bg-gray-300"
                : "bg-green-600 active:bg-green-700"
            }`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text className="text-white text-lg font-semibold">
                Create Account
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
