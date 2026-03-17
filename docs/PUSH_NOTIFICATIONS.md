# Push Notifications — Complete Production Guide

> Stack: **Expo SDK 54** · `expo-notifications ~0.32.16` · FCM v1 · APNs · Expo Push Service

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Setup & Configuration](#2-setup--configuration)
3. [Permission & Token Flow](#3-permission--token-flow)
4. [Notification Categories & Actions](#4-notification-categories--actions)
5. [Local Notifications](#5-local-notifications)
6. [Rich Notifications (images, badges, sounds)](#6-rich-notifications)
7. [Notification Channels (Android)](#7-notification-channels-android)
8. [Deep Linking from Notifications](#8-deep-linking-from-notifications)
9. [Background Handling](#9-background-handling)
10. [NotificationService — Production Architecture](#10-notificationservice--production-architecture)
11. [Backend Integration](#11-backend-integration)
12. [Testing Strategies](#12-testing-strategies)
13. [Pitfalls & Rules](#13-pitfalls--rules)

---

## 1. Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                       NOTIFICATION PIPELINE                      │
│                                                                  │
│  Your Backend ──► Expo Push API ──► FCM / APNs ──► Device       │
│       │                                                │         │
│       └──── (direct FCM/APNs) ─────────────────────────         │
│                                                                  │
│  On Device:                                                      │
│    foreground ──► onNotificationReceived listener               │
│    background ──► system tray ──► onNotificationResponse        │
│    killed      ──► getLastNotificationResponseAsync()           │
└──────────────────────────────────────────────────────────────────┘
```

**Two delivery paths:**
- **Expo Push Service** (recommended for Managed Workflow): You send to `https://exp.host/--/api/v2/push/send`, Expo handles FCM/APNs credentials rotation automatically.
- **Direct FCM v1 / APNs**: More control, required for bare workflow without EAS.

> For Chic Transfer on Expo SDK 54 + EAS Build, use **Expo Push Service**. It handles FCM v1 migration automatically.

---

## 2. Setup & Configuration

### 2.1 app.json / app.config.ts

```ts
// app.config.ts
export default {
  expo: {
    plugins: [
      [
        "expo-notifications",
        {
          icon: "./assets/notification-icon.png", // 96x96 white + transparent PNG
          color: "#7C3AED",                        // brand color for Android icon bg
          sounds: ["./assets/sounds/transfer.wav"], // custom sounds (≤30s, WAV/AIFF)
          androidMode: "default",                   // "default" | "collapse"
          androidCollapsedTitle: "#{unread_notifications} new notifications",
          iosDisplayInForeground: true,             // show banner when app is open
        },
      ],
    ],
    android: {
      googleServicesFile: "./google-services.json", // FCM setup
    },
    ios: {
      bundleIdentifier: "com.chictransfer.app",
    },
  },
};
```

### 2.2 EAS Credentials

```bash
# Let EAS manage APNs keys (recommended)
eas credentials

# For FCM v1 — upload your service account JSON
eas push:android:upload --key ./path/to/service-account.json
```

---

## 3. Permission & Token Flow

### 3.1 The right way to request permission

```ts
// services/notifications.service.ts
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";

export type PushTokenResult =
  | { success: true; token: string }
  | { success: false; reason: "simulator" | "denied" | "error"; message?: string };

export async function registerForPushNotifications(): Promise<PushTokenResult> {
  // 1. Physical device check — push tokens don't work on simulators
  if (!Device.isDevice) {
    return { success: false, reason: "simulator", message: "Push tokens require a physical device" };
  }

  // 2. Check existing permission status first (avoid re-prompting)
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    // 3. Request only if not already decided
    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true, // Siri read-aloud (iOS 13+)
      },
    });
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return { success: false, reason: "denied" };
  }

  // 4. Android 8+ requires notification channel before getting token
  if (Platform.OS === "android") {
    await setupAndroidChannels();
  }

  // 5. Get Expo push token — projectId links to EAS project
  try {
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    if (!projectId) throw new Error("EAS projectId not found in app config");

    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
    return { success: true, token };
  } catch (error) {
    return { success: false, reason: "error", message: String(error) };
  }
}
```

### 3.2 When to ask for permission — UX best practice

```
WRONG ❌ — Ask immediately on app launch
RIGHT ✅ — Ask at a moment of value:
  - After successful login
  - When user enables "transaction alerts" in settings
  - On a dedicated permission screen with explanation
```

```tsx
// components/NotificationPermissionPrompt.tsx
// Show this BEFORE calling requestPermissionsAsync
export function NotificationPermissionPrompt({ onAccept, onDecline }: Props) {
  return (
    <View className="rounded-2xl bg-card p-6 gap-4">
      <View className="w-14 h-14 rounded-full bg-primary/10 items-center justify-center self-center">
        <Bell size={28} className="text-primary" />
      </View>
      <Text className="text-xl font-bold text-center text-foreground">
        Stay on top of your transfers
      </Text>
      <Text className="text-muted-foreground text-center">
        Get instant alerts when your money arrives, and security alerts
        when your account is accessed.
      </Text>
      <Pressable onPress={onAccept} className="bg-primary rounded-xl py-4">
        <Text className="text-white text-center font-semibold">Enable notifications</Text>
      </Pressable>
      <Pressable onPress={onDecline}>
        <Text className="text-muted-foreground text-center">Not now</Text>
      </Pressable>
    </View>
  );
}
```

---

## 4. Notification Categories & Actions

Categories let users act on a notification **without opening the app** (iOS) or from the notification shade (Android).

```ts
// Call once at app startup (inside your NotificationProvider)
async function registerCategories() {
  await Notifications.setNotificationCategoryAsync("TRANSFER_RECEIVED", [
    {
      identifier: "VIEW_TRANSFER",
      buttonTitle: "View Details",
      options: { opensAppToForeground: true },
    },
    {
      identifier: "DISMISS",
      buttonTitle: "Dismiss",
      options: { opensAppToForeground: false, isDestructive: false },
    },
  ]);

  await Notifications.setNotificationCategoryAsync("SECURITY_ALERT", [
    {
      identifier: "IT_WAS_ME",
      buttonTitle: "It was me",
      options: { opensAppToForeground: false },
    },
    {
      identifier: "BLOCK_ACCOUNT",
      buttonTitle: "Block my account",
      options: { opensAppToForeground: true, isDestructive: true },
    },
  ]);
}
```

**Send from backend with category:**
```json
{
  "to": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "title": "Transfer received",
  "body": "You received $500 from John Doe",
  "categoryIdentifier": "TRANSFER_RECEIVED",
  "data": { "transferId": "txn_123", "screen": "/transfer-result" }
}
```

---

## 5. Local Notifications

Local notifications are triggered from the device itself — no backend needed. Perfect for reminders, scheduled nudges, or confirming actions.

```ts
// services/local-notifications.ts
import * as Notifications from "expo-notifications";

// Schedule a transfer reminder
export async function scheduleTransferReminder(params: {
  recipientName: string;
  amount: number;
  triggerDate: Date;
}) {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Transfer reminder",
      body: `Don't forget to send $${params.amount} to ${params.recipientName}`,
      sound: "default",
      data: { type: "reminder" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: params.triggerDate,
    },
  });
  return id; // store this ID to cancel later
}

// Recurring — every week on Monday at 9am
export async function scheduleWeeklyRecap() {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: "Your weekly transfer recap",
      body: "Tap to see your activity this week",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: 2, // Monday (1=Sunday, 2=Monday…)
      hour: 9,
      minute: 0,
    },
  });
}

// Cancel all scheduled
export async function clearAllScheduled() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// Cancel specific
export async function cancelScheduled(id: string) {
  await Notifications.cancelScheduledNotificationAsync(id);
}

// List all pending
export async function getPendingNotifications() {
  return Notifications.getAllScheduledNotificationsAsync();
}
```

---

## 6. Rich Notifications

### Badges

```ts
// Set badge count (iOS + Android 8+)
await Notifications.setBadgeCountAsync(3);

// Clear badge
await Notifications.setBadgeCountAsync(0);

// Read current
const count = await Notifications.getBadgeCountAsync();
```

### Custom Sound

Place `.wav` or `.aiff` files in:
- `assets/sounds/transfer.wav`
- Register in `app.json` under `expo-notifications.sounds`

```json
// In notification payload (from backend)
{
  "sound": "transfer.wav",  // exact filename, no path
  "title": "Transfer complete"
}
```

### Notification Behavior when app is foregrounded

```ts
// Set ONCE at module level (outside components)
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const { type } = notification.request.content.data as { type: string };

    // Silent notifications while on a call screen
    if (type === "marketing") {
      return { shouldShowAlert: false, shouldPlaySound: false, shouldSetBadge: false, priority: Notifications.AndroidNotificationPriority.LOW };
    }

    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    };
  },
});
```

---

## 7. Notification Channels (Android)

Android 8+ (API 26+) requires channels. Users can control volume/importance per channel in system settings.

```ts
export async function setupAndroidChannels() {
  // Transactions — high priority, custom sound
  await Notifications.setNotificationChannelAsync("transactions", {
    name: "Transactions",
    description: "Transfer confirmations, receipts, and payment alerts",
    importance: Notifications.AndroidImportance.HIGH,
    sound: "transfer.wav",
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#7C3AED",
    enableVibrate: true,
    enableLights: true,
    showBadge: true,
  });

  // Security — MAX priority, cannot be silenced by user
  await Notifications.setNotificationChannelAsync("security", {
    name: "Security Alerts",
    description: "Login attempts, suspicious activity, and account changes",
    importance: Notifications.AndroidImportance.MAX,
    sound: "default",
    enableVibrate: true,
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    bypassDnd: true, // override Do Not Disturb
  });

  // Marketing — low priority, silent
  await Notifications.setNotificationChannelAsync("marketing", {
    name: "Promotions",
    description: "Special offers and news",
    importance: Notifications.AndroidImportance.LOW,
    enableVibrate: false,
    showBadge: false,
  });
}
```

> **Send to channel from backend:**
> ```json
> { "channelId": "transactions", "title": "..." }
> ```

---

## 8. Deep Linking from Notifications

The most reliable pattern with Expo Router:

```ts
// hooks/useNotificationNavigation.ts
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";

export function useNotificationNavigation() {
  const router = useRouter();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    // Case 1: App in foreground or background — user taps notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        handleNotificationNavigation(response.notification, router);
      }
    );

    // Case 2: App was KILLED — check last notification that launched the app
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        // Delay to let navigation stack initialize
        setTimeout(() => handleNotificationNavigation(response.notification, router), 300);
      }
    });

    return () => responseListener.current?.remove();
  }, []);
}

