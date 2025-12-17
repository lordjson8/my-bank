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

export default function EmailSignup() {
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
          justifyContent: "space-between",
          flexGrow: 1,
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
          <CountrySelect control={control} name="phoneNumber" />
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
        </View>
        <View>
          <View className="flex-row items-center gap-3">
            <Checkbox
              color={"#F97316"}
              //   onValueChange={() => setBiometric(!biometric)}
              //   value={biometric}
            />
            <View className="flex-1">
              <Text className="flex-1 text-muted-foreground text-pretty text-base">
                J&apos;ai lu et compris les{" "}
                <TextBold label="conditions générales" />
                et la <TextBold label="politique" /> de
                <TextBold label="confidentialité" /> de Quick Finance.
              </Text>
            </View>
          </View>
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
              <Link href={"/(auth)/login"} asChild>
                  <TouchableOpacity>
                    <Text className="text-primary font-bold text-pretty underline text-base">
                      Login
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
