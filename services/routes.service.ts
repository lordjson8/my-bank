import {
  DestinationsResponse,
  FundingMethodsResponse,
  TransferFlowResponse,
} from "@/types/routes";
import api from "./api";
import { AxiosResponse } from "axios";


export const getUserCountryFundingMethods = async (
  countryCode: string
): Promise<AxiosResponse<FundingMethodsResponse>> => {
  return api.get(`/routes/countries/${countryCode.toLowerCase()}/payment-methods/`);
};

export const getDestinations = async (
  source: string
): Promise<AxiosResponse<DestinationsResponse>> => {
  return api.get(`/routes/available-destinations/?source=${source}`);
};

/**
 * Fetches corridor-specific funding + payout methods and corridor validation.
 * Use this after the user selects a destination country to get the exact
 * methods valid for the source→destination corridor.
 */
export const getTransferFlow = async (
  source: string,
  destination: string
): Promise<AxiosResponse<TransferFlowResponse>> => {
  return api.get(
    `/routes/transfer-flow/?source=${source}&destination=${destination}`
  );
};
