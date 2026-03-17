import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Message from "@/components/auth/message";
import { ArrowRight } from "lucide-react-native";
import { useAuthStore } from "@/store/authStore";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const Index = () => {
  const { completeOnboarding } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="px-4 py-8"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
      >
        <Animated.View entering={FadeInDown.duration(500)}>
          <Message />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).duration(500)} className="mt-4 mb-8">
          <TouchableOpacity
            onPress={completeOnboarding}
            className="rounded-xl bg-primary flex flex-row items-center py-4 justify-center gap-2"
          >
            <ArrowRight color="#fff" size={24} />
            <Text className="text-white text-xl font-bold">Commencer</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
