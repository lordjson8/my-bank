import transferService from "@/services/transactionService";
import { create } from "zustand";
import {
  TransferHistoryItem,
  CreateTransferPayload,
  Transfer,
} from "@/types/transfers";

interface TransactionState {
  history: TransferHistoryItem[];
  loadingHistory: boolean;
  historyError: string | null;
  hasNextPage: boolean;
  offset: number;
  creatingTransfer: boolean;
  createTransferError: string | null;
  fetchHistory: (replace?: boolean) => Promise<void>;
  createTransfer: (payload: CreateTransferPayload) => Promise<Transfer | null>;
  resetCreateTransferError: () => void;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  history: [],
  loadingHistory: false,
  historyError: null,
  hasNextPage: false,
  offset: 0,
  creatingTransfer: false,
  createTransferError: null,

  fetchHistory: async (replace = false) => {
    if (get().loadingHistory) return;

    set({ loadingHistory: true, historyError: null });
    try {
      const limit = 20;
      const offset = replace ? 0 : get().offset;

      const response = await transferService.getTransferHistory({
        limit,
        offset,
      });

      if (response.success) {
        set((state) => ({
          history: replace
            ? response.data
            : [...state.history, ...response.data],
          offset: offset + response.data.length,
          hasNextPage: response.pagination.has_more,
        }));
      } else {
        throw new Error("Failed to fetch history");
      }
    } catch (error: any) {
      set({ historyError: error.message || "An unknown error occurred" });
    } finally {
      set({ loadingHistory: false });
    }
  },

  createTransfer: async (payload: CreateTransferPayload) => {
    set({ creatingTransfer: true, createTransferError: null });
    try {
      const response = await transferService.createTransfer(payload);
      if (response.success) {
        // Invalidate history to refetch on next visit
        set({ offset: 0, history: [] }); // Reset history so it re-fetches
        return response.data;
      } else {
        throw new Error(response.message || "Transfer creation failed");
      }
    } catch (error: any) {
      const data = error.response?.data;
      // Try to extract the most useful error message from various backend shapes
      const errorMessage =
        (typeof data?.error === "string" ? data.error : null) ||
        data?.error?.details ||
        data?.error?.detail ||
        data?.detail ||
        data?.message ||
        data?.amount?.[0] ||
        data?.non_field_errors?.[0] ||
        error.message ||
        "Une erreur inattendue est survenue.";
      set({ createTransferError: typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage) });
      return null;
    } finally {
      set({ creatingTransfer: false });
    }
  },

  resetCreateTransferError: () => set({ createTransferError: null }),
}));
