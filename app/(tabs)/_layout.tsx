import Header from "@/components/dashboard/header";
import { HapticTab } from "@/components/haptic-tab";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Clock8, LucideIcon, Send, Settings } from "lucide-react-native";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useEffect } from "react";

const TabIcon = ({
  color,
  Icon,
  focused,
}: {
  color: string;
  Icon: LucideIcon;
  focused: boolean;
}) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.18 : 1, {
      damping: 12,
      stiffness: 220,
    });
  }, [focused]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View className="items-center">
      {focused && (
        <View
          style={{ backgroundColor: color }}
          className="h-0.5 w-10 absolute -top-3 rounded-full"
        />
      )}
      <Animated.View style={animStyle}>
        <Icon size={26} color={color} />
      </Animated.View>
    </View>
  );
};

export default function TabLayout() {
  return (
    <>
      <SafeAreaView edges={["top"]} className="bg-primary" />
      <StatusBar style="light" />
      <View className="flex-1">
        <Header />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: "#F97316",
              animation: "shift",
              tabBarHideOnKeyboard: true,
              tabBarStyle: {
                elevation: 0,
                shadowOpacity: 0,
                height: 60,
              },
              tabBarButton: HapticTab,
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: "Transférer",
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon color={color} focused={focused} Icon={Send} />
                ),
              }}
            />
            <Tabs.Screen
              name="transfer-results"
              options={{
                title: "Historique",
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon color={color} focused={focused} Icon={Clock8} />
                ),
              }}
            />
            <Tabs.Screen
              name="settings"
              options={{
                title: "Paramètres",
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon color={color} focused={focused} Icon={Settings} />
                ),
              }}
            />
            <Tabs.Screen name="update-profile" options={{ href: null }} />
            <Tabs.Screen name="cards" options={{ href: null }} />
            <Tabs.Screen name="dashboard" options={{ href: null }} />
          </Tabs>
        </KeyboardAvoidingView>
      </View>
      <SafeAreaView edges={["bottom"]} className="bg-background" />
    </>
  );
}
