import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { general_features, GeneralFeature } from "@/constants";
import { ChevronDown, ChevronRight, LogOut } from "lucide-react-native";
import { Link, router } from "expo-router";
import { store } from "@/store/authStore";

export default function SettingsScreen() {
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

const Option = ({ el }: { el: GeneralFeature }) => {
  const [collapsed, setCollapsed] = React.useState<boolean>(false);
  if (el.type === "link") {
    return (
      <Link
        asChild
        href={el.href}
        className="border-b flex border-border p-4 flex-1"
      >
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
    <View className="border-b flex border-border p-4 flex-1">
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
  const handleLogout = () => {
    Alert.alert("Se déconnecter", "Voulez vous quitter l'application ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Se déconnecter",
        onPress: async () => {
          await store.getState().logout();
          router.replace('/(auth)/login');
          
          Alert.alert(
            "Déconnexion réussie",
            "Vous avez été déconnecté avec succès."
          );
        },
      },
    ]);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      className="px-4 py-6 flex-1"
    >
      <View className="flex-1">
        {general_features.map((el, index) => {
          return <Option key={index} el={el} />;
        })}
        <TouchableOpacity
          onPress={handleLogout}
          className="rounded-xl items-start p-4 flex flex-row  mb-20"
        >
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
