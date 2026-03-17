import { create } from "zustand";
import {
  DestinationsResponse,
  FundingMethodsResponse,
  TransferFlowResponse,
  Destination,
  PaymentMethod,
  Country,
} from "@/types/routes";
import {
  getDestinations,
  getTransferFlow,
  getUserCountryFundingMethods,
} from "@/services/routes.service";

type RoutesState = {
  // Funding methods (source country level — shown before destination is picked)
  fundingCountry: Country | null;
  fundingMethods: PaymentMethod[];
  fundingLoading: boolean;
  fundingError: string | null;

  // Destinations (all reachable from source country)
  sourceCountry: Country | null;
  destinations: Destination[];
  destinationsLoading: boolean;
  destinationsError: string | null;

  // Transfer flow (corridor-specific — populated after destination is selected)
  // funding_methods here are the corridor-validated sender options
  // payout_methods here are the corridor-validated receiver options
  transferFlow: TransferFlowResponse | null;
  transferFlowLoading: boolean;
  transferFlowError: string | null;

  // Legacy combined error
  error: string | null;

  // Actions
  fetchFundingMethods: (countryCode: string) => Promise<void>;
  fetchDestinations: (sourceCode: string) => Promise<void>;
  /**
   * Call after user selects a destination country.
   * Validates the corridor and returns corridor-specific funding + payout methods.
   */
  fetchTransferFlow: (source: string, destination: string) => Promise<void>;
  clearTransferFlow: () => void;
  reset: () => void;
};

export const useRoutesStore = create<RoutesState>((set) => ({
  // Initial state
  fundingCountry: null,
  fundingMethods: [],
  fundingLoading: false,
  fundingError: null,

  sourceCountry: null,
  destinations: [],
  destinationsLoading: false,
  destinationsError: null,

  transferFlow: null,
  transferFlowLoading: false,
  transferFlowError: null,

  error: null,

  // Country-level funding methods (before destination is known)
  fetchFundingMethods: async (countryCode: string) => {
    console.log(countryCode)
    set({ fundingLoading: true, fundingError: null, error: null });

    try {
      const response = await getUserCountryFundingMethods(countryCode);
      const data: FundingMethodsResponse = response.data;

      if (!data.success) {
        throw new Error("Funding methods request failed");
      }

      set({
        fundingCountry: data.country,
        fundingMethods: data.payment_methods,
        fundingLoading: false,
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Impossible de charger les modes de financement.";
      set({ fundingError: msg, error: msg, fundingLoading: false });
    }
  },

  // Destination country list (used to populate the receiver modal)
  fetchDestinations: async (sourceCode: string) => {
    set({ destinationsLoading: true, destinationsError: null, error: null });

    try {
      const response = await getDestinations(sourceCode);
      const data: DestinationsResponse = response.data;

      if (!data.success) {
        throw new Error("Destinations request failed");
      }

      set({
        sourceCountry: data.source_country,
        destinations: data.destinations,
        destinationsLoading: false,
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Impossible de charger les destinations.";
      set({ destinationsError: msg, error: msg, destinationsLoading: false });
    }
  },

  // Corridor-specific validation: call this after user picks a destination country
  fetchTransferFlow: async (source: string, destination: string) => {
    set({ transferFlowLoading: true, transferFlowError: null });

    try {
      const response = await getTransferFlow(source, destination);
      const data: TransferFlowResponse = response.data;

      if (!data.success) {
        throw new Error(data.message || "Corridor not available");
      }

      set({ transferFlow: data, transferFlowLoading: false });
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Impossible de valider ce corridor.";
      set({ transferFlowError: msg, transferFlowLoading: false });
    }
  },

  clearTransferFlow: () =>
    set({
      transferFlow: null,
      transferFlowError: null,
      transferFlowLoading: false,
    }),

  reset: () =>
    set({
      fundingCountry: null,
      fundingMethods: [],
      fundingLoading: false,
      fundingError: null,

      sourceCountry: null,
      destinations: [],
      destinationsLoading: false,
      destinationsError: null,

      transferFlow: null,
      transferFlowLoading: false,
      transferFlowError: null,

      error: null,
    }),
}));
