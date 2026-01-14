import React, { useState, useEffect, useCallback } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, CheckCircle2, XCircle, Clock } from "lucide-react-native";
import { useTransactionStore } from "@/store/transactionStore";
import { TransferHistoryItem } from "@/types/transfers";
import { useFocusEffect } from "expo-router";
// import moment from "moment";

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

  // Fetch initial data and refresh on focus
  useFocusEffect(
    useCallback(() => {
      fetchHistory(true); // Fetch fresh data on screen focus
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
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      transaction.recipient_name.toLowerCase().includes(lowerCaseSearchTerm) ||
      transaction.recipient_phone.includes(lowerCaseSearchTerm) ||
      transaction.status_display.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  if (historyError) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center p-4">
        <XCircle size={50} color="red" />
        <Text className="mt-4 text-lg text-red-600 text-center">
          Error loading transactions: {historyError}
        </Text>
        <TouchableOpacity onPress={onRefresh} className="mt-4 px-4 py-2 bg-blue-500 rounded-lg">
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="mx-4 mt-4 mb-4">
        <Text className="font-bold text-2xl">Historique</Text>
        <View className="mt-2 mb-5 bg-gray-100 flex-row gap-2 items-center px-2 rounded-xl">
          <Search size={17} color={"gray"} />
          <TextInput
            onChangeText={setSearchTerm}
            value={searchTerm}
            className="border-none w-full outline-none px-4 py-4 text-black"
            placeholder="Rechercher une transaction"
            placeholderTextColor={"gray"}
          />
        </View>
      </View>

      <FlatList
      style={{ flex: 1 }}
        data={filteredHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          !loadingHistory && filteredHistory.length === 0 ? (
            <View className="items-center justify-center mt-12">
              <Image source={image} />
              <Text className="font-bold text-2xl">Aucun résultat trouvé</Text>
              <Text className="text-gray-500 text-center mt-4 px-12 text-base">
                Désolé, il n&apos;y a aucun résultat pour cette recherche,
                veuillez essayer une autre chose.
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          loadingHistory && hasNextPage ? (
            <ActivityIndicator className="my-4" size="large" color="#0000ff" />
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, paddingBottom: 20 }}
      />
    </View>
  );
}

const TransactionItem = ({ transaction }: { transaction: TransferHistoryItem }) => {
  const isCredit = transaction.amount.startsWith('-'); // Assuming negative amounts for credit/debit
  const isCompleted = transaction.status === 'completed';
  const isFailed = transaction.status === 'failed';
  const isPending = transaction.status === 'pending' || transaction.status === 'processing';

  const statusIcon = isCompleted ? (
    <CheckCircle2 size={30} color="green" />
  ) : isFailed ? (
    <XCircle size={30} color="red" />
  ) : (
    <Clock size={30} color="orange" />
  );

  const statusColor = isCompleted ? 'text-green-600' : isFailed ? 'text-red-600' : 'text-orange-600';

  return (
    <View className="bg-white px-4 py-2 gap-2 rounded-lg flex-1 mb-2">
      <View className="gap-2 flex-row items-center">
        <View
          className="w-12 h-12 rounded-full items-center justify-center p-4"
          style={{
            backgroundColor: isCompleted
              ? "#D9F99D"
              : isFailed
              ? "#FECACA"
              : "#FED7AA",
          }}
        >
          {statusIcon}
        </View>
        <View className="flex-1 relative">
          <View className="py-1 flex-row items-center justify-between">
            <Text className="font-bold text-xl ">{transaction.recipient_name}</Text>
            <Text className="font-bold text-xl ">
              {isCredit ? "" : "+"}
              {transaction.amount} {transaction.currency}
            </Text>
          </View>
          <View className="py-1 flex-row items-center justify-between">
            <Text className="text-muted-foreground ">{transaction.status_display}</Text>
            <Text className="text-muted-foreground ">
              {/* {moment(transaction.created_at).format('MMM Do, YYYY HH:mm')} */}
            </Text>
          </View>
        </View>
      </View>
      <View className="border-t border-border py-2 flex-row items-center justify-between">
        <Text className="text-muted-foreground ">
          Phone: {transaction.recipient_phone}
        </Text>
        <Text className="text-muted-foreground ">Ref: {transaction.id.substring(0, 8)}...</Text>
      </View>
    </View>
  );
};
