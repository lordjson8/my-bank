// my-bank/types/auth.types.ts

export interface RegisterData {
    email: string;
    phone: string;
    password?: string;
    full_name?: string;
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

export interface LoginData {
    email: string;
    password?: string;
    device_id: string;
    device_name?: string;
    device_type?: 'ios' | 'android';
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        tokens: {
            refresh: string;
            access: string;
        };
    };
}

export interface User {
    id: number;
    email: string;
    phone: string;
    national_number: string;
    country_name: string;
    full_name: string;
    country: string;
    email_verified: boolean;
    phone_verified: boolean;
    kyc_status: string;
    kyc_level: string;
    has_kyc_profile: boolean;
    two_factor_enabled: boolean;
    is_verified: boolean;
    transaction_limits: any;
    created_at: string;
}

export interface UpdateProfileData {
    full_name?: string;
    country?: string;
    kyc_profile?: KYCProfileData;
}

export interface OTPVerifyData {
    user_id: number;
    otp: string;
    otp_type: 'email_verification' | 'phone_verification' | 'login_2fa' | 'transfer_confirmation';
}

export interface VerifyEmailResponse {
    success: boolean;
    message: string;
    data: {
        email_verified: boolean;
        phone_verified: boolean;
        account_active: boolean;
        tokens: {
            refresh: string;
            access: string;
        } | null;
        user: User | null;
    };
}

export interface ResendOTPData {
    user_id: number;
    otp_type: 'email_verification' | 'phone_verification';
}

export interface ResetPasswordData {
    token: string;
    password?: string;
}

export interface ChangePasswordData {
    current_password?: string;
    new_password?: string;
}

export interface KYCProfile {
    // Define based on KYCProfileSerializer
    id: number;
    first_name: string;
    last_name: string;
    middle_name?: string;
    date_of_birth: string;
    gender: string;
    nationality: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state_province: string;
    postal_code: string;
    country: string;
    kyc_level: string;
    verification_status: string;
    is_verified: boolean;
    documents: KYCDocument[];
    // Add other fields as necessary
}

export interface KYCProfileData {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: 'male' | 'female';
    nationality: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state_province: string;
    postal_code: string;
    country: string;
}

export interface KYCDocument {
    id: number;
    document_type: string;
    document_type_display: string;
    document_side: string;
    document_side_display: string;
    document_number: string;
    issue_date: string;
    expiry_date: string;
    is_expired: boolean;
    status: string;
    status_display: string;
    requires_selfie: boolean;
    created_at: string;
}