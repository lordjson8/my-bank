import { Stack, Tabs } from "expo-router";
import React from "react";
import { HapticTab } from "@/components/haptic-tab";
import {
  CreditCard,
  DollarSign,
  Home,
  LucideIcon,
  Plus,
  Send,
} from "lucide-react-native";
import { ScrollView, Text ,View } from "react-native";
import Header from "@/components/dashboard/header";
import { SafeAreaView } from "react-native-safe-area-context";

const TabIcon = ({
  Icon,
  color,
  name,
  focused,
}: {
  Icon: LucideIcon;
  color: string;
  name: string;
  focused: boolean;
}) => {
  return (
    <View className="flex w-fit justify-center items-center gap-2 ">
      <Icon
        // resizeMode='contain'
        color={color}
        size={24}
      />
      <Text
        style={{ color: color }}
        className={`text-xs w-fit  text-pretty`}
      >
        {name}
      </Text>
    </View>
  );
};

const MainTabIcon = ({
  Icon,
  focused,
}: {
  Icon: LucideIcon;
  focused: boolean;
}) => {
  return (
    <View className=" justify-center items-center gap-2 rounded-full bg-primary w-14 h-14 -top-4 shadow shadow-gray-400   ">
      <Icon
        className="resize-x"
        // resizeMode='contain'
        color="#fff"
        size={24}
      />
    </View>
  );
};

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#F97316",
          tabBarInactiveTintColor: "#000",
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#fff",
            borderWidth: 3,
            margin: 2,
            borderColor: "#E2E8F0",
            height: 84,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          },
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name="Accueil"
                Icon={Home}
                focused={focused}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="transfer"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name="Virement"
                Icon={Send}
                focused={focused}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="add"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <MainTabIcon Icon={Plus} focused={focused} />
            ),
          }}
        />

        <Tabs.Screen
          name="cards"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name="Carte"
                Icon={CreditCard}
                focused={focused}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="bills"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name="Facture"
                Icon={DollarSign}
                focused={focused}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
