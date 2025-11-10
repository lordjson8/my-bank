import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { general_features } from "@/constants";
import { ChevronDown, ChevronRight, LogOut } from "lucide-react-native";
import { TextInput } from "react-native";
import { Link } from "expo-router";

export default function index() {
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      className="flex-1 bg-white"
    >
      <Features />
    </ScrollView>
  );
}

const Option = ({ el }: { el: any }) => {
  const [collapsed, setCollapsed] = React.useState<boolean>(false);
  if (el.type === "link") {
    return (
      <Link asChild href={el.href} className="border-b flex border-border p-4">
        <TouchableOpacity
          onPress={() => setCollapsed(!collapsed)}
          className="rounded-xl items-start  flex flex-row  mb-2 "
        >
          <el.icon color={"#F97316"} />
          <View className="ml-3 flex-1">
            <Text className="text-lg font-[500]">{el.title}</Text>
            <Text className="mt-2 text-muted-foreground  text-sm ">
              {el.description}
            </Text>
          </View>

          <ChevronRight size={24} color={"#64748B"} />
        </TouchableOpacity>

        {el.Component && (
          <View
            className={`mb-4  ${el.Component && collapsed ? "visible" : "hidden"}`}
          >
            <el.Component />
          </View>
        )}
      </Link>
    );
  }
  return (
    <View className="border-b flex border-border p-4">
      <TouchableOpacity
        onPress={() => setCollapsed(!collapsed)}
        className="rounded-xl items-start  flex flex-row  mb-2 "
      >
        <el.icon color={"#F97316"} />
        <View className="ml-3 flex-1">
          <Text className="text-lg font-[500]">{el.title}</Text>
          <Text className="mt-2 text-muted-foreground  text-sm ">
            {el.description}
          </Text>
        </View>
        {collapsed ? (
          <ChevronDown />
        ) : (
          <ChevronRight size={24} color={"#64748B"} />
        )}
      </TouchableOpacity>

      {el.Component && (
        <View
          className={`mb-4  ${el.Component && collapsed ? "visible" : "hidden"}`}
        >
          <el.Component />
        </View>
      )}
    </View>
  );
};

export function Features() {
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      className="px-4 py-6"
    >
      <View className="flex-1">
        {general_features.map((el, index) => {
          return <Option key={index} el={el} />;
        })}
        <TouchableOpacity className="rounded-xl items-start p-4 flex flex-row  mb-20">
          <LogOut color={"#EF4444"} />
          <View className="ml-3 flex-1">
            <Text className="text-lg font-[500] text-[#EF4444]">
              Se déconnecter
            </Text>
            <Text className="mt-2 text-muted-foreground  text-sm ">
              Quitter l&apos;application
            </Text>
          </View>
          <ChevronRight size={24} color={"#64748B"} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
