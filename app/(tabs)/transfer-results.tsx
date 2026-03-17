import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Search, CheckCircle2, XCircle, Clock } from "lucide-react-native";
import { useTransactionStore } from "@/store/transactionStore";
import { TransferHistoryItem } from "@/types/transfers";
import { useFocusEffect } from "expo-router";
import Animated, { FadeInRight } from "react-native-reanimated";

const formatDate = (dateStr: string): string => {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
};

export default function TransactionHistory() {
  const image = require("@/assets/images/Container.png");
  const {
    history,
    loadingHistory,
    historyError,
    hasNextPage,
    fetchHistory,
  } = useTransactionStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchHistory(true);
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHistory(true).finally(() => setRefreshing(false));
  }, []);

  const handleLoadMore = () => {
    if (!loadingHistory && hasNextPage) {
      fetchHistory();
    }
  };

  const filteredHistory = history.filter((transaction) => {
    const term = searchTerm.toLowerCase();
    return (
      transaction.recipient_name.toLowerCase().includes(term) ||
      transaction.recipient_phone.includes(term) ||
      transaction.status_display.toLowerCase().includes(term)
    );
  });

  if (loadingHistory && history.length === 0) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  if (historyError) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-4">
        <XCircle size={50} color="#EF4444" />
        <Text className="mt-4 text-lg text-destructive text-center">
          Erreur de chargement : {historyError}
        </Text>
        <TouchableOpacity
          onPress={onRefresh}
          className="mt-4 px-6 py-3 bg-primary rounded-xl"
        >
          <Text className="text-white font-semibold">Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="mx-4 mt-4 mb-2">
        <Text className="font-bold text-2xl text-foreground">Historique</Text>
        <View className="mt-3 mb-3 bg-card border border-border flex-row gap-2 items-center px-3 rounded-xl">
          <Search size={17} color="#9CA3AF" />
          <TextInput
            onChangeText={setSearchTerm}
            value={searchTerm}
            className="flex-1 py-4 text-foreground"
            placeholder="Rechercher une transaction"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <FlatList
        data={filteredHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInRight.delay(index * 40).duration(300)}>
            <TransactionItem transaction={item} />
          </Animated.View>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          !loadingHistory ? (
            <View className="items-center justify-center mt-16 px-8">
              <Image source={image} />
              <Text className="font-bold text-2xl text-foreground mt-4 text-center">
                Aucun résultat trouvé
              </Text>
              <Text className="text-muted-foreground text-center mt-3 text-base">
                Désolé, il n&apos;y a aucun résultat pour cette recherche,
                veuillez essayer une autre chose.
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          loadingHistory && hasNextPage ? (
            <ActivityIndicator className="my-4" size="large" color="#F97316" />
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#F97316"
            colors={["#F97316"]}
          />
        }
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingBottom: 20,
        }}
      />
    </View>
  );
}

const TransactionItem = ({
  transaction,
}: {
  transaction: TransferHistoryItem;
}) => {
  const isCompleted = transaction.status === "completed";
  const isFailed =
    transaction.status === "failed" ||
    transaction.status === "deposit_failed";
  const isInProgress = [
    "pending",
    "processing",
    "deposit_pending",
    "deposit_confirmed",
    "withdrawal_pending",
  ].includes(transaction.status);

  const statusIcon = isCompleted ? (
    <CheckCircle2 size={28} color="#22c55e" />
  ) : isFailed ? (
    <XCircle size={28} color="#ef4444" />
  ) : (
    <Clock size={28} color="#f97316" />
  );

  const statusBg = isCompleted
    ? "#D9F99D"
    : isFailed
    ? "#FECACA"
    : isInProgress
    ? "#FED7AA"
    : "#E5E7EB";

  const amountColor = isCompleted
    ? "text-success"
    : isFailed
    ? "text-destructive"
    : "text-primary";

  return (
    <View className="bg-card border border-border px-4 py-3 gap-2 rounded-xl mb-2">
      <View className="gap-2 flex-row items-center">
        <View
          className="w-11 h-11 rounded-full items-center justify-center"
          style={{ backgroundColor: statusBg }}
        >
          {statusIcon}
        </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="font-bold text-base text-foreground flex-1 mr-2" numberOfLines={1}>
              {transaction.recipient_name}
            </Text>
            <Text className={`font-bold text-base ${amountColor}`}>
              {transaction.amount} {transaction.currency}
            </Text>
          </View>
          <View className="flex-row items-center justify-between mt-0.5">
            <Text className="text-muted-foreground text-sm">
              {transaction.status_display}
            </Text>
            <Text className="text-muted-foreground text-xs">
              {formatDate(transaction.created_at)}
            </Text>
          </View>
        </View>
      </View>
      <View className="border-t border-border pt-2 flex-row items-center justify-between">
        <Text className="text-muted-foreground text-sm">
          {transaction.recipient_phone}
        </Text>
        <Text className="text-muted-foreground text-xs font-mono">
          #{transaction.id.substring(0, 8)}
        </Text>
      </View>
    </View>
  );
};
