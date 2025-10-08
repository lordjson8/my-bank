import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Progress from "@/components/auth/progress";
import Message from "@/components/auth/message";
import { Link } from "expo-router";
import { Mail, Phone } from "lucide-react-native";

const index = () => {
  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <ScrollView className="px-4 py-8">
        <Progress step={1} progress={"20%"} />
        <Message />
        <View className="mt-4 mb-4">
          <Link href={"/(auth)/signup-email"} asChild>
            <TouchableOpacity className="rounded-xl bg-primary flex flex-row items-center py-4 justify-center gap-2">
              <Mail color={"#fff"} size={24} />
              <Text className="text-white text-base">S&apos;inscrire avec un email</Text>
            </TouchableOpacity>
          </Link>

           <Link href={"/(auth)/signup-phone"} asChild>
            <TouchableOpacity className="rounded-xl mt-4 mb-4 border border-border flex flex-row items-center py-4 justify-center gap-2">
              <Phone color={"#F97316"} size={24} />
              <Text className=" text-base">S&apos;inscrire avec un numéro de téléphone</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;
