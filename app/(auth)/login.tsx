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


