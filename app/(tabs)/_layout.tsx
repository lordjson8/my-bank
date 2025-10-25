import Header from "@/components/dashboard/header";
import { useAuth } from "@/services/providers/auth-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Redirect, Slot, Tabs,  } from "expo-router";
import { TabSlot } from "expo-router/ui";
import {
  ChartNoAxesColumnIncreasing,
  CreditCard,
  Home,
  LayoutGrid,
  LucideIcon,
  Send,
} from "lucide-react-native";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Icon = ({
  name,
  color,
  Icon,
  focused,
}: {
  name?: string;
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
  const { isLoggedIn } = useAuth();
  // if (!isLoggedIn) {
  //   return <Redirect href={'/'}/>;
  // }
  return (
    <SafeAreaView className="flex-1 bg-white relative">
    <Header />
     <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#F97316",
        headerShown: false,
        headerTransparent: true,
        // transitionSpec: {}
      }}
    >
     <Header />
  <TabSlot />

      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Settings",
          // tabBarBadge: 2,
          tabBarIcon: ({ color, focused }) => (
            <Icon color={color} focused={focused} Icon={Home} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Send",
          // tabBarBadge: 2,
          tabBarIcon: ({ color, focused }) => (
            <Icon color={color} focused={focused} Icon={Send} />
          ),
        }}
      />

      <Tabs.Screen
        name="bills"
        options={{
          title: "Invest",
          // tabBarBadge: 2,
          tabBarIcon: ({ color, focused }) => (
            <Icon
              color={color}
              focused={focused}
              Icon={ChartNoAxesColumnIncreasing}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="cards"
        options={{
          title: "Cards",
          // tabBarBadge: 2,
          tabBarIcon: ({ color, focused }) => (
            <Icon color={color} focused={focused} Icon={CreditCard} />
          ),
        }}
      />
      <Tabs.Screen
        name="transfer"
        options={{
          title: "More",
          // tabBarBadge: 2,
          tabBarIcon: ({ color, focused }) => (
            <Icon color={color} focused={focused} Icon={LayoutGrid} />
          ),
        }}
      />
    </Tabs>
    </SafeAreaView>
   
  );
}
