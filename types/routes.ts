export type TypeCategory = "funding" | "payout" | "both";

export type MethodType = "mobile_money" | "card" | "bank";

export type MobileMoneyProvider =
  // Cameroon
  | "mtn_cm"
  | "orange_cm"

  // Côte d'Ivoire
  | "mtn_ci"
  | "orange_ci"
  | "moov_ci"
  | "wave_ci"

  // Senegal
  | "orange_sn"
  | "free_sn"
  | "wave_sn"

  // Mali
  | "orange_ml"
  | "moov_ml"

  // Burkina Faso
  | "orange_bf"
  | "moov_bf"

  // Togo
  | "togocom_tg"
  | "moov_tg"

  // Benin
  | "mtn_bj"
  | "moov_bj";


export interface PaymentMethod {
  id: number;
  country: number; // country ID, NOT the object
  type_category: TypeCategory;
  type_category_display: string;
  method_type: MethodType;
  method_type_display: string;
  mobile_provider: MobileMoneyProvider | "";
  mobile_provider_display: string;
  card_scheme: string;
  display_name: string;
  icon_url: string;
  brand_color: string; // hex color
  priority: number;
  is_active: boolean;
}

export interface Country {
  iso_code: string;
  name: string;
  phone_prefix: string;
  is_active: boolean;
}


export interface FundingMethodsResponse {
  success: true;
  country: Country;
  funding_methods: PaymentMethod[];
  count: number;
}


export interface CorridorFees {
  fixed: string;       // decimal string
  percentage: string;  // decimal string
}

export interface CorridorLimits {
  min: string; // decimal string
  max: string; // decimal string
}

export interface Destination {
  country_code: string;     // ISO-2
  country_name: string;
  country_flag: string;     // emoji flag
  corridor_id: number;

  fees: CorridorFees;
  limits: CorridorLimits;

  payout_methods: PaymentMethod[];
}


export interface DestinationsResponse {
  success: true;
  source_country: Country;
  destinations: Destination[];
  total_destinations: number;
}



// Payment method types
export type FundingMethod = {
  id: number;
  method_type: string;
  method_type_display: string;
  mobile_provider: string;
  mobile_provider_display: string;
  card_scheme: string;
  icon_url: string;
  brand_color: string;
  is_active: boolean;
};

export type PayoutMethod = {
  id: number;
  method_type: string;
  method_type_display: string;
  mobile_provider: string;
  mobile_provider_display: string;
  icon_url: string;
  brand_color: string;
  is_active: boolean;
};

// Country types
export type SourceCountry = {
  iso_code: string;
  name: string;
  phone_prefix: string;
};

export type DestinationData = {
  country_code: string;
  country_name: string;
  country_flag: string;
  corridor_id: number;
  is_active: boolean;
  funding_methods: FundingMethod[];
  payout_methods: PayoutMethod[];
};

// export type Destination = {
//   country_code: string;
//   country_name: string;
//   country_flag: string;
//   corridor_id: number;
//   is_active: boolean;
//   funding_methods: FundingMethod[];
//   payout_methods: PayoutMethod[];
// };


// API response types
export type CountriesResponse = {
  success: boolean;
  data: {
    source_country: SourceCountry;
    destinations: Destination[];
    total_destinations: number;
  };
};