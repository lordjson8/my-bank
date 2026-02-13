import Header from "@/components/dashboard/header";
import { HapticTab } from "@/components/haptic-tab";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";

import {
  Clock8,
  CreditCard,
  LayoutGrid,
  LucideIcon,
  Send,
  Settings,
} from "lucide-react-native";
import { KeyboardAvoidingView, View, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const TabIcon = ({
  color,
  Icon,
  focused,
  text
}: {
  color: string;
  Icon: LucideIcon;
  focused: boolean;
  text?: string;
}) => {
  return (
    <View className="relative">
      {focused && (
        <View className="items-center">
          <View
            style={{ backgroundColor: color }}
            className="h-1 w-[250%] -top-2 absolute rounded-full"
          />
        </View>
      )}
      <Icon size={28} color={color} />
      
    </View>
  );
};

export default function TabLayout() {
  return (
    <>
      <SafeAreaView edges={["top"]} className="bg-primary" />
      <StatusBar style="light" />

      <GestureHandlerRootView className="flex-1">
        <KeyboardAvoidingView behavior="padding" className="flex-1">
          <Header />

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
              name="add"
              options={{
                
                title: "Historique",
                tabBarIcon: ({ color, focused,  }) => (
                  <TabIcon color={color} focused={focused} Icon={Clock8} text="Historique" />
                ),
              }}
            />

            <Tabs.Screen
              name="settings"
              options={{
                title: "Settings",
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon color={color} focused={focused} Icon={Settings} />
                ),
              }}
            />

            <Tabs.Screen
              name="update-profile"
              options={{
                href: null,
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon color={color} focused={focused} Icon={Settings} />
                ),
              }}
            />

            <Tabs.Screen
              name="cards"
              options={{
                href: null,
                title: "Cards",
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon color={color} focused={focused} Icon={CreditCard} />
                ),
              }}
            />
            <Tabs.Screen
              name="dashboard"
              options={{
                title: "More",
                href: null,
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon color={color} focused={focused} Icon={LayoutGrid} />
                ),
              }}
            />
          </Tabs>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
      <SafeAreaView edges={["bottom"]} className="bg-primary" />
    </>
  );
}
