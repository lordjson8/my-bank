# Chic Transfer - Codebase Review & Cleanup Report

## What This App Is

A React Native / Expo mobile banking app for international money transfers across West/Central Africa (Cameroon, Senegal, Cote d'Ivoire, etc.). Users can send money via Mobile Money or card, track transactions, and manage their KYC verification.

**Tech Stack:** Expo 54, React Native 0.81, TypeScript, Zustand, NativeWind (Tailwind), Axios, React Hook Form + Zod

---

## Why The Codebase Was Messy (Honest Assessment)

### 1. Prototype Debris Everywhere

The codebase had the hallmarks of fast iteration without cleanup:

- **8 completely empty files** sitting in the repo doing nothing (`beneficiaryStore.ts`, `cardStore.ts`, `securityStore.ts`, `sigin.tsx`, `invite.tsx`, `bottom-sheet.tsx`, `env.ts`, `toast.tsx`)
- **Commented-out code blocks** in almost every major file - old approaches, debug paths, and abandoned features left rotting inline
- **Console.log statements** scattered across 30+ files, including ones that log sensitive data like login responses and environment variables
- **Test/playground code in production screens** - the dashboard had 3 BouncyCheckbox components that were clearly just testing the library

### 2. Dependency Chaos

`package.json` was a graveyard of abandoned decisions:

| Removed Package | Why It Was There | What's Actually Used |
|---|---|---|
| `@reduxjs/toolkit` + `react-redux` | Someone started with Redux | Zustand (the right choice for this app) |
| `react-native-toastify` | Duplicate toast library | `react-native-toast-message` |
| `react-native-device-info` | Duplicate device info | `expo-device` + `expo-application` |
| `react-native-biometrics` | Duplicate biometrics | `expo-local-authentication` |
| `expo-async-storage` | Old storage approach | `expo-secure-store` |
| `react-native-loading-spinner-overlay` | Unused spinner | `ActivityIndicator` used directly |

The project name was still `"quickread"` from a completely different project template.

### 3. No Type Safety Discipline

- The `any` type was used as an escape hatch everywhere: error states, API responses, component props
- `KYCStatus` was used in `profile.tsx` but never actually defined as a type - it relied on TypeScript's structural typing with an inline `Record` to sort-of work
- Variable names had typos (`setApiEroors`, `warning-barner`) that TypeScript couldn't catch because everything was `any`
- Unused imports everywhere (`set` from react-hook-form, `use` from React, `Touchable` from RN, etc.)

### 4. Architectural Smell: "Everything in One File"

The main transfer screen (`app/(tabs)/index.tsx`) is a 630-line monster component managing:
- 15+ pieces of state with `useState`
- 7 `useEffect` hooks
- Fee calculations
- Form validation
- Two modal orchestrations
- API calls
- Navigation

This should eventually be broken into custom hooks and smaller components, but that's a larger refactor.

### 5. Security Gaps

- `.env` file was NOT in `.gitignore` (only `.env*.local` was) - meaning the API URL was being committed
- `console.log("Login Response:", response.data)` was logging auth tokens to the console
- `console.log("env", process.env)` was dumping the entire environment

### 6. Naming Chaos

- Files mixed kebab-case (`payment-method.tsx`) with PascalCase (`PaymentMethodSection.tsx`)
- Tab screens named misleadingly: `add.tsx` is actually transaction **history**, `index.tsx` is the **transfer** screen
- Component named `Icon` in the tab layout shadowed the prop name `Icon` (confusing)
- Exported function in settings named `index()` with lowercase (should be `SettingsScreen()`)

### 7. Dead Navigation Routes

The auth layout registers screens like `signup-email`, `security`, `access-code` that appear to be from an earlier multi-step signup flow. Some of these files still exist with console.logs and incomplete logic. The current flow only uses `signup`, `login`, `verify-otp`, and `forget-password`.

---

## What Was Fixed

### Files Deleted (8)
- `store/beneficiaryStore.ts` - empty
- `store/cardStore.ts` - empty
- `store/securityStore.ts` - empty
- `components/auth/sigin.tsx` - empty (typo name too)
- `components/general/invite.tsx` - empty
- `components/bottom-sheet.tsx` - empty
- `components/toast.tsx` - all commented out
- `utils/env.ts` - empty

### Files Renamed (1)
- `components/warning-barner.tsx` -> `components/warning-banner.tsx` (typo fix)
  - Updated all imports in `dashboard/header.tsx` and `settings/profile.tsx`

### Type Safety Fixes
- Added `KYCStatus` type export to `types/auth.types.ts`
- Changed `User.kyc_status` from `string` to `KYCStatus`
- Changed `User.transaction_limits` from `any` to `Record<string, unknown> | null`
- Fixed `apiErrors` state from `any` to `Record<string, string[]> | null` in signup and verify-otp
- Fixed `warning-banner.tsx` `link` prop from `any` to `string | null`
- Fixed `KYCProfileData | any` to `Partial<KYCProfileData>` in user service
- Exported `GeneralFeature` interface from constants
- Changed settings `Option` prop from `{ el: any }` to `{ el: GeneralFeature }`

### Unused Import Cleanup
- Removed `import { set } from "react-hook-form"` from `authStore.ts`
- Removed `import { use } from "react"` from `dashboard/header.tsx`
- Removed `import { set, ... } from "react-hook-form"` from `signup.tsx`
- Removed `import { set } from "react-hook-form"` from `verify-otp.tsx`
- Removed `import z from "zod/v3"` from `signup.tsx`
- Removed `import PhoneModal` (unused) from `signup.tsx`
- Removed `import { useEffect, ... }` (unused) from `signup.tsx`
- Removed `import { Touchable, ... }` from `warning-banner.tsx`
- Removed `import { ExternalPathString, RelativePathString }` from `warning-banner.tsx`
- Removed `import { List, ListCollapse, Menu }` from `dashboard/header.tsx`
- Removed `import { useRef }` from `NotificationContext.tsx`
- Removed `import { TextInput }` from `settings/index.tsx`
- Removed `DarkTheme`, `DefaultTheme`, `ThemeProvider` from root `_layout.tsx`
- Removed `useColorScheme` hook usage from root `_layout.tsx`
- Removed `useAuthStore` unused import from `(tabs)/_layout.tsx`
- Removed `useNotification` unused destructuring from `(tabs)/_layout.tsx`
- Removed `registerForPushNotificationsAsync` and `Notifications` from `(tabs)/_layout.tsx`

### Console.log / Debug Code Removal
Cleaned from these critical-path files:
- `services/api.ts` - removed API_BASE_URL log
- `store/authStore.ts` - removed user fetch log
- `store/transactionStore.ts` - removed transfer error JSON log
- `app/(auth)/login.tsx` - removed login response log, backend field errors log
- `app/(auth)/signup.tsx` - removed env log, payload log, error logs, form data log
- `app/(auth)/verify-otp.tsx` - removed params log, backend error log
- `app/(tabs)/index.tsx` - removed createTransferError log
- `components/sender-payment-modal.tsx` - removed user log
- `components/general/contact.tsx` - removed encodeURI log
- `notifications/NotificationContext.tsx` - removed response log
- `app/(tabs)/settings/change-code.tsx` - removed error log

### Commented-Out Code Removal
- Root `_layout.tsx` - removed ThemeProvider wrapper, rendering guard, logout call
- `login.tsx` - removed commented error displays, commented navigation
- `signup.tsx` - removed commented error displays, commented debug router push
- `verify-otp.tsx` - removed commented console.logs
- `contact.tsx` - removed commented-out platform checks
- `change-code.tsx` - removed commented SafeAreaView, commented contentContainerStyle
- `dashboard/header.tsx` - removed commented Menu icon
- `(tabs)/_layout.tsx` - removed all `// tabBarBadge: 2` comments, `// header: Header`

### Architectural Fixes
- **Dashboard screen** - replaced test BouncyCheckbox playground with actual dashboard content
- **Tab Icon component** - renamed from `Icon` (which shadowed the prop) to `TabIcon`, removed unused `name` prop
- **Settings screen** - renamed default export from `index()` to `SettingsScreen()`
- **Empty catch block** - fixed in transfer handler to have proper comment explaining error handling
- **package.json name** - changed from `"quickread"` to `"chic-transfer"`

### .gitignore Fix
- Added `.env` and `.env.*` to gitignore (was only ignoring `.env*.local`)
- Removed duplicate `/ios` and `/android` entries
- Added comment headers for sections

### Package.json Cleanup
Removed 7 unused/duplicate dependencies:
- `@reduxjs/toolkit` (not using Redux)
- `react-redux` (not using Redux)
- `expo-async-storage` (using expo-secure-store)
- `react-native-biometrics` (duplicate of expo-local-authentication)
- `react-native-device-info` (duplicate of expo-device)
- `react-native-toastify` (duplicate of react-native-toast-message)
- `react-native-loading-spinner-overlay` (not used, using ActivityIndicator)

---

## Remaining Issues (Not Fixed - Requires Deeper Refactoring)

These need your attention but are too risky/large to change in a cleanup pass:

### High Priority
1. **Transfer screen is too large** - `app/(tabs)/index.tsx` should extract fee calculation, form validation, and state into a custom `useTransfer()` hook
2. **Remaining console.logs** in ~20 secondary files (KYC screens, auth step screens, camera components, notification setup). Run `grep -r "console\." --include="*.ts" --include="*.tsx"` to find them
3. **Missing error boundaries** - no React error boundary wrapping any screen group
4. **Hardcoded currency "XAF"** in the transfer payload - should come from the selected destination/corridor
5. **No loading state for initial app hydration** - the commented-out rendering guard in `_layout.tsx` should be re-enabled properly to show a splash screen while Zustand rehydrates

### Medium Priority
6. **Dead auth screens** - `step-one.tsx`, `step-two.tsx`, `step-three.tsx`, `step-four.tsx`, `signup-email.tsx`, `signup-verify.tsx`, `signup-terms.tsx`, `signup-info.tsx`, `signup-address.tsx`, `signup-password.tsx`, `access-code.tsx`, `security.tsx`, `verify.tsx` appear to be from an older multi-step flow. Audit and remove if unused
7. **Inconsistent i18n** - mix of French and English throughout the app. Pick one language or implement proper i18n with `i18next`
8. **File naming convention** - standardize on either kebab-case or PascalCase for component files
9. **Tab screen names** - `add.tsx` should be `history.tsx`, `index.tsx` could be `transfer.tsx` (though expo-router uses index for the default tab)
10. **Duplicate render patterns** - `renderSelectedPayoutMethod()` and `renderSelectedFundingMethod()` in the transfer screen are nearly identical and could be a shared `SelectedMethodDisplay` component

### Low Priority
11. **No tests** - zero test files in the entire project
12. **No Prettier config** - has the Tailwind plugin installed but no `.prettierrc`
13. **Unused Zod schemas** - `SignupPasswordSchema`, `SignupAddressSchema`, `SignupTermsSchema`, `SignupInfoSchema`, `InfoFormSchema` are defined but never imported anywhere. They appear to be from the abandoned multi-step signup flow
14. **`@react-navigation/drawer`** is installed but never used
15. **`react-content-loader`** and `expo-skeleton-loading` are both installed for loading states but only skeleton-loading appears used

---

## Project Structure (Post-Cleanup)

```
my-bank/
├── app/
│   ├── _layout.tsx              # Root navigation with auth guards
│   ├── transfer-result.tsx      # Transfer confirmation screen
│   ├── +not-found.tsx
│   ├── (auth)/                  # Login, signup, OTP, forgot password
│   ├── (onboarding)/            # Welcome flow
│   ├── (tabs)/                  # Main app
│   │   ├── _layout.tsx          # Tab navigation
│   │   ├── index.tsx            # Transfer screen (main)
│   │   ├── add.tsx              # Transaction history
│   │   ├── dashboard.tsx        # Dashboard (hidden tab)
│   │   ├── cards.tsx            # Cards (TODO, hidden tab)
│   │   └── settings/            # Settings screens
│   └── (kyc)/                   # KYC verification flow
├── components/
│   ├── auth/                    # Auth-related components
│   ├── dashboard/               # Dashboard components
│   ├── general/                 # Settings feature components
│   ├── shared/                  # Shared components
│   ├── ui/                      # Base UI components
│   └── *.tsx                    # Transfer-related components
├── store/                       # Zustand stores
│   ├── authStore.ts             # User & auth state
│   ├── transactionStore.ts      # Transfer history & creation
│   ├── route.store.ts           # Funding methods & destinations
│   └── notificationStore.tsx    # Push notification state
├── services/                    # API layer
│   ├── api.ts                   # Axios instance with interceptors
│   ├── user.service.ts          # Auth & KYC API calls
│   ├── transactionService.ts    # Transfer API calls
│   ├── routes.service.ts        # Payment routes API calls
│   └── device.services.ts       # Device info utility
├── types/                       # TypeScript type definitions
│   ├── auth.types.ts            # User, KYC, auth types
│   ├── transfers.ts             # Transfer types
│   └── routes.ts                # Payment method & route types
├── utils/                       # Utilities
│   ├── zod-schemas.ts           # Form validation schemas
│   ├── secureStoreAdapter.ts    # Zustand persistence adapter
│   └── useSecureStore.ts        # Secure storage hook
├── constants/index.tsx          # App constants & countries
├── hooks/                       # Custom hooks
├── notifications/               # Push notification setup
└── assets/                      # Images, fonts, icons
```
