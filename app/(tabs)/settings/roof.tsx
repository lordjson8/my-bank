import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { useAuthStore } from "@/store/authStore";
import { KYCStatus } from "@/types/auth.types";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function RoofScreen() {
  return (
    <View className="flex-1 bg-white">
      <Features />
    </View>
  );
}

export function Features() {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Utilisateur non trouvé</Text>
      </View>
    );
  }

  const { can_transfer, transaction_limits, kyc_status } = user;

  const getStatusText = () => {
    if (kyc_status === "approved") {
      return can_transfer ? "Activé" : "Désactivé";
    }
    return "KYC En attente";
  };
  
  const getStatusClass = () => {
    if (kyc_status === "approved") {
      return can_transfer ? "text-green-500" : "text-red-500";
    }
    return "text-primary";
  }

  return (
    <ScrollView className="px-4 py-6">
      <View className="flex-1">
        <Text className="font-bold">Statut compte Ma Banque</Text>
        <View className="rounded-xl items-center p-y flex flex-row mt-4 justify-between">
          <Text className="text-md text-muted-foreground">
            Transfert par mobile money
          </Text>
          <Text className={`mt-2 ${getStatusClass()}`}>{getStatusText()}</Text>
        </View>
        <View className="rounded-xl items-center p-y flex flex-row mt-2 justify-between">
          <Text className="text-md text-muted-foreground">
            Transfert par carte bancaire
          </Text>
          <Text className={`mt-2 ${getStatusClass()}`}>{getStatusText()}</Text>
        </View>
      </View>

      <View className="flex-1 mt-6">
        <Text className="font-bold">Plafond mobile money Ma Banque</Text>
        <View className="rounded-xl items-center p-y flex flex-row mt-4 justify-between">
          <Text className="text-md text-muted-foreground">Journalier</Text>
          <Text className="mt-2 font-bold">
            {formatCurrency(transaction_limits.daily_limit)}
          </Text>
        </View>
        <View className="rounded-xl items-center p-y flex flex-row mt-2 justify-between">
          <Text className="text-md text-muted-foreground">Restant journalier</Text>
          <Text className="mt-2 font-bold">
            {formatCurrency(transaction_limits.remaining_daily_limit)}
          </Text>
        </View>
        <View className="rounded-xl items-center p-y flex flex-row mt-2 justify-between">
          <Text className="text-md text-muted-foreground">Mensuel</Text>
          <Text className="mt-2 font-bold">
            {formatCurrency(transaction_limits.monthly_limit)}
          </Text>
        </View>
        <View className="rounded-xl items-center p-y flex flex-row mt-2 justify-between">
          <Text className="text-md text-muted-foreground">Restant mensuel</Text>
          <Text className="mt-2 font-bold">
            {formatCurrency(transaction_limits.remaining_monthly_limit)}
          </Text>
        </View>
        {/* <View className="rounded-xl items-center p-y flex flex-row mt-2 justify-between">
          <Text className="text-md text-muted-foreground">Par transaction</Text>
          <Text className="mt-2 font-bold">
            {formatCurrency(transaction_limits.transaction_limit)}
          </Text>
        </View> */}
      </View>

      <View className="flex-1 mt-6">
        <Text className="font-bold">Plafond carte bancaire Ma Banque</Text>
        <View className="rounded-xl items-center p-y flex flex-row mt-4 justify-between">
          <Text className="text-md text-muted-foreground">Journalier</Text>
          <Text className="mt-2 font-bold">
            {formatCurrency(transaction_limits.daily_limit)}
          </Text>
        </View>
        <View className="rounded-xl items-center p-y flex flex-row mt-2 justify-between">
          <Text className="text-md text-muted-foreground">Restant journalier</Text>
          <Text className="mt-2 font-bold">
            {formatCurrency(transaction_limits.remaining_daily_limit)}
          </Text>
        </View>
        <View className="rounded-xl items-center p-y flex flex-row mt-2 justify-between">
          <Text className="text-md text-muted-foreground">Mensuel</Text>
          <Text className="mt-2 font-bold">
            {formatCurrency(transaction_limits.monthly_limit)}
          </Text>
        </View>
        <View className="rounded-xl items-center p-y flex flex-row mt-2 justify-between">
          <Text className="text-md text-muted-foreground">Restant mensuel</Text>
          <Text className="mt-2 font-bold">
            {formatCurrency(transaction_limits.remaining_monthly_limit)}
          </Text>
        </View>
        {/* <View className="rounded-xl items-center p-y flex flex-row mt-2 justify-between">
          <Text className="text-md text-muted-foreground">Par transaction</Text>
          <Text className="mt-2 font-bold">
            {formatCurrency(transaction_limits.transaction_limit)}
          </Text>
        </View> */}
      </View>
    </ScrollView>
  );
}
