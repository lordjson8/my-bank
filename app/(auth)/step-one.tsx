import { KeyboardAvoidingView, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SignupHeader from "@/components/auth/signup-header";

import Politics from "@/components/auth/politics";
import RInput from "@/components/auth/register-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SubmitButtons from "@/components/auth/submit-buttons";
import { emailSchema, emailType } from "@/utils/zod-schemas";
import BottomBorderedInput from "@/components/auth/bottom-bordered-input";
import PasswordInput from "@/components/auth/password-input";

export default function EmailSignup() {


  const {control,handleSubmit,formState : {errors, isLoading}} = useForm<emailSchema>({
    resolver: zodResolver(emailType),
  })
  const onsubmit = (data: emailSchema) => {
     
  }

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1">
      <SafeAreaView className="flex-1 p-4 bg-white">
        <ScrollView
          className="flex-1 px-4 py-8"
        >
          <SignupHeader />
          <BottomBorderedInput placeholder="Email Address" />
          <PasswordInput placeholder="Password"/>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
