
// types/transfers.ts

export interface CreateTransferPayload {
  recipient_name: string;
  recipient_phone: string;
  recipient_email?: string;
  amount: number;
  currency: string;
  description?: string;
  device_id: string;
}

export interface Transfer {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'reversed';
  status_display: string;
  amount: string;
  currency: string;
  service_fee: string;
  total_amount: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_email: string;
  reference: string;
  provider: string;
  provider_id: string;
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
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'reversed';
  status_display: string;
  amount: string;
  currency: string;
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
