import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/dashboard/header";
import { Link } from "expo-router";
import { WarningBanner } from "@/components/warning-barner";
import { CircleCheckBig, Clock, Search, XCircle } from "lucide-react-native";
import { TextInput } from "react-native";
import { useAuthStore } from "@/store/authStore";
import { KYCStatus } from "@/types/auth.types";

const kycStatusConfig: Record<
  KYCStatus,
  { text: string; color: string; icon: React.ReactNode }
> = {
  pending: {
    text: "Validation en cours",
    color: "#eab308",
    icon: <Clock color={"#eab308"} />,
  },
  approved: {
    text: "Vérifié",
    color: "#22C55E",
    icon: <CircleCheckBig color={"#22C55E"} />,
  },
  rejected: {
    text: "Rejeté",
    color: "#EF4444",
    icon: <XCircle color={"#EF4444"} />,
  },
  under_review: {
    text: "En cours d'examen",
    color: "#eab308",
    icon: <Clock color={"#eab308"} />,
  },
  not_submitted: {
    text: "Non soumis",
    color: "#eab308",
    icon: <Clock color={"#eab308"} />,
  },
};

export default function ProfileScreen() {
  // const image = require("@/assets/images/Container.png");
  const { user } = useAuthStore();

  if (!user) {
    return (
      <View className="bg-gray-50 flex-1 justify-center items-center">
        <Text>Utilisateur non trouvé</Text>
      </View>
    );
  }

  const {
    text: kycStatusText,
    color: kycStatusColor,
    icon: kycStatusIcon,
  } = kycStatusConfig[user.kyc_status];

  return (
    <View className="bg-gray-50 flex-1">
      <ScrollView className="">
        <View className="px-6 py-6">
          <Text className="font-bold text-lg">Données personnelles</Text>

          <View className="gap-1">
            <View className="border-b border-border py-4">
              <View className="gap-1">
                  <Text className="text-muted-foreground ">Nom complet</Text>
                </View>
              <Text className="font-bold text-xl">{user.full_name}</Text>
              <View className="flex-row gap-3 items-center">
                {kycStatusIcon}
                <Text style={{ color: kycStatusColor }} className="font-semibold">
                  {kycStatusText}
                </Text>
              </View>
            </View>
            <View className="py-4 border-border border-b">
              <View className="flex-row gap-3 items-center mt-2">
                {user.phone_verified ? (
                  <CircleCheckBig color={"#22C55E"} />
                ) : (
                  <Clock color={"#eab308"} />
                )}
                <View className="gap-1">
                  <Text className="text-muted-foreground ">Numéro</Text>
                  <Text className="text-[#eab308] font-bold text-pretty">
                    {user.phone}
                  </Text>
                </View>
              </View>
            </View>

            <View className="py-4 border-border border-b">
              <View className="flex-row gap-3 items-center mt-2">
                {user.email_verified ? (
                  <CircleCheckBig color={"#22C55E"} />
                ) : (
                  <Clock color={"#eab308"} />
                )}
                <View className="gap-1">
                  <Text className="text-muted-foreground ">Email</Text>
                  <Text className="text-[#eab308] font-bold text-pretty">
                    {user.email}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {user.kyc_status !== "not_submitted" && (
            <>
              <View className="mt-3">
                <Text className="text-muted-foreground ">
                  Photo carte d&apos;identité/passeport
                </Text>
                <View className="border-b border-border py-4">
                  <Text className="font-semibold text-lg">{user.full_name}</Text>
                  <View className="flex-row gap-3 items-center mt-2">
                    {kycStatusIcon}
                    <Text style={{ color: kycStatusColor }} className="font-semibold">
                      {kycStatusText}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="mt-3">
                <Text className="text-muted-foreground ">
                  Selfie avec carte d&apos;identité/passeport
                </Text>
                <View className="py-4">
                  <Text className="font-semibold text-lg">{user.full_name}</Text>
                  <View className="flex-row gap-3 items-center mt-2">
                    {kycStatusIcon}
                    <Text style={{ color: kycStatusColor }} className="font-semibold">
                      {kycStatusText}
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
