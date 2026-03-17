import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";
import { general_features, GeneralFeature } from "@/constants";
import { ChevronDown, ChevronRight, LogOut, Monitor, Moon, Palette, Sun } from "lucide-react-native";
import { Link, router } from "expo-router";
import { store } from "@/store/authStore";
import { useThemeStore, ThemePreference } from "@/store/themeStore";

// ─── Theme Selector ───────────────────────────────────────────────────────────

const THEME_OPTIONS: { value: ThemePreference; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Clair", Icon: Sun },
  { value: "dark", label: "Sombre", Icon: Moon },
  { value: "system", label: "Système", Icon: Monitor },
];

const ThemeSection = () => {
  const { preference, setTheme } = useThemeStore();

  return (
    <View className="border-b border-border px-4 py-4">
      <View className="flex-row items-center gap-2 mb-3">
        <Palette color="#F97316" size={20} />
        <Text className="text-lg font-[500] text-foreground">Thème</Text>
      </View>
      <View className="flex-row gap-2">
        {THEME_OPTIONS.map(({ value, label, Icon }) => {
          const isSelected = preference === value;
          return (
            <TouchableOpacity
              key={value}
              onPress={() => setTheme(value)}
              className={`flex-1 flex-row gap-1.5 items-center justify-center py-3 rounded-xl border-2 ${
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card"
              }`}
            >
              <Icon
                size={15}
                color={isSelected ? "#F97316" : "#9CA3AF"}
              />
              <Text
                className={`text-sm font-medium ${
                  isSelected ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// ─── Settings Option ──────────────────────────────────────────────────────────

const Option = ({ el }: { el: GeneralFeature }) => {
  const [collapsed, setCollapsed] = React.useState<boolean>(false);

  if (el.type === "link") {
    return (
      <Link asChild href={el.href as never} className="border-b border-border p-4">
        <TouchableOpacity
          onPress={() => setCollapsed(!collapsed)}
          className="rounded-xl items-start flex flex-row mb-2"
        >
          <el.icon color="#F97316" size={22} />
          <View className="ml-3 flex-1">
            <Text className="text-base font-[500] text-foreground">
              {el.title}
            </Text>
            <Text className="mt-1 text-muted-foreground text-sm">
              {el.description}
            </Text>
          </View>
          <ChevronRight size={22} color="#9CA3AF" />
        </TouchableOpacity>

        {el.Component && (
          <View
            className={`mb-4 ${el.Component && collapsed ? "visible" : "hidden"}`}
          >
            <el.Component />
          </View>
        )}
      </Link>
    );
  }

  return (
    <View className="border-b border-border p-4">
      <TouchableOpacity
        onPress={() => setCollapsed(!collapsed)}
        className="rounded-xl items-start flex flex-row mb-2"
      >
        <el.icon color="#F97316" size={22} />
        <View className="ml-3 flex-1">
          <Text className="text-base font-[500] text-foreground">
            {el.title}
          </Text>
          <Text className="mt-1 text-muted-foreground text-sm">
            {el.description}
          </Text>
        </View>
        {collapsed ? (
          <ChevronDown size={22} color="#9CA3AF" />
        ) : (
          <ChevronRight size={22} color="#9CA3AF" />
        )}
      </TouchableOpacity>

      {el.Component && (
        <View
          className={`mb-4 ${el.Component && collapsed ? "visible" : "hidden"}`}
        >
          <el.Component />
        </View>
      )}
    </View>
  );
};

// ─── Features List ────────────────────────────────────────────────────────────

export function Features() {
  const handleLogout = () => {
    Alert.alert("Se déconnecter", "Voulez vous quitter l'application ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Se déconnecter",
        onPress: async () => {
          await store.getState().logout();
          router.replace("/(auth)/login");
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
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      className="flex-1"
    >
      <ThemeSection />

      <View className="flex-1">
        {general_features.map((el, index) => (
          <Option key={index} el={el} />
        ))}
        <TouchableOpacity
          onPress={handleLogout}
          className="items-start p-4 flex flex-row mb-20"
        >
          <LogOut color="#EF4444" size={22} />
          <View className="ml-3 flex-1">
            <Text className="text-base font-[500] text-destructive">
              Se déconnecter
            </Text>
            <Text className="mt-1 text-muted-foreground text-sm">
              Quitter l&apos;application
            </Text>
          </View>
          <ChevronRight size={22} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  return (
    <View className="flex-1 bg-background">
      <Features />
    </View>
  );
}
