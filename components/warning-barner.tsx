
import { View, Text } from "react-native";
import { CircleAlert } from "lucide-react-native";

export const WarningBanner = () => (
  <View className="bg-[#FEFCE8] absolute w-full z-10 border-l-4 border-[#FACC15] mx-1 py-3 px-3 top-0 left-0">
    <View className="flex-row items-center gap-3">
      <CircleAlert size={20} color={"#CA8A04"} />
      <Text className="text-[#854D0E] font-bold">
        Votre compte est en cours de validation
      </Text>
    </View>
  </View>
);