function handleNotificationNavigation(
  notification: Notifications.Notification,
  router: ReturnType<typeof useRouter>
) {
  const data = notification.request.content.data as Record<string, string>;

  // Action-based routing
  switch (data.type) {
    case "transfer_received":
      router.push(`/transfer-result?id=${data.transferId}`);
      break;
    case "security_alert":
      router.push("/settings/security");
      break;
    case "kyc_approved":
      router.push("/(kyc)/update-profile");
      break;
    default:
      router.push("/(tabs)");
  }
}
```

```tsx
// app/_layout.tsx — wire it up once
export default function RootLayout() {
  useNotificationNavigation(); // ← here
  // ...
}
```

---

## 9. Background Handling

For truly silent background data pushes (content-available on iOS, priority:high on Android):

```ts
// Must be registered at module scope (top of app entry file)
// This runs even when the app is killed
TaskManager.defineTask("BACKGROUND_NOTIFICATION_TASK", ({ data, error }) => {
  if (error) return;
  // Sync data, update local DB, refresh cache, etc.
  // You have ~30s (iOS) to complete this
  console.log("Background notification data:", data);
});

// Then link it:
Notifications.registerTaskAsync("BACKGROUND_NOTIFICATION_TASK");
```

**Backend payload for background push:**
```json
{
  "to": "ExponentPushToken[...]",
  "title": "",
  "body": "",
  "_contentAvailable": true,
  "priority": "high",
  "data": { "type": "balance_sync", "silent": true }
}
```

---

## 10. NotificationService — Production Architecture

```ts
// services/notification.service.ts
// One singleton to rule them all

