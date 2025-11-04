import Accounts from "@/components/dashboard/accounts";
import CurrentAccount from "@/components/dashboard/current-account";
import Header from "@/components/dashboard/header";
import List from "@/components/dashboard/list";
import Notifications from "@/components/dashboard/notifications";
import { Tabs } from "expo-router";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <KeyboardAvoidingView behavior="padding" className='flex-1'>
      <View className="bg-gray-50 ">
        {/* <View className="fixed top-0 left-0 z-50 w-screen">
           <Header /> 
        </View> */}
        {/* <Tabs.Screen options={{
          tabBarBadge : 4
        }}/> */}
        <ScrollView className="relative">
          <View className="px-4 py-6">
            <CurrentAccount />
            {/* <Accounts /> */}
            <Notifications />
            <List />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
