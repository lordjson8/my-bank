import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
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
import { useEffect } from "react";

export default function EmailSignup() {


  // useEffect(() => {
  //   p.setOnboarding(false)
  //   console.log('p: ', p.onBoarding)
  // },[])
  return (
      <SafeAreaView className="flex-1 p-4  bg-white">
        <ScrollView
          contentContainerStyle={{
            display: "flex",
            flex: 1,
            justifyContent: "space-between",
          }}
          className="px-4 py-8"
        >
          <View className="">
            <SignupHeader
              label="Get started with your account!"
              step={1}
              progress="20%"
            />
            <BottomBorderedInput placeholder="Email Address" />
            <PasswordInput placeholder="Password" />
          </View>
          <View>
            <View className="flex-row items-center gap-3 mb-4">
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
            <View className="mt-4 mb-12">
              <Link href={"/(auth)/step-two"} asChild>
                <TouchableOpacity className="rounded-xl bg-primary flex flex-row items-center py-4 justify-center gap-2">
                  <Text className="text-white text-xl">Commencer</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
   );
}