import * as Notifications from "expo-notifications";
import { registerForPushNotifications } from "./notifications.helpers";
import { api } from "./api";

class NotificationService {
  private foregroundSub: Notifications.EventSubscription | null = null;
  private responseSub: Notifications.EventSubscription | null = null;
  private initialized = false;

  async init() {
    if (this.initialized) return;

    // Set handler BEFORE subscribing
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      }),
    });

    await this.registerToken();
    this.initialized = true;
  }

  async registerToken() {
    const result = await registerForPushNotifications();
    if (result.success) {
      // Persist token to backend so they can send pushes to this device
      await api.post("/devices/push-token", { token: result.token });
    }
  }

  // Call after login to re-link token to new user session
  async refreshTokenForUser(userId: string) {
    const result = await registerForPushNotifications();
    if (result.success) {
      await api.post("/devices/push-token", { token: result.token, userId });
    }
  }

  subscribe(
    onReceive: (n: Notifications.Notification) => void,
    onResponse: (r: Notifications.NotificationResponse) => void
  ) {
    this.foregroundSub = Notifications.addNotificationReceivedListener(onReceive);
    this.responseSub = Notifications.addNotificationResponseReceivedListener(onResponse);
  }

  unsubscribe() {
    this.foregroundSub?.remove();
    this.responseSub?.remove();
  }

  async clearBadge() {
    await Notifications.setBadgeCountAsync(0);
  }

  async dismissAll() {
    await Notifications.dismissAllNotificationsAsync();
  }
}

