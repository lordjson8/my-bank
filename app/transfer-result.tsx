import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react-native';
import  transferService  from '@/services/transactionService';
import { Transfer } from '@/types/transfers';
// import moment from 'moment';

export default function TransferResultScreen() {
  const router = useRouter();
  const { transferId, status: initialStatus } = useLocalSearchParams();
  const [transfer, setTransfer] = useState<Transfer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (transferId) {
      fetchTransferDetails(transferId as string);
    } else {
      setError("No transfer ID provided.");
      setLoading(false);
    }
  }, [transferId]);

  const fetchTransferDetails = async (id: string) => {
    try {
      setLoading(true);
      const response = await transferService.getTransferDetails(id);
      if (response.success) {
        setTransfer(response.data);
      } else {
        setError(response.error_message || "Failed to fetch transfer details.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching transfer details.");
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = transfer?.status === 'completed';
  const isPending = transfer?.status === 'pending' || transfer?.status === 'processing';
  const isFailed = transfer?.status === 'failed' || transfer?.status === 'cancelled' || transfer?.status === 'reversed';

  const statusColor = isSuccess ? 'text-green-500' : isFailed ? 'text-red-500' : 'text-orange-500';
  const icon = isSuccess ? <CheckCircle2 size={60} color="green" /> : isFailed ? <XCircle size={60} color="red" /> : <Loader2 size={60} color="orange" />;
  const message = isSuccess ? 'Transfer Completed!' : isFailed ? 'Transfer Failed' : 'Transfer in Progress...';

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} className="px-4 py-8">
        {loading ? (
          <View className="flex-col items-center justify-center p-8">
            <ActivityIndicator size="large" color="#0000ff" />
            <Text className="mt-4 text-lg text-gray-600">Loading transfer details...</Text>
          </View>
        ) : error ? (
          <View className="flex-col items-center justify-center p-8">
            <XCircle size={60} color="red" />
            <Text className="mt-4 text-xl font-bold text-red-500">Error</Text>
            <Text className="text-center text-gray-600">{error}</Text>
          </View>
        ) : (
          <View className="w-full max-w-md bg-white rounded-lg p-6 shadow-md">
            <View className="items-center justify-center mb-6">
              {icon}
              <Text className={`mt-4 text-2xl font-bold ${statusColor}`}>
                {message}
              </Text>
              {transfer?.error_message && isFailed && (
                <Text className="text-red-400 text-center mt-2">{transfer.error_message}</Text>
              )}
            </View>

            {transfer && (
              <View className="border-t border-gray-200 pt-4">
                <Text className="text-lg font-semibold text-gray-800 mb-2">Transfer Details</Text>
                <View className="flex-row justify-between py-1">
                  <Text className="text-gray-600">Reference:</Text>
                  <Text className="font-medium text-gray-900">{transfer.reference}</Text>
                </View>
                <View className="flex-row justify-between py-1">
                  <Text className="text-gray-600">Recipient:</Text>
                  <Text className="font-medium text-gray-900">{transfer.recipient_name} ({transfer.recipient_phone})</Text>
                </View>
                <View className="flex-row justify-between py-1">
                  <Text className="text-gray-600">Amount Sent:</Text>
                  <Text className="font-medium text-gray-900">{transfer.amount} {transfer.currency}</Text>
                </View>
                <View className="flex-row justify-between py-1">
                  <Text className="text-gray-600">Total Charged:</Text>
                  <Text className="font-medium text-gray-900">{transfer.total_amount} {transfer.currency}</Text>
                </View>
                <View className="flex-row justify-between py-1">
                  <Text className="text-gray-600">Date:</Text>
                  {/* <Text className="font-medium text-gray-900">{moment(transfer.created_at).format('LLL')}</Text> */}
                </View>
                {transfer.completed_at && (
                  <View className="flex-row justify-between py-1">
                    <Text className="text-gray-600">Completed At:</Text>
                    {/* <Text className="font-medium text-gray-900">{moment(transfer.completed_at).format('LLL')}</Text> */}
                  </View>
                )}
              </View>
            )}

            <View className="mt-8">
              <TouchableOpacity
                className="bg-blue-600 px-5 py-3 rounded-lg flex-row items-center justify-center mb-3"
                onPress={() => router.replace('/(tabs)/index')}
              >
                <Text className="text-white text-lg font-semibold">Make Another Transfer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="border border-blue-600 px-5 py-3 rounded-lg flex-row items-center justify-center"
                onPress={() => router.replace('/(tabs)/add')}
              >
                <Text className="text-blue-600 text-lg font-semibold">View Transfer History</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
