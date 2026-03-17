# Theme System — Line by Line Deep Dive

> Every file, every line, every decision explained.
> Stack: Expo 54 + NativeWind v4 + Zustand 5 + React Native Reanimated 4

---

## The big picture before anything else

When a user taps "Dark" in Settings, this chain fires:

```
User taps button
  → setTheme("dark")                    [themeStore.tsx]
  → colorScheme.set("dark")             [NativeWind API]
  → .dark class applied on root element [NativeWind internals]
  → CSS variables inside .dark take over [global.css]
  → bg-card resolves to #18181b          [tailwind.config.js mapping]
  → Every component re-renders with dark colors
  → "dark" written to SecureStore        [Zustand persist middleware]

Next app launch:
  → SecureStore read → onRehydrateStorage fires
  → colorScheme.set("dark") before first render
  → No flash. App opens already dark.
```

There are exactly **5 files** that make this work. Each one has a single job.

---

## File 1 — `global.css`

**Job:** Define what every color token actually looks like in light mode and dark mode.
This is the only place raw hex values exist in the entire project.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
These three lines activate Tailwind. Without them, no Tailwind class works at all.
`base` resets browser/native defaults. `components` loads reusable patterns.
`utilities` loads every `bg-*`, `text-*`, `p-*` class you use.

---

```css
:root {
```
`:root` is the global scope. Variables declared here are available everywhere.
In NativeWind, `:root` maps to the root React Native view.
This block defines the **light mode values** — the defaults when no dark class is active.

```css
  --color-text: #0f172a;
```
Deep navy. Used for body text on white backgrounds.
The double-dash prefix `--` is CSS custom property syntax. The name after is arbitrary — we chose descriptive semantic names, not visual names like `--dark-blue`.

```css
  --color-background: #ffffff;
```
The main screen background. Pure white in light mode.
Every screen uses `bg-background`. If you ever want to change the global background, change this one line.

```css
  --color-foreground: #0f172a;
```
Primary text color. Same as `--color-text` here.
Some design systems split these but we keep them aligned for simplicity.

```css
  --color-primary: #f97316;
```
The brand orange. Used for buttons, active states, icons, highlights.
This single variable controls the entire brand color throughout the app.

```css
  --color-primary-foreground: #ffffff;
```
Text that sits ON TOP of the primary orange. White ensures legibility.
Used for button labels, text inside orange badges, etc.

```css
  --color-card: #eff6ff;
```
Very light blue-tinted white. Used as the background for cards, form inputs, modal sheets.
Slightly different from pure white so cards visually lift off the background.

```css
  --color-card-foreground: #0f172a;
```
Text that lives inside cards. Same deep navy as the main foreground.

```css
  --color-muted: #f1f5f9;
```
Neutral light gray. Used for disabled states, secondary backgrounds, search bars.

```css
  --color-muted-foreground: #64748b;
```
Medium gray text. Used for placeholders, subtitles, secondary labels, timestamps.
This is probably the most-used color in the whole app after `foreground`.

```css
  --color-border: #e2e8f0;
```
Subtle light gray lines. Used for dividers, input borders, card outlines.

```css
  --color-destructive: #ef4444;
```
Red. Used for error messages, delete actions, failed transaction states.

```css
  --color-success: #22c55e;
```
Green. Used for completed transaction states, verified status indicators.

```css
}
```
End of `:root` block. Light mode is fully defined.

---

```css
@media (prefers-color-scheme: dark) {
  :root {
```
This block activates automatically when the user's **device** is set to dark mode
AND the app's `preference` is `"system"`. NativeWind reads the system preference
and applies these variables without any code needed.
If `preference` is `"light"` or `"dark"`, this media query is ignored in favor of
the manual `.dark` class below.

```css
    --color-text: #ffffff;
    --color-background: #09090b;
```
Near-black background. Not pure black — pure black causes harsh contrast and eye strain.
`#09090b` is a very dark warm-neutral used by many modern dark themes.

```css
    --color-primary: #fb923c;
```
Slightly lighter orange for dark mode. The original `#f97316` would have less contrast
on dark backgrounds, so we shift it one step lighter in the orange scale.

```css
    --color-card: #18181b;
```
Dark gray for cards in dark mode. Lighter than `#09090b` background, which creates
the same "card lifting off the background" visual hierarchy as in light mode, just inverted.

