import { DestinationsResponse, FundingMethodsResponse } from "@/types/routes";
import api from "./api";
import { AxiosResponse } from "axios";


export const getUserCountryFundingMethods = async (
  countryCode: string
): Promise<AxiosResponse<FundingMethodsResponse>> => {
  const response = await api.get(
    `/routes/funding-methods/?country=${countryCode}`
  );
  return response;
}

export const getDestinations = async (
  source: string
): Promise<AxiosResponse<DestinationsResponse>> => {
  const response = await api.get(`/routes/available-destinations/?source=${source}`);
  return response;
};
