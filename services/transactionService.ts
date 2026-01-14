import api from "./api";
import { CreateTransferPayload, CreateTransferResponse, TransferHistoryResponse, Transfer } from "@/types/transfers";


 const transferService = {
  createTransfer: async (payload: CreateTransferPayload): Promise<CreateTransferResponse> => {
    try {
      const response = await api.post<CreateTransferResponse>('/transfers/transfer/', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTransferHistory: async (
    { limit = 20, offset = 0 }: { limit?: number; offset?: number }
  ): Promise<TransferHistoryResponse> => {
    try {
      const response = await api.get<TransferHistoryResponse>('/transfers/history/', {
        params: { limit, offset },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getTransferDetails: async (id: string): Promise<{success: boolean, data: Transfer & { audit_logs: any[] }, error_message?: string}> => {
      const { data } = await api.get<{success: boolean, data: Transfer & { audit_logs: any[] }, error_message?: string}>(`/transfers/${id}/`);
      return data;
  },

  getTransferLimits: async (): Promise<any> => {
    const { data } = await api.get<{success: boolean, data: any}>(`/transfers/limits/`);
    return data;
  },
};

export default transferService