```css
    --color-muted: #27272a;
```
Slightly lighter than card. The muted → card → background progression is:
`#09090b` → `#18181b` → `#27272a` (each step slightly lighter, creating depth).

```css
    --color-border: #3f3f46;
```
Visible but subtle border in dark mode. Light borders `#e2e8f0` would be far too bright
on dark backgrounds, so we use a muted zinc gray instead.

```css
  }
}
```
End of automatic system dark mode block.

---

```css
.dark {
```
This block activates when NativeWind programmatically adds the `.dark` class to the root.
This happens when `colorScheme.set("dark")` is called from code.
It has the exact same values as the `@media` block above — they must stay in sync.
Why have both? The `@media` handles `preference = "system"`. The `.dark` class handles
`preference = "dark"` (user forced it regardless of device setting).

```css
  --color-text: #ffffff;
  --color-background: #09090b;
  ...
}
```
Identical values to the `@media` block. If you change one, change the other too.

---

## File 2 — `tailwind.config.js`

**Job:** Map the CSS variables from `global.css` to Tailwind class names.
This is what allows `className="bg-card"` to mean `background: var(--color-card)`.

```js
const { hairlineWidth } = require("nativewind/theme");
```
Imports a utility from NativeWind that returns the thinnest possible line width
on the current device (1px on regular screens, 0.5px on retina). Used for hairline borders.

```js
module.exports = {
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
```
Tells Tailwind which files to scan for class names. Tailwind tree-shakes unused classes —
only classes found in these files get included in the final bundle.
If you add a new folder with components, add it here.

```js
  presets: [require("nativewind/preset")],
```
Applies NativeWind's base configuration on top of standard Tailwind.
NativeWind's preset adapts Tailwind for React Native — for example, it removes
web-only utilities like `float` and adds RN-specific ones like `flex-1`.

```js
  darkMode: "selector",
```
**This is the most critical line in the entire file.**
It tells Tailwind (and NativeWind) to use class-based dark mode instead of
the default media-query approach.
- `"media"` (default) — dark mode only responds to the device OS setting. Cannot be toggled by code.
- `"selector"` — dark mode responds to a `.dark` class on the root element. Can be set by code.
Without `"selector"`, calling `colorScheme.set("dark")` from the store would do nothing.

```js
  theme: {
    extend: {
      colors: {
        text: "var(--color-text)",
```
Maps the CSS variable to a Tailwind color name.
After this, `className="text-text"` resolves to the CSS variable `--color-text`.
The CSS variable then reads `#0f172a` in light mode or `#ffffff` in dark mode.
The whole system flows through this single mapping.

```js
        background: "var(--color-background)",
```
`className="bg-background"` → resolves to `--color-background` → `#ffffff` or `#09090b`.

```js
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
        },
```
`primary` has sub-keys. `DEFAULT` means `bg-primary` uses the main value.
`foreground` means `text-primary-foreground` uses the foreground value.
This is standard Tailwind nested color convention.

```js
        card: {
          DEFAULT: "var(--color-card)",
          foreground: "var(--color-card-foreground)",
        },
```
`bg-card` for backgrounds. `text-card-foreground` for text inside cards.

```js
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
```
`bg-muted` for muted backgrounds. `text-muted-foreground` for secondary text.

```js
        border: "var(--color-border)",
        destructive: "var(--color-destructive)",
        success: "var(--color-success)",
```
Single-value colors with no sub-keys.
`border-border` for border color. `text-destructive` for errors. `text-success` for success.

```js
      borderWidth: {
        hairline: hairlineWidth(),
      },
```
Adds `border-hairline` as a Tailwind class. Produces the thinnest possible border
on any screen density. Useful for subtle dividers.

---

## File 3 — `store/themeStore.tsx`

**Job:** Remember the user's preference, apply it immediately, save it across app restarts.

```typescript
import { create } from "zustand";
```
`create` is Zustand's main function. It takes a callback and returns a React hook.
Everything else in this file configures what that store holds and does.

```typescript
import { persist, createJSONStorage } from "zustand/middleware";
```
`persist` is a Zustand middleware that automatically saves state to storage and
restores it on the next app launch.
`createJSONStorage` wraps any key-value storage (SecureStore, AsyncStorage, etc.)
into the interface that `persist` expects.

