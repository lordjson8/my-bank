import api from "./api";
import { AxiosResponse } from "axios";
import { 
    RegisterData, RegisterResponse, LoginData, LoginResponse, 
    User, UpdateProfileData, OTPVerifyData, VerifyEmailResponse, 
    ResendOTPData, ResetPasswordData, ChangePasswordData, 
    KYCProfile, KYCProfileData, KYCDocument 
} from "@/types/auth.types";

// ============================================================================
// USER AUTHENTICATION SERVICES
// ============================================================================

/**
 * Register a new user.
 * @param data - Registration data.
 * @returns The registration response.
 */
export const register = (data: RegisterData): Promise<AxiosResponse<RegisterResponse>> => {
    return api.post("/auth/register/", data);
};

/**
 * Login a user.
 * @param data - Login credentials.
 * @returns The login response with user data and tokens.
 */
export const login = (data: LoginData): Promise<AxiosResponse<LoginResponse>> => {
    return api.post("/auth/login/", data);
};

/**
 * Logout a user by blacklisting the refresh token.
 * @param data - The refresh token.
 * @returns The logout response.
 */
export const logout = (data: { refresh: string }): Promise<AxiosResponse<any>> => {
    return api.post("/auth/logout/", data);
};

/**
 * Get the authenticated user's profile.
 * @returns The user's profile data.
 */
export const getMe = (): Promise<AxiosResponse<User>> => {
    return api.get("/auth/me/");
};

/**
 * Update the authenticated user's profile.
 * @param data - The profile data to update.
 * @returns The updated user profile.
 */
export const updateProfile = (data: UpdateProfileData): Promise<AxiosResponse<User>> => {
    return api.patch("/auth/profile/", data);
};

/**
 * Verify email with an OTP.
 * @param data - The OTP verification data.
 * @returns The verification response.
 */
export const verifyEmail = (data: OTPVerifyData): Promise<AxiosResponse<VerifyEmailResponse>> => {
    return api.post("/auth/verify-email/", data);
};

/**
 * Resend an OTP.
 * @param data - The resend OTP request data.
 * @returns The resend OTP response.
 */
export const resendOTP = (data: ResendOTPData): Promise<AxiosResponse<any>> => {
    return api.post("/auth/resend-otp/", data);
};

/**
 * Request a password reset email.
 * @param data - The user's email.
 * @returns The request response.
 */
export const requestPasswordReset = (data: { email: string }): Promise<AxiosResponse<any>> => {
    return api.post("/auth/password/request-reset/", data);
};

/**
 * Verify a password reset token.
 * @param data - The password reset token.
 * @returns The verification response.
 */
export const verifyPasswordResetToken = (data: { token: string }): Promise<AxiosResponse<any>> => {
    return api.post("/auth/password/verify-token/", data);
};

/**
 * Reset the password using a token.
 * @param data - The reset password data.
 * @returns The reset password response.
 */
export const resetPassword = (data: ResetPasswordData): Promise<AxiosResponse<any>> => {
    return api.post("/auth/password/reset/", data);
};

/**
 * Change the authenticated user's password.
 * @param data - The change password data.
 * @returns The change password response.
 */
export const changePassword = (data: ChangePasswordData): Promise<AxiosResponse<any>> => {
    return api.post("/auth/password/change/", data);
};


// ============================================================================
// KYC SERVICES
// ============================================================================

/**
 * Get the user's KYC profile.
 * @returns The KYC profile data.
 */
export const getKYCProfile = (): Promise<AxiosResponse<KYCProfile>> => {
    return api.get("/kyc/profile/");
};

/**
 * Create or update the user's KYC profile.
 * @param data - The KYC profile data.
 * @returns The updated KYC profile.
 */
export const createOrUpdateKYCProfile = (data: KYCProfileData): Promise<AxiosResponse<KYCProfile>> => {
    return api.post("/kyc/profile/", data);
};

/**
 * Upload a KYC document.
 * @param data - The form data containing the document.
 * @returns The upload response.
 */
export const uploadKYCDocument = (data: FormData): Promise<AxiosResponse<any>> => {
    return api.post("/kyc/documents/upload/", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

/**
 * Get a list of the user's KYC documents.
 * @returns A list of KYC documents.
 */
export const getKYCDocuments = (): Promise<AxiosResponse<KYCDocument[]>> => {
    return api.get("/kyc/documents/");
};

/**
 * Get the user's KYC verification status.
 * @returns The KYC status.
 */
export const getKYCStatus = (): Promise<AxiosResponse<any>> => {
    return api.get("/kyc/status/");
};

/**
 * Get the requirements for the next KYC level.
 * @param data - The target KYC level.
 * @returns The level requirements.
 */
export const getKYCLevelRequirements = (data: { target_level: string }): Promise<AxiosResponse<any>> => {
    return api.post("/kyc/level-requirements/", data);
};

/**
 * Check the completeness of a KYC document upload.
 * @param data - The document type.
 * @returns The completeness status.
 */
export const checkKYCDocumentCompleteness = (data: { document_type: string }): Promise<AxiosResponse<any>> => {
    return api.post("/kyc/documents/completeness/", data);
};
