import CurrentAccount from "@/components/dashboard/current-account";
import List from "@/components/dashboard/list";
import Notifications from "@/components/dashboard/notifications";
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
} from "react-native";

export default function HomeScreen() {
  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1">
      <ScrollView className="relative">
        <View className="px-4 py-6">
          <CurrentAccount />
          <Notifications />
          <List />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
