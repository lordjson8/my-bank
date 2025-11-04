import Header from "@/components/dashboard/header";
import { useAuth } from "@/services/providers/auth-context";
import { Tabs } from "expo-router";

import {
  Clock8,
  CreditCard,
  LayoutGrid,
  LucideIcon,
  Send,
  Settings,
} from "lucide-react-native";
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Icon = ({
  name,
  color,
  Icon,
  focused,
}: {
  name: string;
  color: string;
  Icon: LucideIcon;
  focused: boolean;
}) => {
  return (
    <View className="relative">
      {focused && (
        <View className="items-center">
          <View
            style={{
              backgroundColor: color,
            }}
            className="h-1 w-[250%] -top-2 absolute rounded-full"
          />
        </View>
      )}
      <Icon size={28} color={color} />
    </View>
  );
};

export default function TabLayout() {
  // const { isLoggedIn } = useAuth();
  // if (!isLoggedIn) {
  //   return <Redirect href={'/'}/>;
  // }
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#F97316",
          headerShown: false,
          headerTransparent: true,
          animation: "shift",
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            elevation: 0,
            shadowOpacity: 0,
            height: 60,
          },
          // tabBarShowLabel: false,
          // transitionSpec: {}
        }}
      >
        <Tabs.Screen
          name="transfer"
          options={{
            title: "Transférer",
            // tabBarBadge: 2,
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name="Transférer"
                color={color}
                focused={focused}
                Icon={Send}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: "Historique",
            // tabBarBadge: 2,
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name="Historique"
                color={color}
                focused={focused}
                Icon={Clock8}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            // tabBarBadge: 2,
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name="Paramètre"
                color={color}
                focused={focused}
                Icon={Settings}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="cards"
          options={{
            href: null,
            title: "Cards",
            // tabBarBadge: 2,
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name="transfer"
                color={color}
                focused={focused}
                Icon={CreditCard}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "More",
            // href: null,

            // tabBarBadge: 2,
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name="transfer"
                color={color}
                focused={focused}
                Icon={LayoutGrid}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
