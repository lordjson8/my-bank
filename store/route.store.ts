import { create } from "zustand";
import {
  DestinationsResponse,
  FundingMethodsResponse,
  Destination,
  PaymentMethod,
  Country,
} from "@/types/routes";
import {
  getDestinations,
  getUserCountryFundingMethods,
} from "@/services/routes.service";

type RoutesState = {
  // Funding
  fundingCountry: Country | null;
  fundingMethods: PaymentMethod[];
  fundingLoading: boolean;

  // Destinations
  sourceCountry: Country | null;
  destinations: Destination[];
  destinationsLoading: boolean;

  // Error
  error: string | null;

  // Actions
  fetchFundingMethods: (countryCode: string) => Promise<void>;
  fetchDestinations: (sourceCode: string) => Promise<void>;
  reset: () => void;
};

export const useRoutesStore = create<RoutesState>((set) => ({
  // Initial state
  fundingCountry: null,
  fundingMethods: [],
  fundingLoading: false,

  sourceCountry: null,
  destinations: [],
  destinationsLoading: false,

  error: null,

  // Fetch funding methods
  fetchFundingMethods: async (countryCode: string) => {
    set({ fundingLoading: true, error: null });

    try {
      const response = await getUserCountryFundingMethods(countryCode);
      const data: FundingMethodsResponse = response.data;

      if (!data.success) {
        throw new Error("Funding methods request failed");
      }

      set({
        fundingCountry: data.country,
        fundingMethods: data.funding_methods,
        fundingLoading: false,
      });
    } catch (err) {
      set({
        error: "Failed to fetch funding methods",
        fundingLoading: false,
      });
    }
  },

  // Fetch destinations
  fetchDestinations: async (sourceCode: string) => {
    set({ destinationsLoading: true, error: null });

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
    } catch (err) {
      set({
        error: "Failed to fetch destinations",
        destinationsLoading: false,
      });
    }
  },

  reset: () =>
    set({
      fundingCountry: null,
      fundingMethods: [],
      fundingLoading: false,

      sourceCountry: null,
      destinations: [],
      destinationsLoading: false,

      error: null,
    }),
}));
