import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupInfoSchema, SignupInfoType } from "@/utils/zod-schemas";
import SignupHeader from "@/components/auth/signup-header";
import BottomBorderedInput from "@/components/auth/bottom-bordered-input";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function SignupInfoScreen() {
  const { email } = useLocalSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<SignupInfoType>({
    resolver: zodResolver(SignupInfoSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      dateOfBirth: "",
    },
  });

  const dateOfBirth = watch("dateOfBirth");

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setValue("dateOfBirth", formattedDate);
    }
  };

  const onSubmit = async (data: SignupInfoType) => {
    try {
      setIsLoading(true);
      console.log("Personal info submitted:", data);

      // Navigate to address step
      router.push({
        pathname: "/(auth)/signup-address",
        params: { email: email },
      });
    } catch (error) {
      console.error("Personal info error:", error);
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
            label="Tell us about yourself"
            step={4}
            progress="64%"
          />

          <View className="mt-8 px-3 space-y-6">
            {/* First Name */}
            <View>
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <BottomBorderedInput
                      placeholder="First Name"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={!isLoading}
                      placeholderTextColor="#9CA3AF"
                    />
                    {errors.firstName && (
                      <Text className="text-red-500 text-sm mt-2 font-medium">
                        {errors.firstName.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            {/* Last Name */}
            <View>
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <BottomBorderedInput
                      placeholder="Last Name"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={!isLoading}
                      placeholderTextColor="#9CA3AF"
                    />
                    {errors.lastName && (
                      <Text className="text-red-500 text-sm mt-2 font-medium">
                        {errors.lastName.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            {/* Phone Number */}
            <View>
              <Controller
                control={control}
                name="phoneNumber"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <BottomBorderedInput
                      placeholder="Phone Number (e.g., +1234567890)"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="phone-pad"
                      editable={!isLoading}
                      placeholderTextColor="#9CA3AF"
                    />
                    {errors.phoneNumber && (
                      <Text className="text-red-500 text-sm mt-2 font-medium">
                        {errors.phoneNumber.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            {/* Date of Birth */}
            <View>
              <Controller
                control={control}
                name="dateOfBirth"
                render={({ field: { value } }) => (
                  <View>
                    <TouchableOpacity
                      onPress={() => setShowDatePicker(true)}
                      disabled={isLoading}
                      className="py-3 px-1 border-b-2 border-gray-300"
                    >
                      <Text
                        className={`text-base ${
                          value
                            ? "text-gray-900 font-medium"
                            : "text-gray-400"
                        }`}
                      >
                        {value ? value : "Select Date of Birth (YYYY-MM-DD)"}
                      </Text>
                    </TouchableOpacity>
                    {errors.dateOfBirth && (
                      <Text className="text-red-500 text-sm mt-2 font-medium">
                        {errors.dateOfBirth.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {showDatePicker && (
                <DateTimePicker
                  value={dateOfBirth ? new Date(dateOfBirth) : new Date(2000, 0, 1)}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
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
