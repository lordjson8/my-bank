# Animations, Updates, Notifications & Local Auth
## Senior-level deep dive — every line explained

> Stack: Expo 54 + React Native Reanimated 4 + expo-updates + expo-notifications + expo-local-authentication

---

## Table of Contents

1. [Animations](#1-animations)
   - 1.1 [Mental model — how Reanimated works](#11-mental-model--how-reanimated-works)
   - 1.2 [Entering animations — FadeInDown, FadeInRight](#12-entering-animations--fadeindown-fadeinright)
   - 1.3 [Interactive animations — press, scale, spring](#13-interactive-animations--press-scale-spring)
   - 1.4 [List stagger animations](#14-list-stagger-animations)
   - 1.5 [Tab icon animation](#15-tab-icon-animation)
   - 1.6 [Gesture-driven animations](#16-gesture-driven-animations)
   - 1.7 [Rules and pitfalls](#17-rules-and-pitfalls)

2. [OTA Updates](#2-ota-updates)
   - 2.1 [How expo-updates works](#21-how-expo-updates-works)
   - 2.2 [Silent background update check](#22-silent-background-update-check)
   - 2.3 [Mandatory update banner](#23-mandatory-update-banner)
   - 2.4 [Full update manager hook](#24-full-update-manager-hook)
   - 2.5 [Where to call it in the app](#25-where-to-call-it-in-the-app)

3. [Push Notifications](#3-push-notifications)
   - 3.1 [How the notification pipeline works](#31-how-the-notification-pipeline-works)
   - 3.2 [Requesting permission and getting the push token](#32-requesting-permission-and-getting-the-push-token)
   - 3.3 [The NotificationContext — explained line by line](#33-the-notificationcontext--explained-line-by-line)
   - 3.4 [Handling notification tap — deep link to a screen](#34-handling-notification-tap--deep-link-to-a-screen)
   - 3.5 [Sending a push from your backend](#35-sending-a-push-from-your-backend)
   - 3.6 [Rules and pitfalls](#36-rules-and-pitfalls)

4. [Local Authentication — Biometrics & PIN](#4-local-authentication--biometrics--pin)
   - 4.1 [What local auth covers](#41-what-local-auth-covers)
   - 4.2 [Checking device capability](#42-checking-device-capability)
   - 4.3 [Triggering authentication](#43-triggering-authentication)
   - 4.4 [useBiometricAuth hook — full implementation](#44-usebiometricauth-hook--full-implementation)
   - 4.5 [App-lock on foreground resume](#45-app-lock-on-foreground-resume)
   - 4.6 [Confirm-before-transfer pattern](#46-confirm-before-transfer-pattern)
   - 4.7 [Persisting biometric preference](#47-persisting-biometric-preference)
   - 4.8 [Platform differences](#48-platform-differences)

---

## 1. Animations

### 1.1 Mental model — how Reanimated works

The most important thing to understand about Reanimated is **where the animation runs**.

React Native has two threads:
- **JS thread** — runs your React code, state updates, business logic
- **UI thread** (also called the native thread) — renders pixels on screen

Standard React Native `Animated` API runs on the JS thread. Every frame, it sends
a value from JS → bridge → native. At 60fps that is 60 messages per second across
the bridge. Under JS load (navigation, data fetching), frames get dropped.

Reanimated runs animations **entirely on the UI thread**. The animation logic is
compiled to native code once, then runs frame-perfect without touching JS.
This is why Reanimated animations are butter-smooth even while the JS thread is busy.

The architecture has two sides:

```
JS Thread                         UI Thread
─────────────────                 ─────────────────────────────
useSharedValue(1)     ──────────► SharedValue lives here
useAnimatedStyle()    ──────────► Style function runs here every frame
withSpring(0.96)      ──────────► Spring algorithm runs here, no JS involved
set(value)            ──────────► Queues a worklet call on UI thread
```

**Key rule:** Functions that run on the UI thread are called **worklets**.
They must be pure — no JS-only APIs (no `console.log`, no `fetch`, no React state).
Reanimated detects worklets automatically when you use `useAnimatedStyle`.

---

### 1.2 Entering animations — FadeInDown, FadeInRight

These are declarative one-shot animations that fire when a component **mounts**.

```typescript
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
```
`Animated` is a namespace that contains `Animated.View`, `Animated.Text`, etc.
These are drop-in replacements for `View` and `Text` that support the `entering` prop.
`FadeInDown` and `FadeInRight` are pre-built animation presets.

```typescript
<Animated.View entering={FadeInDown.duration(400)}>
  <AmountInput ... />
</Animated.View>
```
`entering` — runs once when this component appears in the tree.
`FadeInDown` — starts at `opacity: 0, translateY: -20` and animates to `opacity: 1, translateY: 0`.
`.duration(400)` — takes 400ms to complete. Default is 300ms.

**Staggered entry (multiple sections entering one after another):**
```typescript
<Animated.View entering={FadeInDown.delay(0).duration(400)}>
  {/* First section */}
</Animated.View>

<Animated.View entering={FadeInDown.delay(80).duration(400)}>
  {/* Second section — starts 80ms after first */}
</Animated.View>

<Animated.View entering={FadeInDown.delay(160).duration(400)}>
  {/* Third section — starts 160ms after first */}
</Animated.View>
```
`.delay(ms)` — waits before starting. Staggering creates the feeling of the UI
building itself progressively, which feels more alive than everything appearing at once.
80ms between sections is the sweet spot — perceivable but not sluggish.

**Conditional sections (animate in when they appear):**
```typescript
{selectedDestination && selectedPayoutMethod && (
  <Animated.View entering={FadeInDown.duration(250)}>
    <TextInput ... />
  </Animated.View>
)}
```
Since the component conditionally mounts, `entering` fires every time
`selectedDestination && selectedPayoutMethod` becomes true.
This gives a natural reveal animation to form fields as they unlock. No extra logic needed.

**Preset library — common ones:**

| Preset | Starts at | Ends at | Best for |
|---|---|---|---|
| `FadeIn` | opacity 0 | opacity 1 | Overlays, modals |
| `FadeInDown` | opacity 0, y: -20 | opacity 1, y: 0 | Top-to-bottom reveals |
| `FadeInUp` | opacity 0, y: +20 | opacity 1, y: 0 | Bottom sheet content |
| `FadeInRight` | opacity 0, x: +20 | opacity 1, x: 0 | List items sliding in |
| `FadeInLeft` | opacity 0, x: -20 | opacity 1, x: 0 | Back-navigation reveals |
| `ZoomIn` | scale 0.8, opacity 0 | scale 1, opacity 1 | Modals, popups |
| `SlideInRight` | x: full screen width | x: 0 | Page transitions |
| `BounceIn` | scale 0, with bounce | scale 1 | Success states |

**Chaining modifiers:**
```typescript
FadeInDown
  .delay(100)       // wait 100ms before starting
  .duration(300)    // run for 300ms
  .springify()      // use spring physics instead of linear timing
  .damping(12)      // spring damping (higher = less bouncy)
  .stiffness(200)   // spring stiffness (higher = faster)
```
`.springify()` converts a linear entering animation into a spring-based one.
Springs feel more physical and natural than timed animations.

---

### 1.3 Interactive animations — press, scale, spring

Used for buttons that need to respond to touch with physical feedback.

```typescript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
```
`useSharedValue` — creates a value that lives on the UI thread.
Unlike React state (`useState`), changing a shared value does NOT trigger a re-render.
The animation updates the native view directly, bypassing React entirely.
`useAnimatedStyle` — a function that runs on the UI thread every frame, returning styles.
`withSpring` — animates a value to a target using spring physics.

```typescript
const scale = useSharedValue(1);
```
Initial scale is 1 (normal size). This value lives on the UI thread permanently.
The `1` is just the starting value, not React state — Reanimated owns it.

```typescript
const animStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));
```
This function is called on the UI thread on every animation frame.
`scale.value` reads the current value of the shared value at that exact moment.
The `() =>` callback is compiled to a **worklet** — native code that runs without JS.
The returned object is a plain style — Reanimated applies it directly to the native view.

```typescript
<Animated.View style={animStyle}>
  <TouchableOpacity
    onPressIn={() => { scale.value = withSpring(0.96); }}
    onPressOut={() => { scale.value = withSpring(1); }}
    onPress={handleSendMoney}
  >
    <Text>Send</Text>
  </TouchableOpacity>
</Animated.View>
```
`onPressIn` fires the instant the finger touches the screen — before `onPress`.
Setting `scale.value = withSpring(0.96)` tells Reanimated: animate scale to 0.96
using spring physics, starting now. The spring runs on the UI thread.
`onPressOut` resets to 1 with another spring — creates the bounce-back effect.
`onPress` fires at the end of the press — by then the scale is already back to 1.

**Spring configuration:**
```typescript
withSpring(0.96, {
  damping: 10,       // lower = more bouncy (oscillates more)
  stiffness: 200,    // higher = snappier response
  mass: 1,           // virtual mass of the object (usually leave at 1)
  overshootClamping: false,  // true = no overshoot past target
})
```
For press feedback: `damping: 15, stiffness: 300` — fast and snappy, barely any bounce.
For entering animations: `damping: 10, stiffness: 100` — slower, more elastic and playful.

**`withTiming` — for when you want precise control:**
```typescript
import { withTiming, Easing } from "react-native-reanimated";

scale.value = withTiming(0.96, {
  duration: 100,
  easing: Easing.out(Easing.quad), // decelerates toward the end
});
```
`withTiming` runs for an exact duration. `withSpring` runs until velocity reaches zero.
Use `withTiming` when you need predictable, exact-duration animations.
Use `withSpring` when you want physical feel and do not care about exact duration.

---

### 1.4 List stagger animations

For `FlatList` or mapped arrays, we want each item to animate in with a delay
proportional to its position — creating a cascade effect.

```typescript
<FlatList
  data={filteredHistory}
  renderItem={({ item, index }) => (
    <Animated.View entering={FadeInRight.delay(index * 40).duration(300)}>
      <TransactionItem transaction={item} />
    </Animated.View>
  )}
/>
```
`index * 40` — item 0 starts at 0ms, item 1 at 40ms, item 2 at 80ms, etc.
40ms is the minimum delay to make the stagger perceivable without feeling slow.
At 60fps each frame is ~16ms, so 40ms is about 2.5 frames between items.

**Important caveat:** Entering animations fire on mount. If the list already has
items (e.g., navigating back to a screen that cached its data), none of the items
will re-animate because they are already mounted. This is expected behavior.
If you want items to always animate (e.g., after a pull-to-refresh), use a `key` prop
to force remount:
```typescript
<FlatList
  key={refreshKey}  // change this value to remount the list and re-trigger animations
  ...
/>
```

**Capping the stagger for long lists:**
```typescript
renderItem={({ item, index }) => (
  <Animated.View entering={FadeInRight.delay(Math.min(index, 8) * 40).duration(300)}>
```
`Math.min(index, 8)` caps the delay at item 8 (320ms). Without this cap, item 50
would have a 2000ms delay — the user would scroll past before the animation finishes.

---

### 1.5 Tab icon animation

Each tab icon scales up slightly when focused, creating a subtle "selected" feel.

```typescript
const scale = useSharedValue(1);

useEffect(() => {
  scale.value = withSpring(focused ? 1.18 : 1, {
    damping: 12,
    stiffness: 220,
  });
}, [focused]);
```
`useEffect` here runs on the **JS thread** — it watches `focused` (a prop, not a shared value).
When `focused` changes, it writes to `scale.value`, which queues the spring on the UI thread.
This is the bridge between "React world" (props, state) and "Reanimated world" (shared values).
`1.18` means 18% larger when focused. Enough to be noticeable, not enough to look wrong.

```typescript
const animStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));

return (
  <Animated.View style={animStyle}>
    <Icon size={26} color={color} />
  </Animated.View>
);
```
The `Animated.View` wrapping the icon updates its transform on every animation frame
without going through React. The tab bar stays at 60fps regardless of JS thread load.

---

### 1.6 Gesture-driven animations

For swipe-to-dismiss, drag interactions, and pull effects.
Requires `react-native-gesture-handler` (already installed).

```typescript
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from "react-native-reanimated";

const translateY = useSharedValue(0);

const panGesture = Gesture.Pan()
  .onUpdate((event) => {
    // This runs on the UI thread — event.translationY is the current drag distance
    if (event.translationY > 0) {  // only allow dragging down
      translateY.value = event.translationY;
    }
  })
  .onEnd((event) => {
    if (event.translationY > 150) {
      // User dragged past threshold — dismiss
      runOnJS(setModalVisible)(false);  // call JS function from UI thread
    } else {
      // Not far enough — snap back
      translateY.value = withSpring(0);
    }
  });

const animStyle = useAnimatedStyle(() => ({
  transform: [{ translateY: translateY.value }],
}));

return (
  <GestureDetector gesture={panGesture}>
    <Animated.View style={animStyle}>
      {/* modal content */}
    </Animated.View>
  </GestureDetector>
);
```
`runOnJS(fn)(args)` — the only way to call a JS function from a worklet.
Worklets run on the UI thread and cannot directly call React state setters or other JS APIs.
`runOnJS` schedules the call to execute on the JS thread on the next available frame.

---

### 1.7 Rules and pitfalls

**Rule 1 — Never read shared values outside worklets.**
```typescript
// WRONG — reads the value on JS thread, gets stale data
console.log(scale.value);

// RIGHT — use in useAnimatedStyle (worklet) or animatedProps
const style = useAnimatedStyle(() => {
  console.log(scale.value); // this is inside a worklet, valid
  return { transform: [{ scale: scale.value }] };
});
```

**Rule 2 — useAnimatedStyle must be unconditional.**
```typescript
// WRONG — React hooks cannot be called conditionally
if (isEnabled) {
  const style = useAnimatedStyle(() => ({ opacity: fade.value }));
}

// RIGHT — define it always, apply conditionally
const style = useAnimatedStyle(() => ({
  opacity: isEnabled ? fade.value : 1,
}));
```

**Rule 3 — Do not animate layout-triggering properties.**
Animating `width`, `height`, `padding`, `margin` triggers the layout engine on every frame.
Extremely expensive. Use `transform: [{ scaleX }]` instead of `width` for scale-like effects.
`opacity` and `transform` (translate, scale, rotate) are the only GPU-composited properties.

**Rule 4 — Avoid creating shared values inside loops or conditionals.**
Each `useSharedValue` call must be at the top level of a component or hook.
If you need per-item animations in a list, move the `useSharedValue` into the item component.

---

## 2. OTA Updates

### 2.1 How expo-updates works

Expo's OTA (Over-The-Air) update system lets you push JS bundle changes without
going through the App Store or Play Store review process. Only the JS bundle is
updated — native code changes (new permissions, new native modules) still require
a full store submission.

The flow on app launch:
```
App opens
  → expo-updates checks the Expo/EAS update server
  → If an update exists: download it in the background
  → New bundle stored on disk
  → Next app launch uses the new bundle
```

By default, expo-updates does not interrupt the user — the update silently downloads
and activates on next restart. For critical updates (security fixes, broken flows),
you can force immediate application.

Install:
```bash
npx expo install expo-updates
```

---

### 2.2 Silent background update check

This pattern downloads updates silently without interrupting the user.
Best for non-critical updates (UI improvements, performance fixes).

```typescript
// hooks/useOTAUpdate.ts
import * as Updates from "expo-updates";
import { useEffect } from "react";

export const useOTAUpdate = () => {
  useEffect(() => {
    checkForUpdate();
  }, []);
};

async function checkForUpdate() {
  // expo-updates does nothing in Expo Go or development — guard against it
  if (__DEV__) return;

  try {
    const update = await Updates.checkForUpdateAsync();
    // checkForUpdateAsync() contacts the EAS update server
    // Returns { isAvailable: boolean, manifest: object }
    // isAvailable is true when a newer bundle exists on the server

    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      // Downloads the new JS bundle to local storage
      // Does NOT activate it yet — user keeps the current version until restart
    }
  } catch (error) {
    // Network errors, server down, invalid config — fail silently
    // Never crash the app because of a failed update check
    console.warn("[OTA] Update check failed:", error);
  }
}
```
`__DEV__` is a global boolean injected by Metro bundler. `true` in development, `false` in production.
`expo-updates` has no effect in development mode or Expo Go — all these functions are no-ops.
Guarding with `__DEV__` prevents confusing log output during development.

---

### 2.3 Mandatory update banner

For critical fixes where you need the user to update immediately.

```typescript
// hooks/useOTAUpdate.ts — extended version
import * as Updates from "expo-updates";
import { useState, useEffect } from "react";
import { Alert } from "react-native";

export const useOTAUpdate = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    checkAndApplyUpdate();
  }, []);

  const checkAndApplyUpdate = async () => {
    if (__DEV__) return;

    try {
      const update = await Updates.checkForUpdateAsync();

      if (!update.isAvailable) return;

      await Updates.fetchUpdateAsync();
      // At this point the new bundle is on disk but not yet active

      // Option A — silent (applies on next natural restart)
      // Nothing else needed. User gets update next time they open the app.

      // Option B — ask the user
      Alert.alert(
        "Update available",
        "A new version has been downloaded. Restart now to apply it?",
        [
          { text: "Later", style: "cancel" },
          {
            text: "Restart",
            onPress: async () => {
              setIsUpdating(true);
              await Updates.reloadAsync();
              // reloadAsync() immediately restarts the JS runtime
              // The new bundle activates — feels like a cold start
            },
          },
        ]
      );

      // Option C — force immediately (for security/critical fixes)
      // setIsUpdating(true);
      // await Updates.reloadAsync();

    } catch (error) {
      console.warn("[OTA] Update failed:", error);
    }
  };

  return { isUpdating };
};
```
`Updates.reloadAsync()` — reloads the React Native runtime using the newest bundle on disk.
From the user's perspective it looks like closing and reopening the app.
State is completely reset — inform users to save work if applicable.

---

### 2.4 Full update manager hook

Production-grade implementation with all edge cases handled.

```typescript
// hooks/useOTAUpdate.ts
import * as Updates from "expo-updates";
import { useState, useEffect, useCallback } from "react";

type UpdateStatus =
  | "idle"           // no check performed yet
  | "checking"       // contacting server
  | "downloading"    // update found, downloading bundle
  | "ready"          // bundle downloaded, waiting for restart
  | "reloading"      // Updates.reloadAsync() called
  | "up-to-date"     // no update available
  | "error";         // something went wrong

export const useOTAUpdate = () => {
  const [status, setStatus] = useState<UpdateStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const checkForUpdate = useCallback(async () => {
    if (__DEV__) return;
    // In development, expo-updates APIs throw if called
    // All returns below are safety guards

    setStatus("checking");
    setError(null);

    try {
      const result = await Updates.checkForUpdateAsync();
      // Network call to EAS servers. Timeout is ~10 seconds by default.

      if (!result.isAvailable) {
        setStatus("up-to-date");
        return;
      }

      setStatus("downloading");
      await Updates.fetchUpdateAsync();
      // Downloads the new bundle. Can take a few seconds on slow connections.
      // Progress callbacks are not yet supported by expo-updates — it is all or nothing.

      setStatus("ready");
      // At this point: new bundle on disk, current bundle still running.
      // App will use the new bundle on the next restart unless reloadAsync() is called.

    } catch (err: any) {
      setStatus("error");
      setError(err.message ?? "Unknown update error");
    }
  }, []);

  const applyUpdate = useCallback(async () => {
    if (status !== "ready") return;
    setStatus("reloading");
    await Updates.reloadAsync();
    // This line never returns — the runtime restarts before it can.
  }, [status]);

  useEffect(() => {
    // Run once on app launch, after a short delay to not compete with
    // the splash screen, font loading, and store hydration.
    const timer = setTimeout(checkForUpdate, 3000);
    return () => clearTimeout(timer);
  }, []);

  return { status, error, checkForUpdate, applyUpdate };
};
```

---

### 2.5 Where to call it in the app

```typescript
// app/(tabs)/_layout.tsx or app/_layout.tsx
import { useOTAUpdate } from "@/hooks/useOTAUpdate";

export default function TabLayout() {
  const { status, applyUpdate } = useOTAUpdate();

  return (
    <>
      {/* Optional: show a subtle banner when update is ready */}
      {status === "ready" && (
        <TouchableOpacity
          onPress={applyUpdate}
          className="bg-primary px-4 py-2 items-center"
        >
          <Text className="text-white text-sm font-medium">
            New version available — tap to update
          </Text>
        </TouchableOpacity>
      )}

      {/* rest of layout */}
    </>
  );
}
```
Placing the hook in the tab layout means it runs once the user is authenticated.
This avoids running the check during the auth flow where network conditions might
interfere with the authentication API calls.

**EAS Update channel configuration (`app.json`):**
```json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/YOUR_PROJECT_ID",
      "checkAutomatically": "ON_LOAD",
      "fallbackToCacheTimeout": 0
    },
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}
```
`checkAutomatically: "ON_LOAD"` — expo-updates also runs its own check on launch.
Your custom `useOTAUpdate` hook gives you control over what happens with the result.
`fallbackToCacheTimeout: 0` — if the server does not respond in 0ms, use cached bundle.
Setting this to 0 makes startup instant even on bad connections.

---

## 3. Push Notifications

### 3.1 How the notification pipeline works

```
Your Backend
    │
    │  POST to Expo Push API
    │  { to: "ExponentPushToken[xxx]", title: "...", body: "..." }
    ▼
Expo Push Service
    │
    │  Forwards to platform services
    ▼
FCM (Android)     APNs (iOS)
    │                  │
    └──────────────────┘
               │
               ▼
          User's Device
               │
          ┌────┴────────────────────────────────┐
          │  App killed: OS shows notification  │
          │  App background: OS shows it        │
          │  App foreground: you handle it      │
          └─────────────────────────────────────┘
```

Every device gets a unique **Expo Push Token** (format: `ExponentPushToken[xxx...]`).
Your backend stores this token per user and uses it to target that specific device.
The token can change — devices can reset it. Always re-register on app launch.

---

### 3.2 Requesting permission and getting the push token

```typescript
// notifications/registerPushToken.ts
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

export async function registerForPushNotifications(): Promise<string | null> {
  // Push notifications do not work on simulators — only on real devices
  if (!Device.isDevice) {
    console.warn("[Push] Must use physical device for push notifications");
    return null;
  }

  // Android 13+ requires explicit permission (like iOS has always required)
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      // MAX = shows as heads-up notification (pops over current app)
      // HIGH = shows in notification tray but not as heads-up
      vibrationPattern: [0, 250, 250, 250],
      // Vibrate pattern: [delay, vibrate, pause, vibrate] in ms
      lightColor: "#F97316",
      // LED color on devices that support it
    });
    // setNotificationChannelAsync is idempotent — safe to call on every launch
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  // Checks current permission state without prompting the user
  // Possible values: "granted", "denied", "undetermined"

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    // Only prompt if not already granted — iOS shows the system dialog only once.
    // If the user denied, this call does nothing (returns "denied" immediately).
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    // User denied notifications. Respect this. Do not prompt again.
    // You can show an in-app prompt explaining why notifications are useful,
    // and direct the user to Settings to enable them manually.
    return null;
  }

  const token = await Notifications.getExpoPushTokenAsync({
    projectId: "YOUR_EAS_PROJECT_ID",
    // Found in app.json → expo.extra.eas.projectId
    // Or in your EAS dashboard at expo.dev
  });

  // token.data looks like "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
  return token.data;
}
```

---

### 3.3 The NotificationContext — explained line by line

```typescript
// notifications/NotificationContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { registerForPushNotifications } from "./registerPushToken";
import { savePushTokenToBackend } from "@/services/user.service";

// Configure how notifications are displayed while the app is in the foreground.
// This runs once at module level — before any component mounts.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    // true = show a banner even when the app is open in foreground
    shouldPlaySound: true,
    // true = play the default notification sound
    shouldSetBadge: true,
    // true = update the app icon badge count
  }),
});
// Without setNotificationHandler, foreground notifications are silently swallowed.
// Background and killed-state notifications are always shown by the OS regardless.

type NotificationContextType = {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
};

const NotificationContext = createContext<NotificationContextType>({
  expoPushToken: null,
  notification: null,
});

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);

  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();
  // useRef instead of useState because these are subscriptions (side effects),
  // not UI state. We store them in refs so we can remove them on unmount.

  const router = useRouter();

  useEffect(() => {
    // Step 1 — get the push token
    registerForPushNotifications().then((token) => {
      if (token) {
        setExpoPushToken(token);
        // Step 2 — send it to the backend so the backend can target this device
        savePushTokenToBackend(token).catch(console.warn);
        // Fire-and-forget — if this fails, the user just won't receive push notifications
        // until the token is successfully registered (next app launch)
      }
    });

    // Step 3 — listen for notifications received while app is OPEN (foreground)
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        // notification.request.content.title — notification title
        // notification.request.content.body  — notification body
        // notification.request.content.data  — custom payload from backend
        // You could show a custom in-app toast here instead of the system banner
      });

    // Step 4 — listen for when the user TAPS a notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        // data is the custom payload you send from the backend
        // Example payload: { screen: "transfer-results", transferId: "abc123" }

        if (data?.screen === "transfer-results" && data?.transferId) {
          router.push({
            pathname: "/(tabs)/transfer-results",
            params: { transferId: data.transferId },
          });
        }
        // This works even when the app was in the background or completely killed.
        // When killed: the app launches, providers mount, this listener fires immediately.
      });

    return () => {
      // Cleanup — remove listeners when the provider unmounts
      // Without cleanup, listeners accumulate on hot reload during development
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ expoPushToken, notification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
```

---

### 3.4 Handling notification tap — deep link to a screen

The pattern is: backend sends a payload with routing information,
the app reads it on notification tap and navigates accordingly.

**Backend sends:**
```json
{
  "to": "ExponentPushToken[xxx]",
  "title": "Transfer completed",
  "body": "Your transfer of 15,000 FCFA to Jean has been processed.",
  "data": {
    "screen": "transfer-results",
    "transferId": "transfer_abc123",
    "action": "view_transfer"
  }
}
```

**App reads on tap (inside `addNotificationResponseReceivedListener`):**
```typescript
const data = response.notification.request.content.data as {
  screen?: string;
  transferId?: string;
  action?: string;
};

switch (data.action) {
  case "view_transfer":
    router.push({
      pathname: "/(tabs)/transfer-results",
      params: { transferId: data.transferId },
    });
    break;
  case "complete_kyc":
    router.push("/(kyc)/update-profile");
    break;
  case "verify_email":
    router.push("/(auth)/verify");
    break;
  default:
    // Unknown action — navigate to home tab
    router.push("/(tabs)");
}
```

---

### 3.5 Sending a push from your backend

Using the Expo Push API directly (no SDK needed on the server):

```typescript
// backend — Node.js example
async function sendTransferNotification(
  pushToken: string,
  recipientName: string,
  amount: number,
  transferId: string
) {
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Accept-Encoding": "gzip, deflate",
    },
    body: JSON.stringify({
      to: pushToken,
      sound: "default",
      title: "Transfert effectue",
      body: `Votre transfert de ${amount} FCFA vers ${recipientName} est en cours.`,
      data: {
        action: "view_transfer",
        screen: "transfer-results",
        transferId: transferId,
      },
      // iOS specific
      badge: 1,
      // Android specific
      channelId: "default",
      priority: "high",
    }),
  });
}
```

**Sending to multiple devices (batch):**
```typescript
// The Expo Push API accepts an array — up to 100 per request
const messages = users.map(user => ({
  to: user.pushToken,
  title: "...",
  body: "...",
  data: { action: "..." },
}));

// Split into chunks of 100
const chunks = [];
for (let i = 0; i < messages.length; i += 100) {
  chunks.push(messages.slice(i, i + 100));
}

for (const chunk of chunks) {
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(chunk),
  });
}
```

---

### 3.6 Rules and pitfalls

**Rule 1 — Token changes. Always re-register on launch.**
Push tokens can change when: user reinstalls the app, clears app data, resets device.
Always call `registerForPushNotifications()` on every launch and update the backend.

**Rule 2 — Respect "denied" status. Never prompt again.**
iOS only shows the permission dialog once in the app's lifetime.
If the user denied, show an in-app explanation and a button that opens Settings.
```typescript
import { Linking } from "react-native";
Linking.openSettings(); // opens the app's permission page in iOS/Android Settings
```

**Rule 3 — `setNotificationHandler` must be called before any component mounts.**
Place it at module level outside any function — not inside `useEffect` or a component.

**Rule 4 — Do not rely on notification data for security-sensitive actions.**
Anyone can craft a notification with fake data. The app must validate everything
against the real backend. A notification that says `{ action: "approve_transfer" }` should
not approve a transfer — it should navigate to a screen where the user confirms via API.

---

## 4. Local Authentication — Biometrics & PIN

### 4.1 What local auth covers

`expo-local-authentication` lets you trigger the device's built-in authentication:
- **iOS:** Face ID, Touch ID (fingerprint), or device passcode as fallback
- **Android:** Fingerprint, face recognition, iris scan, or PIN/pattern as fallback

Critically: **this never gives you access to biometric data**. The OS handles everything.
Your app only learns pass/fail. No biometric templates, no raw sensor data.

Two use cases in this app:
1. **App unlock** — require auth when the app comes to foreground from background
2. **Confirm transfer** — require auth before sending money (replaces or supplements PIN)

---

### 4.2 Checking device capability

Always check before attempting authentication — not every device supports biometrics.

```typescript
import * as LocalAuthentication from "expo-local-authentication";

async function checkBiometricSupport() {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  // true if the device has biometric hardware (sensor exists physically)
  // false on older devices or simulators

  if (!hasHardware) {
    return { supported: false, reason: "no_hardware" };
  }

  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  // true if the user has set up biometrics in device settings
  // false if hardware exists but user never configured Face ID / fingerprint

  if (!isEnrolled) {
    return { supported: false, reason: "not_enrolled" };
    // You can suggest the user enable biometrics in device Settings
  }

  const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
  // Returns an array of AuthenticationType enum values:
  // FINGERPRINT = 1  (Touch ID, Android fingerprint)
  // FACIAL_RECOGNITION = 2  (Face ID, Android face unlock)
  // IRIS = 3  (Samsung iris scanner)

  const hasFaceId = types.includes(
    LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
  );
  const hasFingerprint = types.includes(
    LocalAuthentication.AuthenticationType.FINGERPRINT
  );

  return {
    supported: true,
    hasFaceId,
    hasFingerprint,
    types,
  };
}
```

---

### 4.3 Triggering authentication

```typescript
async function authenticate(reason: string): Promise<boolean> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: reason,
    // The message shown in the biometric dialog
    // iOS: shown below the Face ID animation
    // Android: shown in the fingerprint bottom sheet

    fallbackLabel: "Use PIN",
    // iOS only: label for the fallback button when biometrics fail
    // Android always falls back to device PIN/pattern automatically

    cancelLabel: "Cancel",
    // Label for the cancel button (iOS and Android)

    disableDeviceFallback: false,
    // false = if biometrics fail, offer device PIN/password as fallback
    // true = only biometrics, no PIN fallback (rare use case)

    requireConfirmation: false,
    // Android only
    // true = user must tap "Confirm" after biometric scan
    // false = instant confirmation after scan (faster UX)
  });

  // result.success — boolean, the only thing you usually need
  // result.error — error code if success is false:
  //   "user_cancel"         — user tapped Cancel
  //   "user_fallback"       — user tapped the fallback button (iOS)
  //   "system_cancel"       — OS cancelled (another app came to foreground)
  //   "not_available"       — biometrics temporarily unavailable
  //   "not_enrolled"        — no biometrics set up (race condition)
  //   "lockout"             — too many failed attempts, locked out temporarily
  //   "lockout_permanent"   — permanently locked out, only PIN can unlock
  // result.warning — informational message (rarely set)

  return result.success;
}
```

---

### 4.4 `useBiometricAuth` hook — full implementation

```typescript
// hooks/useBiometricAuth.ts
import * as LocalAuthentication from "expo-local-authentication";
import { useState, useCallback } from "react";

type AuthResult =
  | { success: true }
  | { success: false; error: string };

type BiometricCapability = {
  isAvailable: boolean;
  hasFaceId: boolean;
  hasFingerprint: boolean;
};

export const useBiometricAuth = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const checkCapability = useCallback(async (): Promise<BiometricCapability> => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) return { isAvailable: false, hasFaceId: false, hasFingerprint: false };

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) return { isAvailable: false, hasFaceId: false, hasFingerprint: false };

    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

    return {
      isAvailable: true,
      hasFaceId: types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION),
      hasFingerprint: types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT),
    };
  }, []);

  const authenticate = useCallback(
    async (promptMessage: string): Promise<AuthResult> => {
      setIsAuthenticating(true);

      try {
        const capability = await checkCapability();

        if (!capability.isAvailable) {
          // Device has no biometrics — fall through to PIN only
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage,
            disableDeviceFallback: false,
            // With no biometrics enrolled, this directly shows the PIN dialog
          });
          return result.success
            ? { success: true }
            : { success: false, error: result.error ?? "cancelled" };
        }

        const result = await LocalAuthentication.authenticateAsync({
          promptMessage,
          cancelLabel: "Annuler",
          fallbackLabel: "Utiliser le code",
          disableDeviceFallback: false,
          requireConfirmation: false,
        });

        if (result.success) {
          return { success: true };
        }

        // Map error codes to user-friendly handling
        switch (result.error) {
          case "user_cancel":
            return { success: false, error: "Authentification annulee" };
          case "lockout":
            return { success: false, error: "Trop de tentatives. Utilisez votre code PIN." };
          case "lockout_permanent":
            return { success: false, error: "Biometrie bloquee. Verrouillez et deverrouillez l'appareil." };
          default:
            return { success: false, error: "Echec de l'authentification" };
        }
      } catch (error: any) {
        return { success: false, error: error.message ?? "Unknown error" };
      } finally {
        setIsAuthenticating(false);
      }
    },
    [checkCapability]
  );

  return { authenticate, checkCapability, isAuthenticating };
};
```

---

### 4.5 App-lock on foreground resume

Lock the app when it comes back from background after a timeout.
This is the pattern used by banking apps.

```typescript
// hooks/useAppLock.ts
import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useBiometricAuth } from "./useBiometricAuth";
import { useAuthStore } from "@/store/authStore";

const LOCK_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes in background triggers lock

export const useAppLock = () => {
  const { authenticate } = useBiometricAuth();
  const { user } = useAuthStore();
  const [isLocked, setIsLocked] = useState(false);
  const backgroundTimestamp = useRef<number | null>(null);
  // useRef instead of useState because we do not want a re-render when this updates.
  // It is just a timestamp marker, not UI state.

  useEffect(() => {
    if (!user) return;
    // Only apply lock logic when the user is logged in.
    // During onboarding and auth flows, there is nothing to lock.

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    // AppState fires: "active", "background", "inactive"
    // "inactive" is a transient state on iOS (Control Center, notification shade)

    return () => subscription.remove();
    // Always clean up AppState listeners — they persist across navigations otherwise
  }, [user]);

  const handleAppStateChange = async (nextState: AppStateStatus) => {
    if (nextState === "background" || nextState === "inactive") {
      // Record the exact timestamp when the app went to background
      backgroundTimestamp.current = Date.now();
    }

    if (nextState === "active") {
      // App came back to foreground — check how long it was backgrounded
      const timestamp = backgroundTimestamp.current;

      if (!timestamp) return;
      // First launch or transitions without a recorded timestamp — no lock

      const elapsed = Date.now() - timestamp;
      backgroundTimestamp.current = null;
      // Reset timestamp — next background will record a fresh one

      if (elapsed >= LOCK_TIMEOUT_MS) {
        setIsLocked(true);
        const result = await authenticate("Confirmez votre identite pour continuer");

        if (result.success) {
          setIsLocked(false);
        } else {
          // Authentication failed or was cancelled.
          // Options: log out, keep locked, allow limited access.
          // Most banking apps log out here for security.
        }
      }
    }
  };

  return { isLocked };
};
```

**Integrate in the tab layout:**
```typescript
// app/(tabs)/_layout.tsx
import { useAppLock } from "@/hooks/useAppLock";
import { Modal, View, Text, ActivityIndicator } from "react-native";

export default function TabLayout() {
  const { isLocked } = useAppLock();

  return (
    <>
      <Modal visible={isLocked} transparent animationType="fade">
        <View className="flex-1 bg-background items-center justify-center">
          <ActivityIndicator size="large" color="#F97316" />
          <Text className="text-foreground mt-4 font-medium">
            Authentification requise...
          </Text>
        </View>
      </Modal>

      {/* rest of layout */}
    </>
  );
}
```

---

### 4.6 Confirm-before-transfer pattern

Require biometric confirmation before sending money. Called in `handleSendMoney`.

```typescript
// app/(tabs)/index.tsx — inside the Transfer component
import { useBiometricAuth } from "@/hooks/useBiometricAuth";

const { authenticate, checkCapability } = useBiometricAuth();

const handleSendMoney = async () => {
  if (!isFormValid || creatingTransfer) return;

  // Step 1 — biometric gate
  const capability = await checkCapability();

  if (capability.isAvailable) {
    const auth = await authenticate(
      `Confirmer le transfert de ${amount} FCFA vers ${recipientName}`
    );
    // The prompt message appears directly in the Face ID / fingerprint dialog.
    // Making it specific ("Confirm transfer of X FCFA") is important — the user
    // knows exactly what they are authorizing, not just "Authenticate".

    if (!auth.success) {
      Toast.show({
        type: "error",
        text1: "Transfert annule",
        text2: auth.error,
      });
      return;
      // Do NOT proceed with the transfer. Hard stop.
    }
  }
  // If biometrics are not available, proceed without auth.
  // You could also show a PIN input screen here as an alternative.

  // Step 2 — actual transfer
  const payload = { ... };
  const result = await createTransfer(payload);
  // ...
};
```

---

### 4.7 Persisting biometric preference

Let users opt in or out of biometric authentication. Store in `themeStore` or a dedicated store.

```typescript
// Add to store/themeStore.tsx
interface ThemeState {
  // ... existing fields
  biometricEnabled: boolean;
  setBiometricEnabled: (enabled: boolean) => void;
}

// Inside create():
biometricEnabled: false,
setBiometricEnabled: (enabled) => set({ biometricEnabled: enabled }),
```

**Settings toggle:**
```typescript
import { useBiometricAuth } from "@/hooks/useBiometricAuth";
import { useThemeStore } from "@/store/themeStore";
import { Fingerprint } from "lucide-react-native";
import { Switch } from "react-native";

const BiometricToggle = () => {
  const { biometricEnabled, setBiometricEnabled } = useThemeStore();
  const { checkCapability, authenticate } = useBiometricAuth();

  const handleToggle = async (value: boolean) => {
    if (value) {
      // Require a successful auth before ENABLING biometrics.
      // Prevents someone from enabling biometrics without proving they own the device.
      const capability = await checkCapability();
      if (!capability.isAvailable) {
        Toast.show({
          type: "error",
          text1: "Biometrie non disponible",
          text2: "Configurez Face ID ou empreinte dans les reglages.",
        });
        return;
      }
      const result = await authenticate("Activez l'authentification biometrique");
      if (!result.success) return;
    }

    setBiometricEnabled(value);
  };

  return (
    <View className="flex-row items-center justify-between p-4 border-b border-border">
      <View className="flex-row items-center gap-3">
        <Fingerprint size={22} color="#F97316" />
        <View>
          <Text className="text-foreground font-[500]">
            Authentification biometrique
          </Text>
          <Text className="text-muted-foreground text-sm">
            Face ID / Empreinte digitale
          </Text>
        </View>
      </View>
      <Switch
        value={biometricEnabled}
        onValueChange={handleToggle}
        trackColor={{ true: "#F97316", false: "#3f3f46" }}
        thumbColor="#ffffff"
      />
    </View>
  );
};
```

---

### 4.8 Platform differences

| Behavior | iOS | Android |
|---|---|---|
| Biometric types | Face ID (notch models), Touch ID (older) | Fingerprint, face, iris (varies by OEM) |
| Permission required | No — just `hasHardware` + `isEnrolled` | No additional permission needed |
| Fallback dialog | Custom button label (`fallbackLabel`) | Automatic PIN/pattern screen |
| Lockout behavior | 5 failed → locked, passcode required | 5 failed → locked, varies by OEM |
| `requireConfirmation` | Ignored (always instant) | Respected — adds confirm step |
| Biometric icon shown | iOS shows native Face ID animation | Android shows bottom sheet with fingerprint icon |
| `disableDeviceFallback: true` | Shows "Enter Password" fallback anyway if passcode exists | Completely disables fallback |
| App in background | Face ID auto-cancels | Fingerprint scan continues briefly |

**Detecting Face ID specifically (for showing the right icon):**
```typescript
const { hasFaceId, hasFingerprint } = await checkCapability();

// Show the right icon in the UI
const AuthIcon = hasFaceId ? ScanFace : Fingerprint;
```

**`info.plist` (iOS) — required for Face ID:**
In `app.json`, the `expo-local-authentication` plugin adds the `NSFaceIDUsageDescription`
key automatically. Without it, the app crashes on Face ID devices.
```json
{
  "expo": {
    "plugins": [
      ["expo-local-authentication", {
        "faceIDPermission": "Allow Chic Transfer to use Face ID for authentication."
      }]
    ]
  }
}
```
This string appears in the iOS Settings app under the app's permissions list.
Make it descriptive — Apple reviewers check that it accurately reflects the usage.
