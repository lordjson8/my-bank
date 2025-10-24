import { KeyboardAvoidingView, ScrollView, Text } from "react-native";
// import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SignupHeader from "@/components/auth/signup-header";
// import Input from "@/components/auth/input";
import * as z from 'zod';

import SignupButtons from "@/components/auth/signup-buttons";
import Politics from "@/components/auth/politics";
import RInput from "@/components/auth/register-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SubmitButtons from "@/components/auth/submit-buttons";
import { emailSchema, emailType } from "@/utils/zod-schemas";
import { useAuth } from "@/services/providers/auth-context";
import { useEffect } from "react";

export default function EmailSignup() {
 
  // const [email, setEmail] = useState("");


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
          {/* <SignupHeader /> */}
          <RInput
            secure={false}
            label="Address email"
            control={control}
            name="email"
            placeholder="votre.email@exemple.com"
            keyboardType="email-address"
          />
          {errors.email && <Text className="text-red-500">{errors.email.message}</Text> }

          <SubmitButtons onPressFN={handleSubmit(onsubmit)} href="/(auth)/verify" label="Continuer" />

          <Politics />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
