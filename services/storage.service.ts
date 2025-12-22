import * as SecureStore from 'expo-secure-store';

class StorageService {
  
  // Save item securely
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      throw error;
    }
  }

  // Get item
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  }

  // Remove item
  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  }

  // Save tokens
  async saveTokens(access: string, refresh: string): Promise<void> {
    await this.setItem('accessToken', access);
    await this.setItem('refreshToken', refresh);
  }

  // Get tokens
  async getTokens(): Promise<{ access: string | null; refresh: string | null }> {
    const access = await this.getItem('accessToken');
    const refresh = await this.getItem('refreshToken');
    return { access, refresh };
  }

  // Save user
  async saveUser(user: any): Promise<void> {
    await this.setItem('user', JSON.stringify(user));
  }

  // Get user
  async getUser(): Promise<any | null> {
    const userJson = await this.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  // Clear all auth data
  async clearAuth(): Promise<void> {
    await this.removeItem('accessToken');
    await this.removeItem('refreshToken');
    await this.removeItem('user');
    await this.removeItem('biometricEnabled');
  }

  // Biometric
  async setBiometricEnabled(enabled: boolean): Promise<void> {
    await this.setItem('biometricEnabled', enabled.toString());
  }

  async isBiometricEnabled(): Promise<boolean> {
    const value = await this.getItem('biometricEnabled');
    return value === 'true';
  }
}

export default new StorageService();
