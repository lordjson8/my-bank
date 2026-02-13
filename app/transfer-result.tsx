import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle2, XCircle, Loader2, Smartphone, ArrowDown } from 'lucide-react-native';
import transferService from '@/services/transactionService';
import { Transfer, TransferStatus } from '@/types/transfers';

const POLLING_INTERVAL = 5000; // 5 seconds

function getStatusInfo(status: TransferStatus) {
  switch (status) {
    case 'completed':
      return {
        icon: <CheckCircle2 size={60} color="green" />,
        message: 'Transfer Completed!',
        description: 'Money has been delivered to the recipient.',
        color: 'text-green-500',
        bgColor: 'bg-green-50',
      };
    case 'deposit_pending':
      return {
        icon: <Smartphone size={60} color="#2196F3" />,
        message: 'Confirm on Your Phone',
        description: 'A USSD prompt has been sent to your phone. Please confirm the payment on your mobile device.',
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
      };
    case 'deposit_confirmed':
      return {
        icon: <Loader2 size={60} color="orange" />,
        message: 'Payment Received',
        description: 'Your payment has been received. Sending money to the recipient...',
        color: 'text-orange-500',
        bgColor: 'bg-orange-50',
      };
    case 'withdrawal_pending':
      return {
        icon: <Loader2 size={60} color="orange" />,
        message: 'Sending to Recipient...',
        description: 'Money is being sent to the recipient. This may take a moment.',
        color: 'text-orange-500',
        bgColor: 'bg-orange-50',
      };
    case 'deposit_failed':
      return {
        icon: <XCircle size={60} color="red" />,
        message: 'Payment Failed',
        description: 'The payment from your account was not completed. No money was charged.',
        color: 'text-red-500',
        bgColor: 'bg-red-50',
      };
    case 'failed':
      return {
        icon: <XCircle size={60} color="red" />,
        message: 'Transfer Failed',
        description: 'Something went wrong with this transfer.',
        color: 'text-red-500',
        bgColor: 'bg-red-50',
      };
    case 'pending':
    case 'processing':
      return {
        icon: <Loader2 size={60} color="orange" />,
        message: 'Transfer in Progress...',
        description: 'Your transfer is being processed.',
        color: 'text-orange-500',
        bgColor: 'bg-orange-50',
      };
    case 'cancelled':
      return {
        icon: <XCircle size={60} color="gray" />,
        message: 'Transfer Cancelled',
        description: 'This transfer was cancelled.',
        color: 'text-gray-500',
        bgColor: 'bg-gray-50',
      };
    case 'reversed':
      return {
        icon: <XCircle size={60} color="purple" />,
        message: 'Transfer Reversed',
        description: 'This transfer has been reversed.',
        color: 'text-purple-500',
        bgColor: 'bg-purple-50',
      };
    default:
      return {
        icon: <Loader2 size={60} color="orange" />,
        message: 'Processing...',
        description: '',
        color: 'text-orange-500',
        bgColor: 'bg-orange-50',
      };
  }
}

const ACTIVE_STATUSES: TransferStatus[] = [
  'pending',
  'deposit_pending',
  'deposit_confirmed',
  'withdrawal_pending',
  'processing',
];

