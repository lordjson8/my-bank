import SkeletonLoading from "expo-skeleton-loading";
import Accounts from "@/components/dashboard/accounts";
import CurrentAccount from "@/components/dashboard/current-account";
import Header from "@/components/dashboard/header";
import List from "@/components/dashboard/list";
import Notifications from "@/components/dashboard/notifications";
import { Tabs } from "expo-router";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Loader2Icon } from "lucide-react-native";

export default function HomeScreen() {
  const [localChecked, setLocalChecked] = React.useState(false);

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1">
      <ScrollView className="relative">
        <View className="px-4 py-6">
          <CurrentAccount />
          <Notifications />
          <List />
        </View>

        <View className="justify-evenly  gap-2  mb-5 flex-row">
          <BouncyCheckbox
            // className="flex-1 items-center justify-center bg-red-500"
            onPress={(isChecked: boolean) => {}}
          />

          <BouncyCheckbox
            size={25}
            fillColor="red"
            // className="flex-1 items-center justify-center bg-red-500"
            unFillColor="#FFFFFF"
            text="Custom Checkbox"
            disableText={false}
            iconStyle={{ borderColor: "red" }}
            innerIconStyle={{ borderWidth: 2 }}
            textStyle={{ fontFamily: "JosefinSans-Regular" }}
            onPress={(isChecked: boolean) => {
              console.log(isChecked);
            }}
          />

          <BouncyCheckbox
            isChecked={localChecked}
            disableText
            fillColor="green"
            size={50}
            useBuiltInState={false}
            iconStyle={{ borderColor: "green" }}
            onPress={(checked: boolean) => {
              console.log("::Checked::", checked);
              console.log("::LocalChecked::", localChecked);
              setLocalChecked(!localChecked);
            }}
          />

          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
