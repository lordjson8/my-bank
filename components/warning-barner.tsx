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
  linkLabel: string | null;
}) => {
  return (
    <View className="flex-row items-between gap-3 px-3">
      <View className="flex-row flex-1 justify-between">
        <View className="flex-row gap-1">
          <CircleAlert size={20} color={"#CA8A04"} />
          <Text className="text-[#854D0E] font-bold">{message}</Text>
        </View>
        {link && (
          <Link href={link} asChild>
            <TouchableOpacity>
              <Text className="text-[#854D0E] underline font-bold">
                {linkLabel}
              </Text>
            </TouchableOpacity>
          </Link>
        )}
      </View>
    </View>
  );
};

export const WarningBanner = () => {
  const { user } = useAuthStore();
  return (
    <>
      {!user?.has_kyc_profile ? (
        <View className="bg-[#FEFCE8] w-full border-l-4 border-[#FACC15] mx-1 py-3">
          <Warning
            message="Votre profil KYC est incomplet."
            link="/(kyc)/update-profile"
            linkLabel="Mettre à jour"
          />
        </View>
      ) : user?.kyc_status === "under_review" ? (
        <View className="bg-[#FEFCE8] w-full border-l-4 border-[#FACC15] mx-1 py-3">
          <Warning
            message="Votre profil KYC est en attente de validation."
            link={null}
            linkLabel={null}
          />
        </View>
      ) : user?.kyc_status === "rejected" ? (
        <View className="bg-[#FEFCE8] w-full border-l-4 border-[#FACC15] mx-1 py-3">
          <Warning
            message="Votre profil KYC a été rejeté. Veuillez le mettre à jour."
            link="/(kyc)/update-profile"
            linkLabel="Mettre à jour"
          />
        </View>
      ) : user?.kyc_status === "not_submitted" ? (
        <View className="bg-[#FEFCE8] w-full border-l-4 border-[#FACC15] mx-1 py-3">
          <Warning
            message="Vos documents KYC n'ont pas été soumis."
            link="/(kyc)/upload-kyc-docs"
            linkLabel="Mettre à jour"
          />
        </View>
      ) : null}
    </>
  );
};