export default function TransferResultScreen() {
  const router = useRouter();
  const { transferId, status: initialStatus } = useLocalSearchParams();
  const [transfer, setTransfer] = useState<Transfer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransferDetails = useCallback(async (id: string) => {
    try {
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
  }, []);

  // Initial fetch
  useEffect(() => {
    if (transferId) {
      fetchTransferDetails(transferId as string);
    } else {
      setError("No transfer ID provided.");
      setLoading(false);
    }
  }, [transferId]);

  // Poll for status updates while transfer is in an active state
  useEffect(() => {
    if (!transfer || !transferId) return;
    if (!ACTIVE_STATUSES.includes(transfer.status)) return;

    const interval = setInterval(() => {
      fetchTransferDetails(transferId as string);
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [transfer?.status, transferId]);

  const statusInfo = transfer ? getStatusInfo(transfer.status) : null;
  const isTerminal = transfer && !ACTIVE_STATUSES.includes(transfer.status);

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
        ) : transfer && statusInfo ? (
          <View className="w-full max-w-md bg-white rounded-lg p-6 shadow-md">
            {/* Status Icon & Message */}
            <View className="items-center justify-center mb-6">
              {statusInfo.icon}
              <Text className={`mt-4 text-2xl font-bold ${statusInfo.color}`}>
                {statusInfo.message}
              </Text>
              <Text className="text-gray-500 text-center mt-2 px-4">
                {statusInfo.description}
              </Text>
              {transfer.error_message && (transfer.status === 'failed' || transfer.status === 'deposit_failed') && (
                <Text className="text-red-400 text-center mt-2">{transfer.error_message}</Text>
              )}
            </View>

            {/* Transfer Progress Steps */}
            {transfer.status !== 'pending' && (
              <View className="mb-4 px-4">
                <ProgressStep
                  label="Payment Initiated"
                  done={!!transfer.deposit_initiated_at}
                  active={transfer.status === 'deposit_pending'}
                />
                <StepConnector />
                <ProgressStep
                  label="Payment Confirmed"
                  done={!!transfer.deposit_confirmed_at}
                  active={transfer.status === 'deposit_confirmed'}
                />
                <StepConnector />
                <ProgressStep
                  label="Sending to Recipient"
                  done={!!transfer.withdrawal_initiated_at}
                  active={transfer.status === 'withdrawal_pending'}
                />
                <StepConnector />
                <ProgressStep
                  label="Delivered"
                  done={transfer.status === 'completed'}
                  active={false}
                />
              </View>
            )}

            {/* Transfer Details */}
            <View className="border-t border-gray-200 pt-4">
              <Text className="text-lg font-semibold text-gray-800 mb-2">Transfer Details</Text>
              <DetailRow label="Reference" value={transfer.reference} />
              <DetailRow label="Sender" value={`${transfer.sender_name} (${transfer.sender_phone})`} />
              <DetailRow label="Recipient" value={`${transfer.recipient_name} (${transfer.recipient_phone})`} />
              <DetailRow label="Amount Sent" value={`${transfer.amount} ${transfer.currency}`} />
              <DetailRow label="Fee" value={`${transfer.service_fee} ${transfer.currency}`} />
              <DetailRow label="Total Charged" value={`${transfer.total_amount} ${transfer.currency}`} />
              {transfer.destination_amount && transfer.destination_currency && (
                <DetailRow label="Recipient Gets" value={`${transfer.destination_amount} ${transfer.destination_currency}`} />
              )}
              <DetailRow label="Status" value={transfer.status_display} />
            </View>

            {/* Action Buttons */}
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
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function ProgressStep({ label, done, active }: { label: string; done: boolean; active: boolean }) {
  const bgColor = done ? 'bg-green-500' : active ? 'bg-blue-500' : 'bg-gray-300';
  const textColor = done ? 'text-green-700' : active ? 'text-blue-700' : 'text-gray-400';

  return (
    <View className="flex-row items-center">
      <View className={`w-4 h-4 rounded-full ${bgColor} mr-3`} />
      <Text className={`text-base font-medium ${textColor}`}>{label}</Text>
      {active && <ActivityIndicator size="small" color="#3B82F6" style={{ marginLeft: 8 }} />}
    </View>
  );
}

function StepConnector() {
  return <View className="w-0.5 h-6 bg-gray-300 ml-2" />;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-1">
      <Text className="text-gray-600">{label}:</Text>
      <Text className="font-medium text-gray-900 flex-shrink" style={{ maxWidth: '60%', textAlign: 'right' }}>{value}</Text>
    </View>
  );
}
