export interface User {
  id: number;
  email: string;
  phone: string;
  full_name: string;
  country: string;
  email_verified: boolean;
  phone_verified: boolean;
  kyc_status: 'pending' | 'submitted' | 'approved' | 'rejected';
  kyc_level: 'none' | 'basic' | 'advanced';
  two_factor_enabled: boolean;
  is_verified: boolean;
  can_transfer: boolean;
  daily_limit: string;
  transaction_limit: string;
  created_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface RegisterRequest {
  email: string;
  phone: string;
  password: string;
  full_name: string;
  country: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user_id: number;
    email: string;
    phone: string;
    email_masked: string;
    phone_masked: string;
    requires_verification: boolean;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
  device_id: string;
  device_name?: string;
  device_type?: 'ios' | 'android';
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  requires_2fa?: boolean;
  data?: {
    user_id?: number;
    phone_masked?: string;
    user?: User;
    tokens?: AuthTokens;
  };
}

export interface VerifyOTPRequest {
  user_id: number;
  otp: string;
  otp_type: 'email_verification' | 'phone_verification' | 'login_2fa';
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  data: {
    email_verified?: boolean;
    phone_verified?: boolean;
    account_active: boolean;
    tokens?: AuthTokens;
    user?: User;
  };
}

export interface BiometricSetupRequest {
  device_id: string;
  public_key: string;
  algorithm: 'RSA-2048' | 'ECDSA-P256';
}

export interface BiometricChallengeResponse {
  success: boolean;
  data: {
    challenge_id: string;
    challenge: string;
    expires_at: string;
  };
}

export interface BiometricVerifyRequest {
  challenge_id: string;
  signature: string;
  device_id: string;
}

export interface ApiError {
  success: false;
  error: string | Record<string, string[]>;
}
