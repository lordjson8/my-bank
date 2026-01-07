import * as Device from 'expo-device';
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';
import {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  BiometricSetupRequest,
  BiometricChallengeResponse,
  BiometricVerifyRequest,
  User,
  ApiError,
} from '../types/auth.types';
import apiService from './old/api.service';
import storageService from './storage.service';

class AuthService {
  
  // ========================================
  // REGISTRATION
  // ========================================
  
  async register(data: RegisterRequest): Promise<RegisterResponse | ApiError> {
    try {
      const response = await apiService.post<RegisterResponse>('/auth/register/', data);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed',
      };
    }
  }

  // ========================================
  // OTP VERIFICATION
  // ========================================
  
  async verifyEmail(userId: number, otp: string): Promise<VerifyOTPResponse | ApiError> {
    try {
      const response = await apiService.post<VerifyOTPResponse>('/auth/verify-email/', {
        user_id: userId,
        otp,
        otp_type: 'email_verification',
      });
      
      // Save tokens if account is active
      if (response.data.account_active && response.data.tokens) {
        await storageService.saveTokens(
          response.data.tokens.access,
          response.data.tokens.refresh
        );
        
        if (response.data.user) {
          await storageService.saveUser(response.data.user);
        }
      }
      
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Email verification failed',
      };
    }
  }

  async verifyPhone(userId: number, otp: string): Promise<VerifyOTPResponse | ApiError> {
    try {
      const response = await apiService.post<VerifyOTPResponse>('/auth/verify-phone/', {
        user_id: userId,
        otp,
        otp_type: 'phone_verification',
      });
      
      // Save tokens if account is active
      if (response.data.account_active && response.data.tokens) {
        await storageService.saveTokens(
          response.data.tokens.access,
          response.data.tokens.refresh
        );
        
        if (response.data.user) {
          await storageService.saveUser(response.data.user);
        }
      }
      
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Phone verification failed',
      };
    }
  }

  async resendOTP(
    userId: number,
    type: 'email_verification' | 'phone_verification'
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await apiService.post<{message: string}>('/auth/resend-otp/', {
        user_id: userId,
        otp_type: type,
      });
      
      return {
        success: true,
        message: response.message,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to resend OTP',
      };
    }
  }

  // ========================================
  // LOGIN
  // ========================================
  
  async login(email: string, password: string): Promise<LoginResponse | ApiError> {
    try {
      const deviceId = Device.osBuildId || 'unknown';
      const deviceName = Device.deviceName || 'Unknown Device';
      const deviceType = Platform.OS as 'ios' | 'android';
      
      const response = await apiService.post<LoginResponse>('/auth/login/', {
        email,
        password,
        device_id: deviceId,
        device_name: deviceName,
        device_type: deviceType,
      });
      
      // Check if 2FA required
      if (response.requires_2fa) {
        return response;
      }
      
      // Save tokens and user
      if (response.data?.tokens) {
        await storageService.saveTokens(
          response.data.tokens.access,
          response.data.tokens.refresh
        );
      }
      
      if (response.data?.user) {
        await storageService.saveUser(response.data.user);
      }
      
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  }

  async verify2FA(userId: number, otp: string): Promise<LoginResponse | ApiError> {
    try {
      const deviceId = Device.osBuildId || 'unknown';
      
      const response = await apiService.post<LoginResponse>('/auth/verify-2fa/', {
        user_id: userId,
        otp,
        otp_type: 'login_2fa',
        device_id: deviceId,
      });
      
      // Save tokens and user
      if (response.data?.tokens) {
        await storageService.saveTokens(
          response.data.tokens.access,
          response.data.tokens.refresh
        );
      }
      
      if (response.data?.user) {
        await storageService.saveUser(response.data.user);
      }
      
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || '2FA verification failed',
      };
    }
  }

  // ========================================
  // BIOMETRIC AUTHENTICATION
  // ========================================
  
  async isBiometricAvailable(): Promise<boolean> {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return compatible && enrolled;
  }

  async authenticateWithBiometric(promptMessage: string = 'Authenticate to continue'): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: 'Use password',
        cancelLabel: 'Cancel',
      });
      
      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  }

  async setupBiometric(publicKey: string, algorithm: 'RSA-2048' | 'ECDSA-P256' = 'RSA-2048'): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const deviceId = Device.osBuildId || 'unknown';
      
      await apiService.post('/auth/biometric/setup/', {
        device_id: deviceId,
        public_key: publicKey,
        algorithm,
      });
      
      await storageService.setBiometricEnabled(true);
      
      return {
        success: true,
        message: 'Biometric authentication enabled',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Biometric setup failed',
      };
    }
  }

  async biometricLogin(): Promise<LoginResponse | ApiError> {
    try {
      // Step 1: Authenticate with biometric
      const authenticated = await this.authenticateWithBiometric('Login with biometric');
      
      if (!authenticated) {
        return {
          success: false,
          error: 'Biometric authentication cancelled',
        };
      }

      const deviceId = Device.osBuildId || 'unknown';
      
      // Step 2: Request challenge
      const challengeResponse = await apiService.post<BiometricChallengeResponse>(
        '/auth/biometric/challenge/',
        { device_id: deviceId }
      );
      
      const { challenge_id, challenge } = challengeResponse.data;
      
      // Step 3: Sign challenge (simplified - in production use actual cryptographic signing)
      const signature = await this.signChallenge(challenge);
      
      // Step 4: Verify signature
      const verifyResponse = await apiService.post<LoginResponse>('/auth/biometric/verify/', {
        challenge_id,
        signature,
        device_id: deviceId,
      });
      
      // Save tokens
      if (verifyResponse.data?.tokens) {
        await storageService.saveTokens(
          verifyResponse.data.tokens.access,
          verifyResponse.data.tokens.refresh
        );
      }
      
      if (verifyResponse.data?.user) {
        await storageService.saveUser(verifyResponse.data.user);
      }
      
      return verifyResponse;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Biometric login failed',
      };
    }
  }

  private async signChallenge(challenge: string): Promise<string> {
    // TODO: Implement actual cryptographic signing
    // For now, return base64 encoded challenge
    return Buffer.from(challenge).toString('base64');
  }

  // ========================================
  // LOGOUT
  // ========================================
  
  async logout(): Promise<void> {
    try {
      const { refresh } = await storageService.getTokens();
      
      if (refresh) {
        await apiService.post('/auth/logout/', { refresh });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local storage
      await storageService.clearAuth();
    }
  }

  // ========================================
  // UTILITY
  // ========================================
  
  async isAuthenticated(): Promise<boolean> {
    const { access } = await storageService.getTokens();
    return !!access;
  }

  async getCurrentUser(): Promise<User | null> {
    return await storageService.getUser();
  }
}

export default new AuthService();
