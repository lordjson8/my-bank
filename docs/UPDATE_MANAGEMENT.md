# Update Management — OTA, App Store & Version Control

> Stack: **Expo SDK 54** · `expo-updates` · `expo-application` · EAS Update · React Native

---

## Table of Contents

1. [Update Strategy Overview](#1-update-strategy-overview)
2. [OTA Updates with expo-updates](#2-ota-updates-with-expo-updates)
3. [Update Channels & Environments](#3-update-channels--environments)
4. [Update UX Patterns](#4-update-ux-patterns)
5. [Force Update (Critical Patches)](#5-force-update-critical-patches)
6. [App Store Version Checks](#6-app-store-version-checks)
7. [Version Management](#7-version-management)
8. [Update Hook — Full Implementation](#8-update-hook--full-implementation)
9. [EAS Update Workflow](#9-eas-update-workflow)
10. [Rollback Strategy](#10-rollback-strategy)
11. [Decision Table — Which Update Type?](#11-decision-table--which-update-type)

---

## 1. Update Strategy Overview

React Native / Expo gives you **three update mechanisms**. Use the right one for the right change:

```
┌────────────────────────────────────────────────────────────────────┐
│  WHAT CHANGED?                    │  USE                           │
│───────────────────────────────────│────────────────────────────────│
│  JS/TS logic, UI, styles, assets  │  OTA Update (expo-updates)     │
│  New native module, SDK upgrade   │  App Store / Play Store update  │
│  Urgent JS bug fix                │  OTA Update (force reload)     │
│  Native API permissions change    │  App Store update              │
│  Feature flag toggle              │  Remote config (no update)     │
└────────────────────────────────────────────────────────────────────┘
```

**OTA updates ship in minutes. App Store reviews take 1–3 days.**
Only changes to native code require a store release.

---

## 2. OTA Updates with expo-updates

### 2.1 How it works internally

```
App launch
    │
    ▼
Check for update in background (non-blocking)
    │
    ├── No update available ──► Launch current bundle
    │
    └── Update available ──► Download silently
             │
             ▼
         Update downloaded
             │
             ├── (Silent) ──► Apply on NEXT launch
             └── (Forced) ──► Alert user ──► Reload now
```

### 2.2 Configuration (app.config.ts)

```ts
export default {
  expo: {
    updates: {
      enabled: true,
      url: "https://u.expo.dev/YOUR_PROJECT_ID",
      // How long to wait for an update before launching the cached bundle
      fallbackToCacheTimeout: 0, // 0 = don't wait, launch immediately
      // "ON_ERROR_RECOVERY" | "NO_UPDATES_AVAILABLE" — when to not check
      checkAutomatically: "ON_LOAD", // default — checks on each launch
    },
    runtimeVersion: {
      policy: "appVersion", // ties OTA to app version — prevents incompatible updates
    },
  },
};
```

### 2.3 Runtime version policy explained

```
"appVersion"   — OTA updates only apply to matching binary version.
                 Safest. Prevents JS update from reaching incompatible binary.

"nativeVersion" — Tied to native build number. More granular.

"sdkVersion"   — Tied to Expo SDK. Useful for SDK upgrades only.

"fingerprint"  — Hash of native code. Most accurate, requires EAS.
                 RECOMMENDED for production apps.
```

> Use `"fingerprint"` policy for production — it's the only one that provably prevents a JS bundle from running against an incompatible native build.

---

## 3. Update Channels & Environments

```bash
# Create channels
eas channel:create production
eas channel:create staging
eas channel:create development

# Link a branch to a channel
eas channel:edit production --branch production
eas channel:edit staging --branch staging
```

```ts
// app.config.ts — per-environment channel
const IS_PROD = process.env.APP_ENV === "production";

export default {
  expo: {
    updates: {
      url: "https://u.expo.dev/YOUR_PROJECT_ID",
      channel: IS_PROD ? "production" : "staging",
    },
  },
};
```

---

## 4. Update UX Patterns

### Pattern A — Silent (Recommended for minor updates)

Download in background, apply on next cold start. Zero user interruption.

```ts
import * as Updates from "expo-updates";

export async function checkForUpdateSilent() {
  if (__DEV__) return; // OTA doesn't work in dev

  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      // Applied on next app launch — no user prompt
    }
  } catch (e) {
    // Network errors are common and expected — fail silently
    console.warn("OTA check failed:", e);
  }
}
```

### Pattern B — Soft prompt (Recommended for feature releases)

Download silently, then show a dismissible banner once it's ready.

```tsx
// components/UpdateBanner.tsx
import { useEffect, useState } from "react";
import * as Updates from "expo-updates";
import { Pressable, Text, View } from "react-native";

export function UpdateBanner() {
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    if (__DEV__) return;
    (async () => {
      try {
        const check = await Updates.checkForUpdateAsync();
        if (check.isAvailable) {
          await Updates.fetchUpdateAsync();
          setUpdateReady(true);
        }
      } catch { /* silent */ }
    })();
  }, []);

  if (!updateReady) return null;

  return (
    <View className="bg-primary/10 border border-primary/30 rounded-xl mx-4 p-4 flex-row items-center justify-between">
      <View className="flex-1">
        <Text className="font-semibold text-foreground">Update available</Text>
        <Text className="text-sm text-muted-foreground">Restart to get the latest improvements</Text>
      </View>
      <Pressable
        onPress={() => Updates.reloadAsync()}
        className="bg-primary px-4 py-2 rounded-lg"
      >
        <Text className="text-white font-medium">Restart</Text>
      </Pressable>
    </View>
  );
}
```

### Pattern C — Hard gate (Security patches / critical fixes)

Block app usage until user restarts. Use sparingly.

```tsx
// components/CriticalUpdateGate.tsx
import * as Updates from "expo-updates";
import { useEffect, useState } from "react";
import { Modal, View, Text, ActivityIndicator, Pressable } from "react-native";

export function CriticalUpdateGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"idle" | "downloading" | "ready">("idle");
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    if (__DEV__) return;
    checkCriticalUpdate();
  }, []);

  async function checkCriticalUpdate() {
    try {
      const check = await Updates.checkForUpdateAsync();
      if (!check.isAvailable) return;

      // Your backend tells you if the update is critical via update manifest data
      // Updates.manifest?.extra?.isCritical
      const critical = (Updates.manifest as any)?.extra?.isCritical === true;
      if (!critical) return;

      setIsCritical(true);
      setState("downloading");
      await Updates.fetchUpdateAsync();
      setState("ready");
    } catch { /* ignore */ }
  }

  if (!isCritical) return <>{children}</>;

  return (
    <Modal transparent animationType="fade" visible>
      <View className="flex-1 bg-background/95 items-center justify-center p-8 gap-6">
        <Text className="text-2xl font-bold text-foreground text-center">
          Important update required
        </Text>
        <Text className="text-muted-foreground text-center">
          We've released a critical security fix. Please update to continue.
        </Text>

        {state === "downloading" && (
          <View className="items-center gap-3">
            <ActivityIndicator color="#7C3AED" />
            <Text className="text-muted-foreground">Downloading update…</Text>
          </View>
        )}

        {state === "ready" && (
          <Pressable
            onPress={() => Updates.reloadAsync()}
            className="w-full bg-primary py-4 rounded-xl"
          >
            <Text className="text-white text-center font-bold text-lg">Apply update & restart</Text>
          </Pressable>
        )}
      </View>
    </Modal>
  );
}
```

---

## 5. Force Update (Critical Patches)

Mark an update as critical via EAS Update manifest extensions:

```bash
# Push a critical update
eas update --branch production --message "Security patch" \
  --json '{"isCritical": true}'
```

Access in app:
```ts
import * as Updates from "expo-updates";

const isCritical = (Updates.manifest as any)?.extra?.isCritical;
```

---

## 6. App Store Version Checks

OTA can't help if the user needs a new native binary. Detect this and redirect to the store.

```ts
// services/app-version.service.ts
import * as Application from "expo-application";
import { Platform, Linking, Alert } from "react-native";

interface VersionCheckResult {
  isUpToDate: boolean;
  currentVersion: string;
  latestVersion: string;
  storeUrl: string;
  isMandatory: boolean;
}

// Your backend returns the minimum required version
export async function checkAppStoreVersion(): Promise<VersionCheckResult | null> {
  try {
    const response = await fetch("https://api.chictransfer.com/app/version");
    const { minVersion, latestVersion, isMandatory } = await response.json();

    const currentVersion = Application.nativeApplicationVersion ?? "0.0.0";
    const isUpToDate = compareVersions(currentVersion, minVersion) >= 0;

    const storeUrl =
      Platform.OS === "ios"
        ? "https://apps.apple.com/app/idYOUR_APP_ID"
        : "https://play.google.com/store/apps/details?id=com.chictransfer.app";

    return { isUpToDate, currentVersion, latestVersion, storeUrl, isMandatory };
  } catch {
    return null; // Don't block the app on network errors
  }
}

// Semantic version comparison: "1.2.3" vs "1.2.0" → 1
function compareVersions(a: string, b: string): number {
  const partsA = a.split(".").map(Number);
  const partsB = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    const diff = (partsA[i] ?? 0) - (partsB[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

// Show alert and open store
export async function promptStoreUpdate(storeUrl: string, isMandatory: boolean) {
  Alert.alert(
    "Update available",
    isMandatory
      ? "A required update is available. Please update to continue using Chic Transfer."
      : "A new version of Chic Transfer is available with improvements and bug fixes.",
    [
      {
        text: "Update now",
        onPress: () => Linking.openURL(storeUrl),
      },
      ...(isMandatory ? [] : [{ text: "Later", style: "cancel" as const }]),
    ]
  );
}
```

---

## 7. Version Management

```ts
// utils/version.ts
import * as Application from "expo-application";
import Constants from "expo-constants";
import * as Updates from "expo-updates";

export function getAppInfo() {
  return {
    // Store version (e.g. "1.2.0") — shown to users
    version: Application.nativeApplicationVersion,

    // Build number — internal (e.g. "42" on iOS, "100042" on Android)
    buildNumber: Application.nativeBuildVersion,

    // OTA update ID (changes with each `eas update` push)
    otaUpdateId: Updates.updateId,

    // Whether we're running a freshly downloaded OTA
    isEmbedded: Updates.isEmbeddedLaunch,

    // JS bundle creation time
    createdAt: Updates.createdAt,
  };
}
```

**Display in settings:**
```tsx
const info = getAppInfo();
// "Version 1.2.0 (42)"
const versionLabel = `v${info.version} (${info.buildNumber})`;
```

---

## 8. Update Hook — Full Implementation

```ts
// hooks/useAppUpdate.ts
import { useEffect, useRef, useState } from "react";
import * as Updates from "expo-updates";
import { AppState, AppStateStatus } from "react-native";

type UpdateState = "idle" | "checking" | "available" | "downloading" | "ready" | "error";

export function useAppUpdate(options?: { checkOnForeground?: boolean }) {
  const [state, setState] = useState<UpdateState>("idle");
  const [error, setError] = useState<string | null>(null);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (__DEV__) return;

    // Initial check
    checkUpdate();

    // Re-check when app comes to foreground (after being backgrounded)
    if (options?.checkOnForeground) {
      const sub = AppState.addEventListener("change", handleAppStateChange);
      return () => sub.remove();
    }
  }, []);

  function handleAppStateChange(nextState: AppStateStatus) {
    if (appState.current.match(/inactive|background/) && nextState === "active") {
      checkUpdate();
    }
    appState.current = nextState;
  }

  async function checkUpdate() {
    if (state === "checking" || state === "downloading") return; // prevent concurrent checks

    setState("checking");
    setError(null);

    try {
      const result = await Updates.checkForUpdateAsync();

      if (!result.isAvailable) {
        setState("idle");
        return;
      }

      setState("available");
      await downloadUpdate();
    } catch (e) {
      setState("error");
      setError(String(e));
    }
  }

  async function downloadUpdate() {
    setState("downloading");
    try {
      await Updates.fetchUpdateAsync();
      setState("ready");
    } catch (e) {
      setState("error");
      setError(String(e));
    }
  }

  async function applyUpdate() {
    await Updates.reloadAsync();
  }

  return { state, error, checkUpdate, applyUpdate };
}
```

**Usage:**
```tsx
export function SettingsScreen() {
  const { state, applyUpdate } = useAppUpdate({ checkOnForeground: true });

  return (
    <View>
      {state === "ready" && (
        <Pressable onPress={applyUpdate} className="bg-primary p-4 rounded-xl">
          <Text className="text-white text-center">Restart to update</Text>
        </Pressable>
      )}
      {state === "checking" && <Text className="text-muted-foreground">Checking for updates…</Text>}
    </View>
  );
}
```

---

## 9. EAS Update Workflow

```bash
# Push OTA to staging
eas update --branch staging --message "Fix transfer amount validation"

# Push OTA to production
eas update --branch production --message "v1.2.1 — fix transfer amount validation"

# Push to a specific platform only
eas update --branch production --platform android --message "Android hotfix"

# List recent updates
eas update:list --branch production

# View update details (including what changed)
eas update:view UPDATE_ID

# Rollback: re-publish a previous update group
eas update:republish --group UPDATE_GROUP_ID --branch production
```

---

## 10. Rollback Strategy

**OTA rollback:**
```bash
# Find the last known-good update
eas update:list --branch production

# Republish it to the channel (users get the old JS bundle back)
eas update:republish --group GOOD_UPDATE_GROUP_ID --branch production
```

**Store rollback:**
There's no store rollback. Instead:
1. Hotfix the issue
2. Increment build number
3. Submit to expedited review (contact App Store support)
4. In the meantime, push an OTA that shows a maintenance banner

---

## 11. Decision Table — Which Update Type?

| Scenario | Mechanism | Time to users |
|----------|-----------|---------------|
| UI bug fix | OTA update | ~5 minutes |
| Copy/text change | OTA update | ~5 minutes |
| New feature (JS only) | OTA update | ~5 minutes |
| New React Native module | App Store release | 1–3 days |
| Expo SDK upgrade | App Store release | 1–3 days |
| New permission required | App Store release | 1–3 days |
| Security patch (JS) | OTA update (forced reload) | ~5 minutes |
| Security patch (native) | Expedited App Store review | ~24 hours |
| Feature flag change | Remote config | Instant |
| A/B test variant | Remote config | Instant |

> **Golden rule:** If it touches a `.native.ts` file, a native module, or `app.json` plugin config → it requires an App Store release. Everything else can be OTA.
