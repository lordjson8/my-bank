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
import { SignupAddressSchema, SignupAddressType } from "@/utils/zod-schemas";
import SignupHeader from "@/components/auth/signup-header";
import BottomBorderedInput from "@/components/auth/bottom-bordered-input";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

export default function SignupAddressScreen() {
  const { email } = useLocalSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupAddressType>({
    resolver: zodResolver(SignupAddressSchema),
    mode: "onChange",
    defaultValues: {
      streetAddress: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  const onSubmit = async (data: SignupAddressType) => {
    try {
      setIsLoading(true);
      console.log("Address submitted:", data);

      // Navigate to terms and conditions step
      router.push({
        pathname: "/(auth)/signup-terms",
        params: { email: email },
      });
    } catch (error) {
      console.error("Address error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fieldSpacing = "mb-6";

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
            label="What's your address?"
            step={5}
            progress="80%"
          />

          <View className="mt-8 px-3">
            {/* Street Address */}
            <View className={fieldSpacing}>
              <Controller
                control={control}
                name="streetAddress"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <BottomBorderedInput
                      placeholder="Street Address"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={!isLoading}
                      placeholderTextColor="#9CA3AF"
                    />
                    {errors.streetAddress && (
                      <Text className="text-red-500 text-sm mt-2 font-medium">
                        {errors.streetAddress.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            {/* City */}
            <View className={fieldSpacing}>
              <Controller
                control={control}
                name="city"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <BottomBorderedInput
                      placeholder="City"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={!isLoading}
                      placeholderTextColor="#9CA3AF"
                    />
                    {errors.city && (
                      <Text className="text-red-500 text-sm mt-2 font-medium">
                        {errors.city.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            {/* State/Province */}
            <View className={fieldSpacing}>
              <Controller
                control={control}
                name="state"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <BottomBorderedInput
                      placeholder="State / Province"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={!isLoading}
                      placeholderTextColor="#9CA3AF"
                    />
                    {errors.state && (
                      <Text className="text-red-500 text-sm mt-2 font-medium">
                        {errors.state.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            {/* Postal Code */}
            <View className={fieldSpacing}>
              <Controller
                control={control}
                name="postalCode"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <BottomBorderedInput
                      placeholder="Postal Code"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={!isLoading}
                      placeholderTextColor="#9CA3AF"
                    />
                    {errors.postalCode && (
                      <Text className="text-red-500 text-sm mt-2 font-medium">
                        {errors.postalCode.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            {/* Country */}
            <View className={fieldSpacing}>
              <Controller
                control={control}
                name="country"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <BottomBorderedInput
                      placeholder="Country"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={!isLoading}
                      placeholderTextColor="#9CA3AF"
                    />
                    {errors.country && (
                      <Text className="text-red-500 text-sm mt-2 font-medium">
                        {errors.country.message}
                      </Text>
                    )}
                  </View>
                )}
              />
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
