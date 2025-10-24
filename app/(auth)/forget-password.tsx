import { ScrollView, Text, TouchableOpacity, View } from "react-native";
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

export default function EmailSignup() {
  return (
    <SafeAreaView className="flex-1 p-4  bg-white">
      <ScrollView
        contentContainerStyle={{
          display: "flex",
          justifyContent: "space-between",
          minHeight: "100%",
        }}
        className="flex-1 px-4 py-8"
      >
        <View className="">
          <SignupHeader
            showProgress={false}
            label="Forgot Password"
            step={1}
            progress="20%"
          />
          <View className="px-3">
            <BottomBorderedInput placeholder="Email Address" />
            <View className="flex-row justify-center items-center mt-4 mb-4 gap-2">
                <Text className="text-muted-foreground">Remember your password</Text>
                <Link href={'/(auth)/login'} className="font-bold  text-muted-foreground text-pretty text-base">
                  Click here?
                </Link> 
            </View>
          </View>
        </View>
        <View className="">
          <View className="mt-4 mb-12">
            <Link href={"/(auth)/step-two"} asChild>
              <TouchableOpacity className="rounded-xl bg-primary flex flex-row items-center py-4 justify-center gap-2">
                <Text className="text-white text-xl">Next</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
