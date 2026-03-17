# Local Authentication & Secure Storage — Production Guide

> Stack: **Expo SDK 54** · `expo-local-authentication ~17.0.7` · `expo-secure-store ^15.0.7` · React Native

---

## Table of Contents

1. [Auth Landscape — What's Available](#1-auth-landscape--whats-available)
2. [expo-local-authentication — Deep Dive](#2-expo-local-authentication--deep-dive)
3. [Authentication Patterns](#3-authentication-patterns)
4. [App Lock (Lock on Background)](#4-app-lock-lock-on-background)
5. [Confirm-Before-Action Pattern](#5-confirm-before-action-pattern)
6. [expo-secure-store — Encrypted Storage](#6-expo-secure-store--encrypted-storage)
7. [Storing Sensitive Data — Decision Table](#7-storing-sensitive-data--decision-table)
8. [PIN / Passcode Implementation](#8-pin--passcode-implementation)
9. [Full useLocalAuth Hook](#9-full-uselocalauth-hook)
10. [Security Checklist](#10-security-checklist)

---

## 1. Auth Landscape — What's Available

```
┌────────────────────────────────────────────────────────────────────┐
│  LOCAL AUTHENTICATION METHODS                                      │
│                                                                    │
│  expo-local-authentication                                         │
│  ├── Biometrics                                                    │
│  │   ├── Face ID (iOS, iPhone X+)                                  │
│  │   ├── Touch ID (iOS, older iPhones + MacOS)                     │
│  │   └── Fingerprint (Android)                                     │
│  │       Face recognition (Android)                                │
│  │       Iris (Samsung)                                            │
│  └── Device Passcode / PIN (fallback)                             │
│                                                                    │
│  Custom in-app PIN (your own UI + SecureStore)                    │
│                                                                    │
│  Combined: biometric prompt → fallback to in-app PIN              │
└────────────────────────────────────────────────────────────────────┘
```

**Rule of thumb:**
- Use **device biometrics** for authentication — it's hardware-backed and requires zero UI from you.
- Use **in-app PIN** as fallback when biometrics aren't available or enrolled.
- Use **SecureStore** for any data that would be harmful if extracted (tokens, keys, PINs).

---

## 2. expo-local-authentication — Deep Dive

### 2.1 Checking device capability

```ts
import * as LocalAuthentication from "expo-local-authentication";

export type BiometricCapability = {
  hasHardware: boolean;         // device has biometric sensor
  isEnrolled: boolean;          // user has enrolled at least one fingerprint/face
  types: LocalAuthentication.AuthenticationType[];
  supportedLevel: LocalAuthentication.SecurityLevel;
};

export async function getBiometricCapability(): Promise<BiometricCapability> {
  const [hasHardware, isEnrolled, types, supportedLevel] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
    LocalAuthentication.supportedAuthenticationTypesAsync(),
    LocalAuthentication.getEnrolledLevelAsync(),
  ]);

  return { hasHardware, isEnrolled, types, supportedLevel };
}

// AuthenticationType values:
// 1 → FINGERPRINT
// 2 → FACIAL_RECOGNITION
// 3 → IRIS

// SecurityLevel values:
// 0 → NONE
// 1 → SECRET (PIN/pattern/password only)
// 2 → BIOMETRIC_WEAK (face unlock that can be spoofed)
// 3 → BIOMETRIC_STRONG (hardware-backed, hardened)
```

> **Always check both `hasHardware` AND `isEnrolled`.** A device can have a fingerprint sensor but no enrolled prints — calling `authenticateAsync` in that state causes an error.

### 2.2 Biometric label — show the right icon/text to the user

```ts
import { AuthenticationType } from "expo-local-authentication";

export function getBiometricLabel(types: AuthenticationType[]): string {
  if (types.includes(AuthenticationType.FACIAL_RECOGNITION)) return "Face ID";
  if (types.includes(AuthenticationType.FINGERPRINT)) return "Fingerprint";
  if (types.includes(AuthenticationType.IRIS)) return "Iris scan";
  return "Biometrics";
}

export function getBiometricIcon(types: AuthenticationType[]): string {
  if (types.includes(AuthenticationType.FACIAL_RECOGNITION)) return "scan-face";
  if (types.includes(AuthenticationType.FINGERPRINT)) return "fingerprint";
  return "shield-check";
}
```

### 2.3 Triggering authentication

```ts
import * as LocalAuthentication from "expo-local-authentication";

export type AuthResult =
  | { success: true }
  | { success: false; reason: "not_available" | "not_enrolled" | "cancelled" | "failed" | "lockout" };

export async function authenticateWithBiometrics(options?: {
  promptMessage?: string;
  cancelLabel?: string;
  fallbackLabel?: string;   // iOS only — label for "Use Passcode" fallback
  disableDeviceFallback?: boolean;
}): Promise<AuthResult> {
  const { hasHardware, isEnrolled } = await getBiometricCapability();

  if (!hasHardware) return { success: false, reason: "not_available" };
  if (!isEnrolled) return { success: false, reason: "not_enrolled" };

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: options?.promptMessage ?? "Confirm your identity",
    cancelLabel: options?.cancelLabel ?? "Cancel",
    fallbackLabel: options?.fallbackLabel ?? "Use passcode",
    disableDeviceFallback: options?.disableDeviceFallback ?? false,
    // requireConfirmation: true → user must press confirm after scan (Android only)
    // Useful for high-stakes actions like sending money
    requireConfirmation: false,
  });

  if (result.success) return { success: true };

  // Map error codes
  switch (result.error) {
    case "user_cancel":
    case "system_cancel":
    case "app_cancel":
      return { success: false, reason: "cancelled" };

    case "lockout":
    case "lockout_permanent":
      return { success: false, reason: "lockout" };

    default:
      return { success: false, reason: "failed" };
  }
}
```

---

## 3. Authentication Patterns

### Pattern A — Login gate (on app open)

```ts
// Only unlock if the user previously enabled biometrics in settings
// Don't force biometrics without user consent

export async function unlockApp(userId: string): Promise<boolean> {
  const biometricEnabled = await SecureStore.getItemAsync(`biometric_enabled_${userId}`);
  if (biometricEnabled !== "true") return true; // biometrics not set up — allow through

  const result = await authenticateWithBiometrics({
    promptMessage: "Unlock Chic Transfer",
  });

  return result.success;
}
```

### Pattern B — Elevate for sensitive action (not blocking the whole app)

```ts
// Only challenge for high-stakes actions
export async function confirmWithBiometrics(action: string): Promise<boolean> {
  const result = await authenticateWithBiometrics({
    promptMessage: `Confirm: ${action}`,
    requireConfirmation: true, // Android — requires explicit confirm tap
    disableDeviceFallback: false, // allow PIN as fallback
  });

  return result.success;
}

// Usage
const confirmed = await confirmWithBiometrics("Send $500 to Jean Dupont");
if (!confirmed) return; // abort transfer
```

### Pattern C — Progressive trust (no repeated prompts)

```ts
// Grant a short-lived trust window after successful auth
// So the user isn't prompted again 30 seconds later

let lastAuthTime: number | null = null;
const TRUST_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

export async function authenticateIfNeeded(): Promise<boolean> {
  const now = Date.now();
  if (lastAuthTime && now - lastAuthTime < TRUST_WINDOW_MS) {
    return true; // still within trust window
  }

  const result = await authenticateWithBiometrics({
    promptMessage: "Confirm your identity",
  });

  if (result.success) {
    lastAuthTime = now;
    return true;
  }

  return false;
}
```

---

## 4. App Lock (Lock on Background)

Lock the app when it goes to the background and require biometrics to resume.

```ts
// hooks/useAppLock.ts
import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import * as SecureStore from "expo-secure-store";
import { authenticateWithBiometrics } from "@/services/local-auth.service";

const LOCK_TIMEOUT_MS = 60 * 1000; // 1 minute in background → lock

export function useAppLock(userId: string | null) {
  const [isLocked, setIsLocked] = useState(false);
  const backgroundTime = useRef<number | null>(null);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (!userId) return;

    const sub = AppState.addEventListener("change", handleAppStateChange);
    return () => sub.remove();
  }, [userId]);

  async function handleAppStateChange(nextState: AppStateStatus) {
    const prev = appState.current;
    appState.current = nextState;

    // App going to background
    if (nextState.match(/inactive|background/)) {
      backgroundTime.current = Date.now();
      return;
    }

    // App coming back to foreground
    if (prev.match(/inactive|background/) && nextState === "active") {
      const biometricEnabled = await SecureStore.getItemAsync(`biometric_enabled_${userId}`);
      if (biometricEnabled !== "true") return;

      const elapsed = Date.now() - (backgroundTime.current ?? 0);
      if (elapsed >= LOCK_TIMEOUT_MS) {
        setIsLocked(true);
        await unlock();
      }
    }
  }

  async function unlock() {
    const result = await authenticateWithBiometrics({
      promptMessage: "Unlock Chic Transfer",
    });

    if (result.success) {
      setIsLocked(false);
    } else if (result.reason === "lockout") {
      // Device lockout — show PIN fallback
      // fall through to your PIN screen
    }
    // If user cancels, keep locked — don't show the app
  }

  return { isLocked, unlock };
}
```

```tsx
// app/_layout.tsx
export default function RootLayout() {
  const { user } = useAuthStore();
  const { isLocked } = useAppLock(user?.id ?? null);

  if (isLocked) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <LockScreen />
      </View>
    );
  }

  return <Slot />;
}
```

---

## 5. Confirm-Before-Action Pattern

High-stakes actions (send money, change password, delete account) should always require re-authentication.

```tsx
// hooks/useConfirmAction.ts
import { useCallback } from "react";
import { Alert } from "react-native";
import { authenticateWithBiometrics } from "@/services/local-auth.service";

export function useConfirmAction() {
  const confirmWithBiometrics = useCallback(async (
    actionLabel: string,
    onConfirmed: () => Promise<void> | void
  ) => {
    const result = await authenticateWithBiometrics({
      promptMessage: actionLabel,
      requireConfirmation: true,
    });

    if (result.success) {
      await onConfirmed();
      return;
    }

    if (result.reason === "not_available" || result.reason === "not_enrolled") {
      // Fall back to PIN confirmation dialog
      // (see Section 8 for PIN implementation)
      Alert.alert("Confirm action", `Are you sure you want to ${actionLabel.toLowerCase()}?`, [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: () => onConfirmed() },
      ]);
    }
  }, []);

  return { confirmWithBiometrics };
}

// Usage in transfer screen
const { confirmWithBiometrics } = useConfirmAction();

async function handleSendMoney() {
  await confirmWithBiometrics(`Send $${amount} to ${recipient}`, async () => {
    await transferService.send({ amount, recipient });
    router.push("/transfer-result");
  });
}
```

---

## 6. expo-secure-store — Encrypted Storage

SecureStore is backed by:
- **iOS**: Keychain Services (hardware-encrypted, excluded from iCloud backups by default)
- **Android**: Android Keystore System (hardware-backed on devices with Secure Element)

```ts
// services/secure-storage.service.ts
import * as SecureStore from "expo-secure-store";

// Options for maximum security
const SECURE_OPTIONS: SecureStore.SecureStoreOptions = {
  // Require biometric authentication to read this value (iOS only)
  requireAuthentication: false, // set true only for highest-sensitivity data

  // Only accessible when device is unlocked
  keychainAccessible: SecureStore.WHEN_UNLOCKED,

  // Don't sync to iCloud Keychain (keep on device only)
  keychainService: "com.chictransfer.secure",
};

export const secureStorage = {
  async set(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value, SECURE_OPTIONS);
  },

  async get(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(key, SECURE_OPTIONS);
  },

  async delete(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key, SECURE_OPTIONS);
  },

  // For JSON objects
  async setJSON<T>(key: string, value: T): Promise<void> {
    await SecureStore.setItemAsync(key, JSON.stringify(value), SECURE_OPTIONS);
  },

  async getJSON<T>(key: string): Promise<T | null> {
    const raw = await SecureStore.getItemAsync(key, SECURE_OPTIONS);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
};
```

### Keychainservice options explained

```ts
// When is this value accessible?
SecureStore.WHEN_UNLOCKED              // Only when device is actively unlocked (default)
SecureStore.WHEN_UNLOCKED_THIS_DEVICE  // Same + not in iCloud backup
SecureStore.AFTER_FIRST_UNLOCK         // Accessible after device rebooted AND first unlock
                                       // Needed for background tasks that need to read tokens
SecureStore.ALWAYS                     // Even when device is locked (avoid this)
SecureStore.ALWAYS_THIS_DEVICE         // Same, no iCloud (avoid unless you have a reason)
```

> **For auth tokens**: use `AFTER_FIRST_UNLOCK` if your app uses background tasks that need the token. Otherwise `WHEN_UNLOCKED`.

---

## 7. Storing Sensitive Data — Decision Table

| Data | Where to store | Notes |
|------|---------------|-------|
| JWT / refresh token | `SecureStore` | Never in AsyncStorage or MMKV |
| Biometric enabled flag | `SecureStore` | It's a preference tied to a user |
| In-app PIN (hashed) | `SecureStore` | Store bcrypt/Argon2 hash, never plaintext |
| User preferences (theme, language) | `AsyncStorage` or Zustand persist | Not sensitive |
| Transaction history cache | `AsyncStorage` or SQLite | Paginated, not sensitive |
| Encryption keys | `SecureStore` with `requireAuthentication: true` | iOS only |
| Photos / documents | `expo-file-system` + encrypted folder | KYC docs |
| Device push token | `SecureStore` | Regenerate on login |

---

## 8. PIN / Passcode Implementation

```ts
// services/pin.service.ts
// Use when biometrics are unavailable or as a fallback
import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";

const PIN_KEY = (userId: string) => `app_pin_${userId}`;
const PIN_ATTEMPTS_KEY = (userId: string) => `pin_attempts_${userId}`;
const MAX_ATTEMPTS = 5;

export async function setPin(userId: string, pin: string): Promise<void> {
  // Hash the PIN — never store it plaintext
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    pin + userId // salt with userId to prevent rainbow table attacks
  );
  await SecureStore.setItemAsync(PIN_KEY(userId), hash);
  await SecureStore.setItemAsync(PIN_ATTEMPTS_KEY(userId), "0");
}

export async function verifyPin(userId: string, pin: string): Promise<{
  success: boolean;
  remainingAttempts?: number;
  locked?: boolean;
}> {
  const attemptsStr = await SecureStore.getItemAsync(PIN_ATTEMPTS_KEY(userId));
  const attempts = parseInt(attemptsStr ?? "0", 10);

  if (attempts >= MAX_ATTEMPTS) {
    return { success: false, locked: true, remainingAttempts: 0 };
  }

  const storedHash = await SecureStore.getItemAsync(PIN_KEY(userId));
  if (!storedHash) return { success: false };

  const inputHash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    pin + userId
  );

  if (inputHash === storedHash) {
    await SecureStore.setItemAsync(PIN_ATTEMPTS_KEY(userId), "0");
    return { success: true };
  }

  const newAttempts = attempts + 1;
  await SecureStore.setItemAsync(PIN_ATTEMPTS_KEY(userId), String(newAttempts));
  return {
    success: false,
    remainingAttempts: MAX_ATTEMPTS - newAttempts,
    locked: newAttempts >= MAX_ATTEMPTS,
  };
}

export async function hasPin(userId: string): Promise<boolean> {
  const hash = await SecureStore.getItemAsync(PIN_KEY(userId));
  return !!hash;
}

export async function clearPin(userId: string): Promise<void> {
  await SecureStore.deleteItemAsync(PIN_KEY(userId));
  await SecureStore.deleteItemAsync(PIN_ATTEMPTS_KEY(userId));
}
```

### PIN input UI

```tsx
// components/PinInput.tsx
import { useRef, useState } from "react";
import { TextInput, View, Text, Pressable } from "react-native";

interface PinInputProps {
  length?: number;
  onComplete: (pin: string) => void;
  error?: string;
}

export function PinInput({ length = 6, onComplete, error }: PinInputProps) {
  const [pin, setPin] = useState("");
  const inputRef = useRef<TextInput>(null);

  function handleChange(text: string) {
    const digits = text.replace(/\D/g, "").slice(0, length);
    setPin(digits);
    if (digits.length === length) {
      onComplete(digits);
    }
  }

  return (
    <Pressable onPress={() => inputRef.current?.focus()} className="items-center gap-6">
      {/* Hidden real input */}
      <TextInput
        ref={inputRef}
        value={pin}
        onChangeText={handleChange}
        keyboardType="numeric"
        maxLength={length}
        secureTextEntry
        autoFocus
        className="absolute opacity-0 w-0 h-0"
      />

      {/* Visible dots */}
      <View className="flex-row gap-4">
        {Array.from({ length }).map((_, i) => (
          <View
            key={i}
            className={`w-4 h-4 rounded-full ${
              i < pin.length ? "bg-primary" : "border-2 border-muted-foreground"
            }`}
          />
        ))}
      </View>

      {error && <Text className="text-destructive text-sm">{error}</Text>}
    </Pressable>
  );
}
```

---

## 9. Full useLocalAuth Hook

```ts
// hooks/useLocalAuth.ts
import { useCallback, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import {
  getBiometricCapability,
  authenticateWithBiometrics,
  getBiometricLabel,
  type AuthResult,
} from "@/services/local-auth.service";
import { hasPin, verifyPin } from "@/services/pin.service";
import { useAuthStore } from "@/store/authStore";

type LocalAuthState = {
  biometricAvailable: boolean;
  biometricEnabled: boolean;
  biometricLabel: string;
  pinEnabled: boolean;
  loading: boolean;
};

export function useLocalAuth() {
  const { user } = useAuthStore();
  const [state, setState] = useState<LocalAuthState>({
    biometricAvailable: false,
    biometricEnabled: false,
    biometricLabel: "Biometrics",
    pinEnabled: false,
    loading: true,
  });

  useEffect(() => {
    if (!user) return;
    loadCapabilities();
  }, [user]);

  async function loadCapabilities() {
    if (!user) return;
    const cap = await getBiometricCapability();
    const biometricEnabled = await SecureStore.getItemAsync(`biometric_enabled_${user.id}`);
    const pinEnabled = await hasPin(user.id);

    setState({
      biometricAvailable: cap.hasHardware && cap.isEnrolled,
      biometricEnabled: biometricEnabled === "true",
      biometricLabel: getBiometricLabel(cap.types),
      pinEnabled,
      loading: false,
    });
  }

  const enableBiometrics = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    // Verify once before enabling, so they can't enable it for someone else's device
    const result = await authenticateWithBiometrics({ promptMessage: "Enable biometric login" });
    if (result.success) {
      await SecureStore.setItemAsync(`biometric_enabled_${user.id}`, "true");
      setState((s) => ({ ...s, biometricEnabled: true }));
    }
    return result.success;
  }, [user]);

  const disableBiometrics = useCallback(async () => {
    if (!user) return;
    await SecureStore.deleteItemAsync(`biometric_enabled_${user.id}`);
    setState((s) => ({ ...s, biometricEnabled: false }));
  }, [user]);

  const authenticate = useCallback(async (promptMessage?: string): Promise<AuthResult> => {
    if (!user) return { success: false, reason: "not_available" };

    if (state.biometricAvailable && state.biometricEnabled) {
      return authenticateWithBiometrics({ promptMessage });
    }

    if (state.pinEnabled) {
      // Return a special result to let the UI show the PIN screen
      return { success: false, reason: "not_enrolled" }; // caller shows PIN modal
    }

    return { success: false, reason: "not_available" };
  }, [user, state]);

  return {
    ...state,
    enableBiometrics,
    disableBiometrics,
    authenticate,
    reload: loadCapabilities,
  };
}
```

---

## 10. Security Checklist

| # | Check | Status |
|---|-------|--------|
| 1 | JWT tokens stored in `SecureStore`, never `AsyncStorage` | ☐ |
| 2 | PIN stored as hash (SHA-256 + user salt), never plaintext | ☐ |
| 3 | Biometric available check before `authenticateAsync` call | ☐ |
| 4 | App locks after configurable timeout in background | ☐ |
| 5 | High-stakes actions require biometric re-auth | ☐ |
| 6 | PIN lockout after N failed attempts | ☐ |
| 7 | Biometric enrollment is user opt-in, not forced | ☐ |
| 8 | Biometric preference stored in `SecureStore` (not AsyncStorage) | ☐ |
| 9 | Secure store keys are namespaced per user (`key_${userId}`) | ☐ |
| 10 | App content blurred/hidden when entering background (`<PrivacyScreen>`) | ☐ |

### Privacy screen (blur app content in recent apps switcher)

```tsx
// components/PrivacyScreen.tsx
import { useEffect, useState } from "react";
import { AppState, View, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

export function PrivacyScreen({ children }: { children: React.ReactNode }) {
  const [isBackground, setIsBackground] = useState(false);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      setIsBackground(state !== "active");
    });
    return () => sub.remove();
  }, []);

  return (
    <View style={StyleSheet.absoluteFill}>
      {children}
      {isBackground && (
        <BlurView
          intensity={50}
          style={StyleSheet.absoluteFill}
          tint="dark"
        />
      )}
    </View>
  );
}
```
