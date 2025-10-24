import { useAuth } from "@/services/providers/auth-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Redirect, Slot, Tabs } from "expo-router";
import { use } from "react";
import { Text } from "react-native";

export default function TabLayout() {
  const { isLoggedIn } = useAuth();
    // if (!isLoggedIn) {
    //   return <Redirect href={'/'}/>;
    // }
  return (
      <Tabs
        screenOptions={{ tabBarActiveTintColor: "blue", headerShown: false }}
      >
        {/* <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      /> */}
        <Slot />
        <Text>ggg</Text>
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Settings",
            // tabBarBadge: 2,
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="cog" color={color} />
            ),
          }}
        />
      </Tabs>
  );
}
