import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Progress from "@/components/auth/progress";
import Message from "@/components/auth/message";
import { Link } from "expo-router";
import { ArrowRight, Mail, Phone } from "lucide-react-native";

const index = () => {
  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <ScrollView className="px-4 py-8 ">
        {/* <Progress step={1} progress={"20%"} /> */}
        <Message />
        <View className="mt-4 mb-4">
          <Link href={"/(auth)/auth-options"} asChild>
            <TouchableOpacity className="rounded-xl bg-primary flex flex-row items-center py-4 justify-center gap-2 mb-12">
              <ArrowRight color={"#fff"} size={24} />
              <Text className="text-white text-xl font-bold">Commencer</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;
