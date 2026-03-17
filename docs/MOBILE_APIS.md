# Mobile APIs — Camera, Image Picker, File System & More

> Stack: **Expo SDK 54** · `expo-camera` · `expo-image-picker` · `expo-file-system` · `expo-haptics` · `expo-application`

---

## Table of Contents

1. [Camera — expo-camera](#1-camera--expo-camera)
2. [Image Picker — expo-image-picker](#2-image-picker--expo-image-picker)
3. [Camera vs Image Picker — When to use which](#3-camera-vs-image-picker)
4. [File System — expo-file-system](#4-file-system)
5. [Linking — Deep Links & External URLs](#5-linking)
6. [Clipboard](#6-clipboard)
7. [App State & Background Detection](#7-app-state--background-detection)
8. [Device Info & Constants](#8-device-info--constants)
9. [Network Detection](#9-network-detection)
10. [Expo Modules — Cheat Sheet](#10-expo-modules-cheat-sheet)

---

## 1. Camera — expo-camera

Use the camera when you need **live viewfinder** UI: barcode scanning, selfie capture, document scanning, liveness check.

### Basic camera screen

```tsx
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import { View, Text, Pressable } from "react-native";

export function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  // Handle permission states
  if (!permission) return <View />; // loading

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center gap-4 p-6">
        <Text className="text-foreground text-center text-lg">
          Camera access is needed to scan documents
        </Text>
        <Pressable onPress={requestPermission} className="bg-primary rounded-xl py-3 px-8">
          <Text className="text-white font-semibold">Allow camera</Text>
        </Pressable>
      </View>
    );
  }

  async function takePicture() {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.8,              // 0–1, trade-off between size and quality
      base64: false,             // set true if you need base64 string
      exif: false,               // include EXIF metadata
      skipProcessing: false,     // Android: skip post-processing for speed
    });

    if (photo) {
      // photo.uri — local file URI (file://...)
      // photo.width / photo.height
      console.log("Captured:", photo.uri);
    }
  }

  return (
    <View className="flex-1">
      <CameraView
        ref={cameraRef}
        className="flex-1"
        facing={facing}
        // flash
        flash="auto"            // "on" | "off" | "auto" | "torch"
        // zoom
        zoom={0}                // 0–1
        // enable autofocus
        autofocus="on"
      >
        {/* Overlay UI */}
        <View className="flex-1 justify-end p-8">
          <View className="flex-row justify-between items-center">
            <Pressable
              onPress={() => setFacing(f => f === "back" ? "front" : "back")}
              className="w-12 h-12 rounded-full bg-black/50 items-center justify-center"
            >
              <RefreshCw size={20} color="white" />
            </Pressable>

            <Pressable
              onPress={takePicture}
              className="w-20 h-20 rounded-full border-4 border-white bg-white/30 items-center justify-center"
            />
          </View>
        </View>
      </CameraView>
    </View>
  );
}
```

### Barcode / QR scanning

```tsx
import { CameraView, BarcodeScanningResult } from "expo-camera";
import { useRef, useState } from "react";

export function QRScanner({ onScanned }: { onScanned: (data: string) => void }) {
  const [scanned, setScanned] = useState(false);

  function handleBarcode(result: BarcodeScanningResult) {
    if (scanned) return; // prevent multiple fires
    setScanned(true);
    onScanned(result.data);
    // Reset after 2s to allow re-scan
    setTimeout(() => setScanned(false), 2000);
  }

  return (
    <CameraView
      className="flex-1"
      facing="back"
      barcodeScannerSettings={{
        barcodeTypes: ["qr", "pdf417", "ean13", "code128"], // what to scan
      }}
      onBarcodeScanned={handleBarcode}
    >
      {/* Targeting overlay */}
      <View className="flex-1 items-center justify-center">
        <View className="w-64 h-64 border-2 border-white rounded-2xl" />
        <Text className="text-white mt-4">Align QR code within the frame</Text>
      </View>
    </CameraView>
  );
}
```

---

## 2. Image Picker — expo-image-picker

Use the image picker when you need to let users **pick from gallery** or **quickly take a photo** without custom camera UI (KYC docs, avatars, receipts).

### Pick from gallery

```tsx
import * as ImagePicker from "expo-image-picker";

export async function pickImageFromGallery(): Promise<string | null> {
  // Check / request permission
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission needed", "Please allow photo library access in Settings");
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],         // "images" | "videos" | "livePhotos"
    allowsEditing: true,            // show crop UI after selection
    aspect: [1, 1],                 // crop ratio (only when allowsEditing: true)
    quality: 0.8,                   // 0–1
    allowsMultipleSelection: false, // true = multi-select
    base64: false,
    exif: false,
  });

  if (result.canceled) return null;

  // result.assets[0].uri — local file URI
  // result.assets[0].width / height
  // result.assets[0].fileSize — bytes
  // result.assets[0].mimeType — "image/jpeg" etc.
  return result.assets[0].uri;
}
```

### Take a photo directly

```tsx
export async function takePhoto(): Promise<string | null> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") return null;

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ["images"],
    allowsEditing: false,
    quality: 0.85,
    cameraType: ImagePicker.CameraType.back, // .back | .front
  });

  if (result.canceled) return null;
  return result.assets[0].uri;
}
```

### Upload to API (multipart form)

```ts
import * as FileSystem from "expo-file-system";

export async function uploadDocument(uri: string, type: "passport" | "id_card") {
  const fileInfo = await FileSystem.getInfoAsync(uri);
  if (!fileInfo.exists) throw new Error("File not found");

  const formData = new FormData();

  // React Native FormData accepts this special object shape
  formData.append("document", {
    uri,
    name: `${type}_${Date.now()}.jpg`,
    type: "image/jpeg",
  } as any);
  formData.append("document_type", type);

  const response = await fetch("https://api.chictransfer.com/kyc/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      // Don't set Content-Type — fetch sets it automatically with boundary
    },
    body: formData,
  });

  return response.json();
}
```

---

## 3. Camera vs Image Picker

| Need | Use |
|------|-----|
| Pick from photo gallery | `ImagePicker.launchImageLibraryAsync` |
| Quick take photo (no custom UI) | `ImagePicker.launchCameraAsync` |
| Scan QR / barcode | `CameraView` + `onBarcodeScanned` |
| Live preview with overlay (document frame) | `CameraView` |
| Face ID / liveness detection | `CameraView` (front-facing) |
| Selfie for KYC | `ImagePicker.launchCameraAsync({ cameraType: front })` |
| Document upload (ID, passport) | `ImagePicker.launchCameraAsync` or gallery |
| Video recording | `CameraView` |

---

## 4. File System

```ts
import * as FileSystem from "expo-file-system";

// Directories (don't hardcode paths)
FileSystem.documentDirectory   // Persistent, backed up on iOS
FileSystem.cacheDirectory      // Temporary, can be cleared by OS

// Check if file exists
const info = await FileSystem.getInfoAsync(uri, { size: true });
if (info.exists) {
  console.log("Size:", info.size, "bytes");
}

// Download a file
const downloadResumable = FileSystem.createDownloadResumable(
  "https://api.example.com/receipt.pdf",
  FileSystem.documentDirectory + "receipt_123.pdf",
  {},
  (progress) => {
    const percent = progress.totalBytesWritten / progress.totalBytesExpectedToWrite;
    console.log(`Download: ${Math.round(percent * 100)}%`);
  }
);
const result = await downloadResumable.downloadAsync();
console.log("Downloaded to:", result?.uri);

// Read a file
const content = await FileSystem.readAsStringAsync(uri);
const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

// Write a file
await FileSystem.writeAsStringAsync(
  FileSystem.documentDirectory + "data.json",
  JSON.stringify({ key: "value" }),
  { encoding: FileSystem.EncodingType.UTF8 }
);

// Delete a file
await FileSystem.deleteAsync(uri, { idempotent: true }); // idempotent: don't error if missing

// Move / Copy
await FileSystem.moveAsync({ from: tempUri, to: FileSystem.documentDirectory + "final.jpg" });
await FileSystem.copyAsync({ from: sourceUri, to: destUri });

// Create directory
await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "receipts/", {
  intermediates: true, // create parent dirs if needed
});

// List directory contents
const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
```

### Sharing a file

```ts
import * as Sharing from "expo-sharing"; // install: expo install expo-sharing

export async function shareReceipt(uri: string) {
  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) {
    Alert.alert("Sharing not available on this device");
    return;
  }

  await Sharing.shareAsync(uri, {
    mimeType: "application/pdf",
    dialogTitle: "Share receipt",
    UTI: "com.adobe.pdf", // iOS only
  });
}
```

---

## 5. Linking

```ts
import { Linking } from "react-native";
import * as WebBrowser from "expo-web-browser";

// Open external URL in system browser
await Linking.openURL("https://chictransfer.com");

// Open in-app browser (better UX for auth flows, terms)
await WebBrowser.openBrowserAsync("https://chictransfer.com/terms", {
  presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
  toolbarColor: "#7C3AED",
  controlsColor: "#ffffff",
});

// Open app settings (for permission recovery)
await Linking.openSettings();

// Open email composer
await Linking.openURL("mailto:support@chictransfer.com?subject=Help&body=Hello");

// Open phone dialer
await Linking.openURL("tel:+1234567890");

// Open WhatsApp
await Linking.openURL("whatsapp://send?phone=1234567890&text=Hello");

// Check if a URL can be opened
const canOpen = await Linking.canOpenURL("whatsapp://");
if (canOpen) {
  await Linking.openURL("whatsapp://...");
} else {
  // WhatsApp not installed — open web fallback
  await Linking.openURL("https://wa.me/1234567890");
}
```

### Handle deep links (incoming)

```ts
// app/_layout.tsx
import { useEffect } from "react";
import { Linking } from "react-native";
import { useRouter } from "expo-router";

export function DeepLinkHandler() {
  const router = useRouter();

  useEffect(() => {
    // Handle deep link when app is already open
    const sub = Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url, router);
    });

    // Handle deep link that launched the app
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url, router);
    });

    return () => sub.remove();
  }, []);
}

function handleDeepLink(url: string, router: any) {
  // chictransfer://transfer?id=txn_123
  const { pathname, queryParams } = new URL(url.replace("chictransfer://", "https://x/"));
  if (pathname === "/transfer") {
    router.push(`/transfer-result?id=${queryParams.id}`);
  }
}
```

---

## 6. Clipboard

```ts
import * as Clipboard from "expo-clipboard"; // expo install expo-clipboard

// Copy to clipboard
await Clipboard.setStringAsync("ABC123");

// Read from clipboard
const text = await Clipboard.getStringAsync();

// Check if clipboard has content
const hasString = await Clipboard.hasStringAsync();

// Usage: copy transfer reference number
async function copyReference(ref: string) {
  await Clipboard.setStringAsync(ref);
  haptic.success();
  Toast.show({ type: "success", text1: "Reference copied!" });
}
```

---

## 7. App State & Background Detection

```ts
import { AppState, AppStateStatus } from "react-native";
import { useEffect, useRef } from "react";

export function useAppState(
  onForeground?: () => void,
  onBackground?: () => void
) {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener("change", handleChange);
    return () => sub.remove();
  }, []);

  function handleChange(nextState: AppStateStatus) {
    const prev = appState.current;
    appState.current = nextState;

    const wentToBackground = nextState.match(/inactive|background/);
    const cameToForeground = prev.match(/inactive|background/) && nextState === "active";

    if (wentToBackground) onBackground?.();
    if (cameToForeground) onForeground?.();
  }
}

// Usage
useAppState(
  () => {
    // App came to foreground — refresh data
    refetchTransactions();
    notificationService.clearBadge();
  },
  () => {
    // App went to background — save draft, record timestamp
    saveDraft();
    backgroundTime.current = Date.now();
  }
);
```

---

## 8. Device Info & Constants

```ts
import * as Device from "expo-device";
import * as Application from "expo-application";
import Constants from "expo-constants";

// Device info
Device.deviceName           // "John's iPhone 15 Pro"
Device.modelName            // "iPhone 15 Pro"
Device.osName               // "iOS" | "Android"
Device.osVersion            // "17.2"
Device.deviceType           // PHONE | TABLET | TV | DESKTOP | UNKNOWN
Device.isDevice             // false on simulator/emulator — use for push token checks
Device.brand                // "Apple" | "Samsung" etc.
Device.totalMemory          // bytes of RAM

// App info
Application.applicationId           // "com.chictransfer.app"
Application.nativeApplicationVersion // "1.2.0"
Application.nativeBuildVersion      // "42"
Application.applicationName         // "Chic Transfer"

// Expo constants
Constants.expoConfig?.version
Constants.easConfig?.projectId
Constants.sessionId             // unique per app session
```

---

## 9. Network Detection

```ts
import NetInfo from "@react-native-community/netinfo"; // expo install @react-native-community/netinfo

// One-time check
const state = await NetInfo.fetch();
console.log("Connected:", state.isConnected);
console.log("Type:", state.type); // "wifi" | "cellular" | "ethernet" | "none"
console.log("Is cellular:", state.type === "cellular");

// Subscribe to changes
const unsubscribe = NetInfo.addEventListener((state) => {
  if (!state.isConnected) {
    showOfflineBanner();
  } else {
    hideOfflineBanner();
    retryPendingRequests();
  }
});

// Cleanup
unsubscribe();
```

**Offline banner component:**
```tsx
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    return NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });
  }, []);

  if (!isOffline) return null;

  return (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOutUp}
      className="bg-destructive/90 py-2 px-4 items-center"
    >
      <Text className="text-white text-sm font-medium">No internet connection</Text>
    </Animated.View>
  );
}
```

---

## 10. Expo Modules — Cheat Sheet

| Module | Install | Use for |
|--------|---------|---------|
| `expo-camera` | built-in | Live camera viewfinder, QR scanning |
| `expo-image-picker` | built-in | Pick from gallery, take photo |
| `expo-file-system` | built-in | Read/write/download files |
| `expo-local-authentication` | built-in | Biometrics, Face ID, fingerprint |
| `expo-secure-store` | built-in | Encrypted key-value storage |
| `expo-notifications` | built-in | Push + local notifications |
| `expo-haptics` | built-in | Tactile feedback |
| `expo-linking` | built-in | Deep links, open URLs |
| `expo-web-browser` | built-in | In-app browser (OAuth, terms) |
| `expo-application` | built-in | App version, bundle ID |
| `expo-device` | built-in | Device model, OS info, is physical device |
| `expo-constants` | built-in | Expo config, EAS project ID |
| `expo-crypto` | built-in | Hashing (SHA-256), random bytes |
| `expo-clipboard` | `expo install expo-clipboard` | Copy/paste |
| `expo-sharing` | `expo install expo-sharing` | Share files via system sheet |
| `expo-av` | `expo install expo-av` | Audio/video playback |
| `expo-location` | `expo install expo-location` | GPS coordinates |
| `expo-contacts` | `expo install expo-contacts` | Read device contacts |
| `expo-calendar` | `expo install expo-calendar` | Read/write device calendar |
| `expo-barcode-scanner` | deprecated → use `expo-camera` | Use CameraView + barcodeScannerSettings |
