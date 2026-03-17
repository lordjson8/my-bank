import { View, Text, TouchableOpacity } from "react-native";
import { Bell, User } from "lucide-react-native";
import { WarningBanner } from "../warning-banner";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";

export default function Header() {
  const { user } = useAuthStore();
  const router = useRouter();

  const firstName = user?.full_name?.split(" ")[0] || "Utilisateur";

  return (
    <View className="bg-primary">
      <View className="flex-row justify-between items-center px-4 py-4">
        <View>
          <Text className="text-white/70 text-sm">Bonjour 👋</Text>
          <Text className="font-bold text-lg text-white">{firstName}</Text>
        </View>

        <View className="flex-row gap-5 items-center">
          <View className="relative">
            <Bell color="#FFF" size={22} />
            <View className="bg-red-500 border-white border-2 rounded-full w-3 h-3 absolute -top-1 -right-1" />
          </View>
          <TouchableOpacity
            onPress={() => router.push("/settings/profile")}
            className="w-9 h-9 rounded-full bg-white/20 items-center justify-center"
          >
            <User color="#FFF" size={20} />
          </TouchableOpacity>
        </View>
      </View>
      <WarningBanner />
    </View>
  );
}
