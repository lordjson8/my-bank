import { View, Text, Touchable, TouchableOpacity } from "react-native";
import { CircleAlert } from "lucide-react-native";
import { useAuthStore } from "@/store/authStore";
import { ExternalPathString, Link, RelativePathString } from "expo-router";

// Completez votre profil Mettre a jour

const Warning = ({
  message,
  link,
  linkLabel,
}: {
  message: string;
  link: any;
  linkLabel: string;
}) => {
  return (
    <View className="flex-row items-between gap-3 px-3">
      <View className="flex-row flex-1 justify-between">
        <View className="flex-row gap-1">
          <CircleAlert size={20} color={"#CA8A04"} />
          <Text className="text-[#854D0E] font-bold">{message}</Text>
        </View>

        <Link href={link} asChild>
          <TouchableOpacity>
            <Text className="text-[#854D0E] underline font-bold">
              {linkLabel}
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export const WarningBanner = () => {
  const { user } = useAuthStore();
  return (
    <View className="bg-[#FEFCE8] w-full border-l-4 border-[#FACC15] mx-1 py-3">
      {!user?.has_kyc_profile ? (
        <Warning
          message="Votre profil KYC est incomplet."
          link="/(kyc)/update-profile"
          linkLabel="Mettre à jour"
        />
      ) : null}
    </View>
  );
};
