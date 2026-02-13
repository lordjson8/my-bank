import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React,
{ useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChangePasswordSchema,
  ChangePasswordType,
} from "@/utils/zod-schemas";
import { changePassword } from "@/services/user.service";
import PasswordInput from "@/components/auth/password-input";
import { router } from "expo-router";

export default function ChangeCode() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordType>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (data: ChangePasswordType) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const response = await changePassword({
        current_password: data.currentPassword,
        new_password: data.newPassword,
      });

      if (response.data?.success) {
        setSuccessMessage(
          response.data?.message || "Password changed successfully!"
        );
        reset(); // Reset form fields
        setTimeout(() => {
          router.back();
        }, 2000);
      } else {
        setErrorMessage(
          response.data?.message ||
            "Failed to change password. Please check your current password."
        );
      }
    } catch (err: any) {
      const backendError =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        err.response?.data?.message;

      if (backendError) {
        setErrorMessage(backendError);
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
        <ScrollView
          contentContainerStyle={{}}
          className="px-8 bg-white py-4 flex-1"
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 mb-8">
            <View className="mb-6">
              <Text className="text-center font-bold text-2xl">
                Account Security
              </Text>
              <Text className="text-center text-base font-[400] text-gray-500 mt-2 leading-6">
                Update your password to keep your account secure.
              </Text>
            </View>

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

            <PasswordInput
              name="currentPassword"
              control={control}
              label="Current Password"
              placeholder="Enter your current password"
              disable={isLoading}
            />
            {errors.currentPassword && (
              <Text className="text-red-500 text-sm mt-1 ml-1">
                {errors.currentPassword.message}
              </Text>
            )}

            <View className="mt-4">
              <PasswordInput
                name="newPassword"
                control={control}
                label="New Password"
                placeholder="Enter your new password"
                disable={isLoading}
              />
              {errors.newPassword && (
                <Text className="text-red-500 text-sm mt-1 ml-1">
                  {errors.newPassword.message}
                </Text>
              )}
            </View>

            <View className="mt-4">
              <PasswordInput
                name="confirmNewPassword"
                control={control}
                label="Confirm New Password"
                placeholder="Confirm your new password"
                disable={isLoading}
              />
              {errors.confirmNewPassword && (
                <Text className="text-red-500 text-sm mt-1 ml-1">
                  {errors.confirmNewPassword.message}
                </Text>
              )}
            </View>
          </View>

          <View className="mt-auto">
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
                <Text className="text-white text-xl font-bold">
                  Change Password
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
    </KeyboardAvoidingView>
  );
}
