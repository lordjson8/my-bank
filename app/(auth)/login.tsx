import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SignupHeader from "@/components/auth/signup-header";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { emailSchema, emailType } from "@/utils/zod-schemas";
import BottomBorderedInput from "@/components/auth/bottom-bordered-input";
import PasswordInput from "@/components/auth/password-input";
import { Checkbox } from "expo-checkbox";
import { Link } from "expo-router";
import TextBold from "@/components/auth/text-bold";
import { useAuth } from "@/services/providers/auth-context";
import { useEffect, useState } from "react";
import Input from "@/components/auth/input";
import PhoneModal from "@/components/auth/phone-modal";
import { countries } from "@/constants";
import CountrySelect from "@/components/shared/CountrySelect";
import { useForm } from "react-hook-form";
import z from "zod/v3";
import { SignupFormData, SignupSchema } from "@/utils/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Login() {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
    // mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      phoneNumber: "",
    },
  });

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [modalVisible, setModalVisible] = useState(false);

  const OnSubmit = async (data: SignupFormData) => {
    // setIsSubmitting(true);
    // try {
    // await form.handleSubmit(onValid)();
    // } finally {
    // setIsSubmitting(false);
    // }
  };

  return (
    <SafeAreaView className="flex-1 p-4  bg-white">
      <PhoneModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setSelectedCountry={setSelectedCountry}
      />

      <ScrollView
        contentContainerStyle={{
          display: "flex",
          flexGrow: 1,
          justifyContent: "space-between",
          // minHeight: "100%",
        }}
        className="flex-1 px-4 py-8"
      >
        <View className="">
          <SignupHeader
            label="Get started with your account!"
            step={1}
            progress="20%"
          />
          <Input
            name="email"
            control={control}
            secure={false}
            //  error={errors[0]}
            //  value={info.lastname.value}
            keyboardType="email-address"
            //  setValue={(text: string) =>
            //    setInfo({ ...info, lastname: { value: text } })
            //  }
            label="Email"
            placeholder="Votre address email"
          />
          <PasswordInput
            name="password"
            control={control}
            //  error={errors[0]}
            //  value={info.lastname.value}
            keyboardType="default"
            //  setValue={(text: string) =>
            //    setInfo({ ...info, lastname: { value: text } })
            //  }
            label="Mot de passe"
            placeholder="Votre mot de passe"
          />
          <View className="mt-2 mb-4 flex-row justify-end">
            <Link href={"/(auth)/forget-password"} asChild>
            <TouchableOpacity className="">
                <Text className="text-primary font-bold">Mot de pass oublier ?</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
        <View>
        
          <View className="mt-2">
            <Link href={"/(auth)/step-two"} asChild>
              <TouchableOpacity className="rounded-xl bg-primary flex flex-row items-center py-4 justify-center gap-2">
                <Text className="text-white text-xl">Commencer</Text>
              </TouchableOpacity>
            </Link>
            <View className="flex-row items-center justify-center px-4 mt-4 mb-2">
              <Text className="text-center font-bold text-base text-gray-700 items-center justify-center">
                Vous avez deja un compte ?{" "}
                
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


// import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { LoginSchema, LoginFormType } from "@/utils/zod-schemas";
// import SignupHeader from "@/components/auth/signup-header";
// import BottomBorderedInput from "@/components/auth/bottom-bordered-input";
// import PasswordInput from "@/components/auth/password-input";
// import { Checkbox } from "expo-checkbox";
// import { Link, useRouter } from "expo-router";
// import { useState } from "react";

// export default function LoginScreen() {
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();

//   const {
//     control,
//     handleSubmit,
//     formState: { errors, isValid },
//     watch,
//   } = useForm<LoginFormType>({
//     resolver: zodResolver(LoginSchema),
//     mode: "onChange",
//     defaultValues: {
//       email: "",
//       password: "",
//       rememberMe: false,
//     },
//   });

//   const rememberMe = watch("rememberMe");

//   const onSubmit = async (data: LoginFormType) => {
//     try {
//       setIsLoading(true);
//       // TODO: Implement actual login API call
//       // const response = await loginUser(data.email, data.password);
//       // Store remember me preference if needed
//       // if (data.rememberMe) {
//       //   await SecureStore.setItemAsync('rememberMe', data.email);
//       // }

//       // Mock successful login - navigate to dashboard
//       console.log("Login attempt:", data);
//       // router.replace("/(tabs)");
//       router.push("/(tabs)");
//     } catch (error) {
//       console.error("Login error:", error);
//       // TODO: Show error toast/alert
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <ScrollView
//         contentContainerStyle={{
//           display: "flex",
//           justifyContent: "space-between",
//           minHeight: "100%",
//         }}
//         className="flex-1 px-4 py-8"
//         showsVerticalScrollIndicator={false}
//       >
//         <View className="">
//           <SignupHeader
//             showProgress={false}
//             label="Login to your MB account"
//             step={1}
//             progress="20%"
//           />
//           <View className="mt-8 px-3">
//             {/* Email Input */}
//             <View className="mb-6">
//               <Controller
//                 control={control}
//                 name="email"
//                 render={({ field: { onChange, onBlur, value } }) => (
//                   <View>
//                     <BottomBorderedInput
//                       placeholder="Email Address"
//                       value={value}
//                       // onChangeText={onChange}
//                       // onBlur={onBlur}
//                       keyboardType="email-address"
//                       // autoCapitalize="none"
//                       // editable={!isLoading}
//                       // placeholderTextColor="#9CA3AF"
//                     />
//                     {errors.email && (
//                       <Text className="text-red-500 text-sm mt-2 font-medium">
//                         {errors.email.message}
//                       </Text>
//                     )}
//                   </View>
//                 )}
//               />
//             </View>

//             {/* Password Input */}
//             <View className="mb-4">
//               <Controller
//                 control={control}
//                 name="password"
//                 render={({ field: { onChange, onBlur, value } }) => (
//                   <View>
//                     <PasswordInput
//                       placeholder="Password"
//                       value={value}
//                       onChangeText={onChange}
//                       onBlur={onBlur}
//                       editable={!isLoading}
//                     />
//                     {errors.password && (
//                       <Text className="text-red-500 text-sm mt-2 font-medium">
//                         {errors.password.message}
//                       </Text>
//                     )}
//                   </View>
//                 )}
//               />
//             </View>

//             {/* Remember Me & Forgot Password */}
//             <View className="flex-row justify-between items-center mt-6 mb-8 gap-4">
//               <View className="flex-1 flex-row items-center gap-2">
//                 <Controller
//                   control={control}
//                   name="rememberMe"
//                   render={({ field: { onChange, value } }) => (
//                     <Checkbox
//                       color={"#F97316"}
//                       value={value}
//                       onValueChange={onChange}
//                       disabled={isLoading}
//                     />
//                   )}
//                 />
//                 <Text className="text-gray-500 text-sm">Remember Me</Text>
//               </View>
//               <Link href={"/(auth)/forget-password"} asChild>
//                 <TouchableOpacity disabled={isLoading}>
//                   <Text className="font-semibold text-gray-700 text-sm">
//                     Forgot Password?
//                   </Text>
//                 </TouchableOpacity>
//               </Link>
//             </View>
//           </View>
//         </View>

//         {/* Login Button & Sign Up Link */}
//         <View className="">
//           <TouchableOpacity
//             onPress={handleSubmit(onSubmit)}
//             disabled={!isValid || isLoading}
//             className={`rounded-xl flex flex-row items-center py-4 justify-center gap-2 ${
//               !isValid || isLoading
//                 ? "bg-gray-300"
//                 : "bg-orange-500 active:bg-orange-600"
//             }`}
//           >
//             {isLoading ? (
//               <ActivityIndicator color="white" size="small" />
//             ) : (
//               <Text className="text-white text-lg font-semibold">Login</Text>
//             )}
//           </TouchableOpacity>

//           <View className="flex-row justify-center items-center mt-6 mb-12">
//             {/* <Text className="text-gray-600 text-sm">Don't have an account? </Text> */}
//             <Link href={"/(auth)/auth-options"} asChild>
//               <TouchableOpacity>
//                 <Text className="text-orange-500 font-bold text-sm">Sign Up</Text>
//               </TouchableOpacity>
//             </Link>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }
