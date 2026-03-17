import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle2, XCircle, Loader2, Smartphone } from 'lucide-react-native';
import transferService from '@/services/transactionService';
import { Transfer, TransferStatus } from '@/types/transfers';

const POLLING_INTERVAL = 5000;

function getStatusInfo(status: TransferStatus) {
  switch (status) {
    case 'completed':
      return {
        icon: <CheckCircle2 size={60} color="#22c55e" />,
        message: 'Transfer Completed!',
        description: 'Money has been delivered to the recipient.',
        color: 'text-success',
        bgColor: 'bg-success/10',
      };
    case 'deposit_pending':
      return {
        icon: <Smartphone size={60} color="#F97316" />,
        message: 'Confirm on Your Phone',
        description: 'A USSD prompt has been sent to your phone. Please confirm the payment on your mobile device.',
        color: 'text-primary',
        bgColor: 'bg-primary/10',
      };
    case 'deposit_confirmed':
      return {
        icon: <Loader2 size={60} color="#F97316" />,
        message: 'Payment Received',
        description: 'Your payment has been received. Sending money to the recipient...',
        color: 'text-primary',
        bgColor: 'bg-primary/10',
      };
    case 'withdrawal_pending':
      return {
        icon: <Loader2 size={60} color="#F97316" />,
        message: 'Sending to Recipient...',
        description: 'Money is being sent to the recipient. This may take a moment.',
        color: 'text-primary',
        bgColor: 'bg-primary/10',
      };
    case 'deposit_failed':
      return {
        icon: <XCircle size={60} color="#ef4444" />,
        message: 'Payment Failed',
        description: 'The payment from your account was not completed. No money was charged.',
        color: 'text-destructive',
        bgColor: 'bg-destructive/10',
      };
    case 'failed':
      return {
        icon: <XCircle size={60} color="#ef4444" />,
        message: 'Transfer Failed',
        description: 'Something went wrong with this transfer.',
        color: 'text-destructive',
        bgColor: 'bg-destructive/10',
      };
    case 'pending':
    case 'processing':
      return {
        icon: <Loader2 size={60} color="#F97316" />,
        message: 'Transfer in Progress...',
        description: 'Your transfer is being processed.',
        color: 'text-primary',
        bgColor: 'bg-primary/10',
      };
    case 'cancelled':
      return {
        icon: <XCircle size={60} color="#9CA3AF" />,
        message: 'Transfer Cancelled',
        description: 'This transfer was cancelled.',
        color: 'text-muted-foreground',
        bgColor: 'bg-muted',
      };
    case 'reversed':
      return {
        icon: <XCircle size={60} color="#a855f7" />,
        message: 'Transfer Reversed',
        description: 'This transfer has been reversed.',
        color: 'text-muted-foreground',
        bgColor: 'bg-muted',
      };
    default:
      return {
        icon: <Loader2 size={60} color="#F97316" />,
        message: 'Processing...',
        description: '',
        color: 'text-primary',
        bgColor: 'bg-primary/10',
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
  const { transferId } = useLocalSearchParams();
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

  useEffect(() => {
    if (transferId) {
      fetchTransferDetails(transferId as string);
    } else {
      setError("No transfer ID provided.");
      setLoading(false);
    }
  }, [transferId]);

  useEffect(() => {
    if (!transfer || !transferId) return;
    if (!ACTIVE_STATUSES.includes(transfer.status)) return;

    const interval = setInterval(() => {
      fetchTransferDetails(transferId as string);
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [transfer?.status, transferId]);

  const statusInfo = transfer ? getStatusInfo(transfer.status) : null;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
        className="px-4 py-8"
      >
        {loading ? (
          <View className="flex-col items-center justify-center p-8">
            <ActivityIndicator size="large" color="#F97316" />
            <Text className="mt-4 text-lg text-muted-foreground">
              Chargement des détails...
            </Text>
          </View>
        ) : error ? (
          <View className="flex-col items-center justify-center p-8">
            <XCircle size={60} color="#ef4444" />
            <Text className="mt-4 text-xl font-bold text-destructive">Erreur</Text>
            <Text className="text-center text-muted-foreground mt-2">{error}</Text>
            <TouchableOpacity
              className="mt-6 bg-primary px-6 py-3 rounded-xl"
              onPress={() => router.replace('/(tabs)/index')}
            >
              <Text className="text-white font-semibold">Retour</Text>
            </TouchableOpacity>
          </View>
        ) : transfer && statusInfo ? (
          <View className="w-full bg-card rounded-2xl border border-border p-6">
            {/* Status Icon & Message */}
            <View className="items-center justify-center mb-6">
              <View className={`p-4 rounded-full ${statusInfo.bgColor} mb-2`}>
                {statusInfo.icon}
              </View>
              <Text className={`mt-4 text-2xl font-bold ${statusInfo.color}`}>
                {statusInfo.message}
              </Text>
              <Text className="text-muted-foreground text-center mt-2 px-4">
                {statusInfo.description}
              </Text>
              {transfer.error_message && (transfer.status === 'failed' || transfer.status === 'deposit_failed') && (
                <Text className="text-destructive text-center mt-2">{transfer.error_message}</Text>
              )}
            </View>

            {/* Transfer Progress Steps */}
            {transfer.status !== 'pending' && (
              <View className="mb-4 px-4 py-4 bg-muted/50 rounded-xl">
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
            <View className="border-t border-border pt-4">
              <Text className="text-lg font-semibold text-foreground mb-3">
                Détails du transfert
              </Text>
              <DetailRow label="Référence" value={transfer.reference} />
              <DetailRow label="Expéditeur" value={`${transfer.sender_name} (${transfer.sender_phone})`} />
              <DetailRow label="Bénéficiaire" value={`${transfer.recipient_name} (${transfer.recipient_phone})`} />
              <DetailRow label="Montant" value={`${transfer.amount} ${transfer.currency}`} />
              <DetailRow label="Frais" value={`${transfer.service_fee} ${transfer.currency}`} />
              <DetailRow label="Total prélevé" value={`${transfer.total_amount} ${transfer.currency}`} />
              {transfer.destination_amount && transfer.destination_currency && (
                <DetailRow label="Bénéficiaire reçoit" value={`${transfer.destination_amount} ${transfer.destination_currency}`} />
              )}
              <DetailRow label="Statut" value={transfer.status_display} />
            </View>

            {/* Action Buttons */}
            <View className="mt-6 gap-3">
              <TouchableOpacity
                className="bg-primary px-5 py-4 rounded-xl items-center"
                onPress={() => router.replace('/(tabs)/index')}
              >
                <Text className="text-white text-lg font-semibold">
                  Nouveau transfert
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="border border-border px-5 py-4 rounded-xl items-center"
                onPress={() => router.replace('/(tabs)/transfer-results')}
              >
                <Text className="text-foreground text-lg font-semibold">
                  Voir l&apos;historique
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function ProgressStep({ label, done, active }: { label: string; done: boolean; active: boolean }) {
  const dotColor = done ? 'bg-success' : active ? 'bg-primary' : 'bg-border';
  const textColor = done ? 'text-success' : active ? 'text-primary' : 'text-muted-foreground';

  return (
    <View className="flex-row items-center">
      <View className={`w-4 h-4 rounded-full ${dotColor} mr-3`} />
      <Text className={`text-base font-medium ${textColor}`}>{label}</Text>
      {active && <ActivityIndicator size="small" color="#F97316" style={{ marginLeft: 8 }} />}
    </View>
  );
}

function StepConnector() {
  return <View className="w-0.5 h-6 bg-border ml-2" />;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-1.5">
      <Text className="text-muted-foreground">{label}:</Text>
      <Text
        className="font-medium text-foreground flex-shrink"
        style={{ maxWidth: '60%', textAlign: 'right' }}
      >
        {value}
      </Text>
    </View>
  );
}
