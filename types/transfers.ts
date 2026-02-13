
// types/transfers.ts

export type TransferStatus =
  | 'pending'
  | 'deposit_pending'
  | 'deposit_confirmed'
  | 'deposit_failed'
  | 'withdrawal_pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'reversed';

export interface CreateTransferPayload {
  sender_phone: string;
  sender_name: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_email?: string;
  amount: number;
  currency: string;
  description?: string;
  funding_provider: string;
  payout_provider: string;
  device_id: string;
}

export interface Transfer {
  id: string;
  status: TransferStatus;
  status_display: string;
  // Sender
  sender_phone: string;
  sender_name: string;
  sender_email: string;
  funding_mobile_provider: string;
  // Source amount
  amount: string;
  currency: string;
  service_fee: string;
  total_amount: string;
  // Destination amount
  destination_amount: string | null;
  destination_currency: string;
  // Payout
  payout_mobile_provider: string;
  // Recipient
  recipient_name: string;
  recipient_phone: string;
  recipient_email: string;
  // Reference
  reference: string;
  provider: string;
  provider_id: string;
  // Deposit phase
  deposit_reference: string;
  deposit_status: string;
  deposit_gateway: string;
  deposit_initiated_at: string | null;
  deposit_confirmed_at: string | null;
  // Withdrawal phase
  withdrawal_reference: string;
  withdrawal_status: string;
  withdrawal_gateway: string;
  withdrawal_initiated_at: string | null;
  withdrawal_confirmed_at: string | null;
  // Other
  description: string;
  created_at: string;
  completed_at: string | null;
  error_code: string;
  error_message: string;
}

export interface CreateTransferResponse {
  success: boolean;
  message: string;
  data: Transfer;
  error?: string;
  error_code?: string;
}

export interface TransferHistoryItem {
  id: string;
  status: TransferStatus;
  status_display: string;
  amount: string;
  currency: string;
  destination_amount: string | null;
  destination_currency: string;
  funding_mobile_provider: string;
  payout_mobile_provider: string;
  sender_phone: string;
  recipient_name: string;
  recipient_phone: string;
  created_at: string;
}

export interface TransferHistoryResponse {
  success: boolean;
  data: TransferHistoryItem[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };
}