export const notificationService = new NotificationService();
```

---

## 11. Backend Integration

### Sending via Expo Push API (Node.js example)

```ts
import { Expo, ExpoPushMessage } from "expo-server-sdk";

const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

export async function sendTransferNotification(params: {
  token: string;
  amount: number;
  sender: string;
  transferId: string;
}) {
  if (!Expo.isExpoPushToken(params.token)) {
    console.error("Invalid Expo push token:", params.token);
    return;
  }

  const messages: ExpoPushMessage[] = [{
    to: params.token,
    title: "Money received!",
    body: `${params.sender} sent you $${params.amount}`,
    sound: "transfer.wav",
    badge: 1,
    channelId: "transactions",
    categoryIdentifier: "TRANSFER_RECEIVED",
    priority: "high",
    ttl: 3600, // expire after 1 hour if not delivered
    data: {
      type: "transfer_received",
      transferId: params.transferId,
      screen: "/transfer-result",
    },
  }];

  // Chunk to respect API limits (100 per request)
  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];

  for (const chunk of chunks) {
    const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
    tickets.push(...ticketChunk);
  }

  // Handle receipts (check after 15min — async delivery)
  await handleReceipts(expo, tickets);
}

async function handleReceipts(expo: Expo, tickets: any[]) {
  const receiptIds = tickets
    .filter((t) => t.status === "ok")
    .map((t) => t.id);

  const receiptChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  for (const chunk of receiptChunks) {
    const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
    for (const [id, receipt] of Object.entries(receipts)) {
      if (receipt.status === "error") {
        if (receipt.details?.error === "DeviceNotRegistered") {
          // Remove token from DB — device uninstalled the app
          await removeDeviceToken(id);
        }
      }
    }
  }
}
```

---

## 12. Testing Strategies

### Local device (Expo Go)
```bash
# Send test notification via Expo dashboard
# Or use the Expo Notifications tool:
npx expo push:send --to "ExponentPushToken[...]" --title "Test" --body "Hello"
```

### Test on simulator (local only)
```ts
// Schedule a local notification immediately — works on simulator
await Notifications.scheduleNotificationAsync({
  content: { title: "Simulator test", body: "Tap to navigate" },
  trigger: null, // null = fire immediately
});
```

### Integration test checklist
- [ ] App in foreground: banner appears, listener fires
- [ ] App in background: notification appears in tray, tap opens correct screen
- [ ] App killed: tap notification launches app and navigates correctly
- [ ] Permission denied: graceful fallback, no crash
- [ ] Invalid token: backend handles `DeviceNotRegistered` error
- [ ] Channel importance: Android correctly shows in system settings

---

## 13. Pitfalls & Rules

| # | Rule | Why |
|---|------|-----|
| 1 | Always call `setNotificationHandler` **before** any listeners | Without it, foreground notifications are silently dropped |
| 2 | Never request push permission on first launch | App Store rejection risk + poor UX conversion |
| 3 | Always handle the **killed-app** case with `getLastNotificationResponseAsync` | Users commonly tap notifications from a cold start |
| 4 | Store the Expo push token on your backend, not just locally | Token can rotate — refresh on each login |
| 5 | Set up Android channels **before** requesting the token | Channels must exist before any notification is delivered on Android 8+ |
| 6 | Check `DeviceNotRegistered` receipts 15min after sending | Prevents sending to dead tokens (billing + deliverability) |
| 7 | Use `ttl` on time-sensitive notifications | Prevents stale alerts being delivered hours later |
| 8 | Use `priority: "high"` only for real-time content | Excessive high-priority drains battery and triggers OS throttling |
| 9 | Test on physical device, not simulator | Push tokens don't exist on simulators |
| 10 | Clean up all listeners in `useEffect` return | Memory leaks and duplicate handlers cause random bugs |