```typescript
import { secureStore } from "@/utils/secureStoreAdapter";
```
A thin wrapper around `expo-secure-store` that adapts it to Zustand's storage interface.
SecureStore encrypts data on-device. For a theme preference this isn't strictly necessary
(it's not sensitive), but it keeps all persistence in one place for consistency.

```typescript
import { colorScheme } from "nativewind";
```
This is NativeWind's programmatic API for changing the active color scheme.
`colorScheme.set("dark")` tells NativeWind to add the `.dark` class to the root,
which triggers all the CSS variable overrides defined in `global.css`.
This only works because `tailwind.config.js` has `darkMode: "selector"`.

```typescript
export type ThemePreference = "light" | "dark" | "system";
```
A union type with exactly three valid values.
- `"light"` — force light mode regardless of device setting
- `"dark"` — force dark mode regardless of device setting
- `"system"` — follow the device OS setting
Exporting this type lets other files (like the Settings screen) import it instead
of repeating the union type, keeping things DRY.

```typescript
interface ThemeState {
  preference: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
}
```
The shape of the store. One piece of state, one action.
Defining the interface separately from the store creation gives better TypeScript
autocomplete and makes the contract explicit.

```typescript
export const useThemeStore = create<ThemeState>()(
```
`create<ThemeState>()` creates a typed Zustand store.
The double `()()` is required when using middleware — the outer call receives the type,
the inner call receives the store definition. This is Zustand's curried API pattern.
`export` makes the hook available to any component or screen that imports it.

```typescript
  persist(
```
Wraps the store definition in the `persist` middleware.
Everything inside gets automatically saved to storage on change
and restored from storage on app launch.

```typescript
    (set) => ({
```
The store factory function. `set` is Zustand's state updater.
It receives a partial state object and merges it with the current state.

```typescript
      preference: "system",
```
The initial default value before any user preference is stored.
`"system"` means the app follows the device setting out of the box —
the safest default because it respects what the user already prefers on their device.

```typescript
      setTheme: (preference) => {
        colorScheme.set(preference);
        set({ preference });
      },
```
The only action in the store. Two lines, two things:
1. `colorScheme.set(preference)` — immediately applies the change visually.
   NativeWind updates the class on the root element synchronously.
   Every component using semantic color tokens re-renders on the next frame.
2. `set({ preference })` — saves the new value into Zustand's state,
   which triggers the `persist` middleware to write it to SecureStore.
The order matters: apply visually first, then persist.

```typescript
    {
      name: "theme-ui-storage",
```
The key used in SecureStore. Must be unique across all persisted stores.
(`auth-ui-storage` is used by the auth store — keep names distinct to avoid collisions.)

```typescript
      storage: createJSONStorage(() => secureStore),
```
Tells `persist` to use SecureStore as the backend.
`createJSONStorage` handles JSON serialization/deserialization automatically —
the store reads and writes plain objects but SecureStore stores strings.
The `() =>` lambda is needed because storage adapters should be lazily initialized.

```typescript
      onRehydrateStorage: () => (state) => {
```
A callback that fires when `persist` has finished reading from SecureStore.
The outer `() =>` is a factory that returns the actual callback.
The inner `(state) =>` is that callback, receiving the restored state.
This fires once per app launch, before the first render if timing allows.

```typescript
        if (state?.preference) {
          colorScheme.set(state.preference);
        }
```
Re-applies the stored preference to NativeWind immediately on restore.
Without this, the sequence would be:
  1. App launches with default `"system"` theme
  2. Screen renders (flash of wrong theme)
  3. Zustand reads SecureStore
  4. `setTheme("dark")` called → re-renders to correct theme

With this, `colorScheme.set()` runs before rendering begins, eliminating the flash.
The `?.` optional chaining guards against `state` being `null` on a fresh install.

---

## File 4 — `app/_layout.tsx`

**Job:** Apply the stored theme on every app launch, wire the StatusBar to the active scheme.

```typescript
import { colorScheme, useColorScheme } from "nativewind";
```
Two different imports from NativeWind:
- `colorScheme` — the imperative object. `colorScheme.set()` changes the scheme from code.
- `useColorScheme` — a React hook. Returns the **resolved** current scheme (`"light"` or `"dark"`).
  If preference is `"system"`, this hook resolves it to the actual device value.
  This resolved value is what the StatusBar needs.

```typescript
import { useThemeStore } from "@/store/themeStore";
```
The Zustand hook. Gives access to `preference` (stored user choice)
and `setTheme` (the action). Here we only need `preference`.

```typescript
  const { preference } = useThemeStore();
```
Subscribes this component to the `preference` value.
Whenever `setTheme` is called anywhere in the app, this component re-renders
and the `useEffect` below fires with the new value.

```typescript
  const { colorScheme: currentScheme } = useColorScheme();
```
Gets the resolved current scheme. We alias it to `currentScheme` to avoid naming
collision with the imported `colorScheme` object above.
`currentScheme` will be `"light"` or `"dark"` — never `"system"`.

```typescript
  useEffect(() => {
    colorScheme.set(preference);
  }, [preference]);
```
A safety net: re-applies the preference every time it changes.
In practice, `setTheme` in the store already calls `colorScheme.set()` synchronously,
so this `useEffect` rarely does work. But it covers edge cases:
- Hot reload during development resets NativeWind's state
- The layout re-mounts (navigation stack resets)
- Any scenario where NativeWind and the store fall out of sync
Cost is near-zero (NativeWind no-ops if the scheme hasn't actually changed).

```typescript
  <StatusBar style={currentScheme === "dark" ? "light" : "dark"} />
```
Expo's `StatusBar` `style` prop controls the color of the clock, battery, and signal icons
at the top of the screen.
- `style="dark"` means dark-colored icons (visible on light backgrounds)
- `style="light"` means light-colored icons (visible on dark backgrounds)
The logic is inverted: when the app is dark, we need light-colored status bar icons.
Using `currentScheme` (the resolved value) means this works correctly even when
`preference` is `"system"` — it reads the actual device state, not just the stored preference.

---

## File 5 — `app/(tabs)/settings/index.tsx` (ThemeSection only)

**Job:** Give the user a visible, persistent way to choose their preferred theme.

```typescript
import { useThemeStore, ThemePreference } from "@/store/themeStore";
import { Sun, Moon, Monitor } from "lucide-react-native";
```
We import both the hook and the type. The type lets TypeScript validate
that the `value` in each option is a valid `ThemePreference` string.
`Sun`, `Moon`, `Monitor` are Lucide icons representing light, dark, and system modes.

```typescript
const THEME_OPTIONS: {
  value: ThemePreference;
  label: string;
  Icon: typeof Sun
}[] = [
  { value: "light",  label: "Clair",   Icon: Sun },
  { value: "dark",   label: "Sombre",  Icon: Moon },
  { value: "system", label: "Systeme", Icon: Monitor },
];
```
Static array defined outside the component. No reason to re-create it on every render.
Each entry has a `value` (the raw preference string), a `label` (what the user sees),
and an `Icon` (the Lucide component to render). Adding a new theme option means
adding one object here — no other code changes needed.

```typescript
const { preference, setTheme } = useThemeStore();
```
`preference` — the currently active selection, used to highlight the active button.
`setTheme` — the action that applies + persists the change. Calling it does everything
described in File 3 above: NativeWind update, Zustand state update, SecureStore write.

```typescript
{THEME_OPTIONS.map(({ value, label, Icon }) => {
  const isSelected = preference === value;
```
A single boolean per option. When `true`, this button gets the highlighted style.
The comparison is referentially stable (both are string literals), so no performance concern.

```typescript
  return (
    <TouchableOpacity
      key={value}
      onPress={() => setTheme(value)}
```
The entire theme change happens in `onPress={() => setTheme(value)}`.
One function call. No local state to manage. No callbacks to wire.
The store handles everything downstream.

```typescript
      className={`flex-1 flex-row gap-1.5 items-center justify-center py-3
        rounded-xl border-2 ${
        isSelected
          ? "border-primary bg-primary/10"
          : "border-border bg-card"
      }`}
```
`border-primary` and `bg-primary/10` — orange border and 10% opacity orange fill.
`border-border` and `bg-card` — neutral border and card background for inactive buttons.
All four class names resolve through the CSS variable system, so they automatically
adapt when the dark theme is active. No hardcoded colors here.

```typescript
      <Icon size={15} color={isSelected ? "#F97316" : "#9CA3AF"} />
```
Lucide icons do not accept Tailwind classes for color — they use a `color` prop.
`#F97316` is the orange primary color (hardcoded because Lucide needs a resolved value).
`#9CA3AF` is a medium gray for inactive icons.
This is one of the few acceptable places for a hardcoded color — icon props specifically.

---

## How the 5 files talk to each other — runtime trace

### Scenario: First launch, no stored preference

```
1. App starts
2. themeStore tries to read "theme-ui-storage" from SecureStore
3. SecureStore returns null (nothing stored)
4. onRehydrateStorage fires with state = null
5. The if(state?.preference) check fails — nothing applied
6. Store initializes with default preference = "system"
7. NativeWind reads device OS setting via @media (prefers-color-scheme)
8. global.css @media block activates if device is dark
9. CSS variables switch to dark values
10. App renders with the device's theme
```

### Scenario: User taps "Dark" in Settings

```
1. onPress() fires → setTheme("dark") called
2. INSIDE setTheme:
   a. colorScheme.set("dark") fires
      → NativeWind adds .dark class to root
      → global.css .dark block takes over
      → --color-background becomes #09090b
      → --color-card becomes #18181b
      → --color-primary becomes #fb923c
      → all components using bg-card, bg-background, etc. re-render
   b. set({ preference: "dark" }) fires
      → Zustand state updates
      → persist middleware detects change
      → "dark" written to SecureStore under key "theme-ui-storage"
3. ThemeSection re-renders
   → isSelected becomes true for "dark" option
   → "Sombre" button gets orange border highlight
4. RootLayout's useEffect detects preference change (already "dark", no-op)
5. StatusBar: currentScheme = "dark" → style="light" → white status bar icons
```

### Scenario: App restarts after user chose "Dark"

```
1. App starts
2. themeStore reads "theme-ui-storage" from SecureStore
3. Returns { preference: "dark" }
4. onRehydrateStorage fires with state = { preference: "dark" }
5. colorScheme.set("dark") fires IMMEDIATELY
   → .dark class applied before first render
   → No flash. App opens dark.
6. Store hydrates with preference = "dark"
7. RootLayout's useEffect fires → colorScheme.set("dark") again (no-op, already dark)
8. StatusBar reads currentScheme = "dark" → style="light"
```

---

## Rules to follow when modifying this system

**1. Never use raw hex values in components.**
If you need a new color, add it to `global.css` under `:root` and `.dark`,
map it in `tailwind.config.js`, then use the token class name in components.

**2. Never call `colorScheme.set()` anywhere except `themeStore.tsx`.**
The store is the single source of truth. Calling it elsewhere creates state divergence.

**3. Always add variables to both `:root` and `.dark` in `global.css`.**
Adding to `:root` but not `.dark` means the color will not change in dark mode —
silent bug that only shows up when testing dark mode.

**4. Use `useColorScheme()` hook when you need the resolved value in a component.**
Never derive "are we in dark mode?" from `preference === "dark"` — that misses
the case where `preference = "system"` and the device is dark.
`useColorScheme()` from NativeWind always gives you the true resolved value.

**5. Icon color props are the only acceptable place for hardcoded hex values.**
Lucide icons, some native components, and `style={{}}` props sometimes require resolved
values. In these specific cases, use the exact hex: `#F97316` for primary orange.
Add a comment noting the token it corresponds to.

---

## Adding a new color token — step by step

Say you need an "info" color (blue) for informational banners.

**Step 1 — `global.css`**
```css
:root {
  --color-info: #3b82f6;           /* add under :root */
  --color-info-foreground: #ffffff;
}
@media (prefers-color-scheme: dark) {
  :root {
    --color-info: #60a5fa;         /* add in @media dark */
    --color-info-foreground: #ffffff;
  }
}
.dark {
  --color-info: #60a5fa;           /* add in .dark (same as @media) */
  --color-info-foreground: #ffffff;
}
```

**Step 2 — `tailwind.config.js`**
```js
colors: {
  // ...existing colors...
  info: {
    DEFAULT: "var(--color-info)",
    foreground: "var(--color-info-foreground)",
  },
}
```

**Step 3 — Use in any component**
```tsx
<View className="bg-info/10 border border-info rounded-xl p-3">
  <Text className="text-info-foreground">Information importante</Text>
</View>
```

Done. The color automatically adapts to light and dark mode, with no further changes needed.
