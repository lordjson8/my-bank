# Native Components — When to Use What

> Senior guide for React Native · Expo SDK 54 · React 19 · NativeWind v4

---

## Table of Contents

1. [Scrollable Containers — FlatList vs FlashList vs ScrollView](#1-scrollable-containers)
2. [Pressable vs TouchableOpacity vs TouchableHighlight](#2-pressable-vs-touchable)
3. [Modal vs BottomSheet vs Stack Screen](#3-modal-vs-bottomsheet-vs-stack-screen)
4. [TextInput — Production Patterns](#4-textinput--production-patterns)
5. [Image — expo-image vs Image vs FastImage](#5-image)
6. [Platform-Specific Components](#6-platform-specific-components)
7. [KeyboardAvoidingView — The Right Way](#7-keyboardavoidingview)
8. [RefreshControl](#8-refreshcontrol)
9. [StatusBar & SafeAreaView](#9-statusbar--safeareaview)
10. [Haptics — When and How](#10-haptics)
11. [Performance Rules](#11-performance-rules)

---

## 1. Scrollable Containers

### Decision table

```
Need infinite scroll or large list (>50 items)?  ──► FlatList or FlashList
Need horizontal card carousel?                    ──► FlatList (horizontal)
Need small, fixed content (settings screen)?      ──► ScrollView
Need 2-column grid?                               ──► FlatList (numColumns)
Need virtualized list with best performance?      ──► FlashList (@shopify/flash-list)
```

---

### ScrollView — use for static/short content

```tsx
import { ScrollView, View } from "react-native";

// ✅ Good uses:
// - Form screens with a few fields
// - Settings pages
// - Profile screens
// - Detail screens

<ScrollView
  contentContainerClassName="p-4 gap-6 pb-24" // pb-24 = space for bottom tabs
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled"          // taps dismiss keyboard AND trigger onPress
  bounces={true}                               // iOS rubber band effect
>
  <ProfileHeader />
  <FormSection />
</ScrollView>
```

**Don't do this:**
```tsx
// ❌ Never put FlatList / SectionList inside ScrollView
// Both try to manage scroll — this kills virtualization and causes layout errors
<ScrollView>
  <FlatList ... />  {/* WRONG */}
</ScrollView>
```

---

### FlatList — production-grade list

```tsx
import { FlatList, View, Text } from "react-native";

type Transaction = { id: string; amount: number; recipient: string; date: string };

function TransactionList({ data }: { data: Transaction[] }) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TransactionRow transaction={item} />}

      // Performance
      removeClippedSubviews={true}           // unmount off-screen items (Android)
      maxToRenderPerBatch={10}               // items rendered per batch
      initialNumToRender={8}                 // items on first render
      windowSize={5}                         // render window = 5 * screen heights
      getItemLayout={(_, index) => ({        // skip layout measurement if height is fixed
        length: 72, offset: 72 * index, index,
      })}

      // Content
      ListHeaderComponent={<ListHeader />}
      ListFooterComponent={<ListFooter />}
      ListEmptyComponent={<EmptyState />}
      ItemSeparatorComponent={() => <View className="h-px bg-border mx-4" />}

      // Infinite scroll
      onEndReached={loadMore}
      onEndReachedThreshold={0.3}            // trigger when 30% from bottom

      // Pull to refresh
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor="#7C3AED"
          colors={["#7C3AED"]}
        />
      }

      contentContainerClassName="pb-24"
      showsVerticalScrollIndicator={false}
    />
  );
}
```

### Horizontal carousel

```tsx
<FlatList
  data={cards}
  horizontal
  showsHorizontalScrollIndicator={false}
  pagingEnabled                              // snap to each item (full-width cards)
  snapToInterval={CARD_WIDTH + CARD_GAP}    // snap to custom width cards
  snapToAlignment="start"
  decelerationRate="fast"
  contentContainerClassName="px-4 gap-4"
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <PaymentCard card={item} />}
/>
```

### SectionList — grouped content

```tsx
import { SectionList } from "react-native";

// Perfect for: grouped transaction history ("Today", "Yesterday", "This week")
<SectionList
  sections={groupedTransactions}   // [{ title: "Today", data: [...] }]
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <TransactionRow transaction={item} />}
  renderSectionHeader={({ section }) => (
    <View className="bg-background py-2 px-4">
      <Text className="text-sm font-semibold text-muted-foreground">{section.title}</Text>
    </View>
  )}
  stickySectionHeadersEnabled={true}       // headers stick on scroll
/>
```

---

## 2. Pressable vs Touchable

### Decision table

```
Need full control over press state? ──► Pressable (modern, recommended)
Need ripple effect (Android)?       ──► Pressable with android_ripple
Need opacity on press (iOS)?        ──► Pressable with opacity style
Legacy code / quick prototype?      ──► TouchableOpacity
Need highlight color change?        ──► TouchableHighlight (rarely needed)
```

### Pressable — the correct modern approach

```tsx
import { Pressable } from "react-native";

// Basic button
<Pressable
  onPress={handlePress}
  onLongPress={handleLongPress}
  delayLongPress={500}
  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} // extend tap area without visual change
  disabled={isLoading}

  // Style as a function of press state
  style={({ pressed }) => ({
    opacity: pressed ? 0.7 : 1,
    transform: [{ scale: pressed ? 0.97 : 1 }],
  })}

  // Android ripple (use inside Pressable, not className)
  android_ripple={{ color: "rgba(124, 58, 237, 0.2)", borderless: false }}

  className="bg-primary rounded-xl py-4 px-6 active:opacity-70"
>
  <Text className="text-white font-semibold text-center">Pay Now</Text>
</Pressable>
```

**With NativeWind — use `active:` modifier:**
```tsx
// NativeWind handles press state via className
<Pressable className="bg-primary rounded-xl py-4 active:opacity-70 active:scale-95">
  <Text className="text-white text-center font-semibold">Send</Text>
</Pressable>
```

### Icon buttons — always extend hit area

```tsx
// Without hitSlop, 24px icon = very hard to tap
<Pressable
  hitSlop={12}   // shorthand: extend all sides by 12px
  onPress={onClose}
  className="active:opacity-60"
>
  <X size={24} className="text-foreground" />
</Pressable>
```

### TouchableOpacity — when to still use it

```tsx
// Still valid for simple cases, but Pressable is preferred in new code
import { TouchableOpacity } from "react-native";

// Only difference: automatic opacity on press, less configurable
<TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
  <Text>Press me</Text>
</TouchableOpacity>
```

---

## 3. Modal vs BottomSheet vs Stack Screen

### Decision table

```
Full-screen overlay (loading, critical alert)?    ──► Modal
User action sheet (pick option, confirm)?         ──► BottomSheet (@gorhom/bottom-sheet)
Filters / sorting panel?                          ──► BottomSheet
Multi-step form or new page?                      ──► Stack screen (router.push)
Alert / confirm dialog?                           ──► Alert.alert() or custom Modal
Permission explanation screen?                    ──► Stack screen with modal presentation
```

### Modal — sparingly, for critical overlays

```tsx
import { Modal, View, Pressable, Text } from "react-native";

// ✅ Good: loading overlay, critical update gate, biometric lock screen
// ❌ Avoid: navigation, forms, anything that needs a back button
<Modal
  visible={isVisible}
  transparent={true}
  animationType="fade"            // "none" | "slide" | "fade"
  statusBarTranslucent={true}     // Android: overlay covers status bar
  onRequestClose={onClose}        // Android back button
>
  <Pressable
    className="flex-1 bg-black/60 items-center justify-center"
    onPress={onClose}             // tap outside to close
  >
    <Pressable
      onPress={() => {}}          // stop propagation
      className="bg-card rounded-2xl p-6 mx-6 w-full"
    >
      <Text className="text-foreground text-lg font-bold">Confirm transfer</Text>
      {/* content */}
    </Pressable>
  </Pressable>
</Modal>
```

### BottomSheet — for contextual panels

```tsx
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useRef, useCallback } from "react";

function RecipientSheet() {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["40%", "80%"], []);

  const open = () => sheetRef.current?.snapToIndex(0);
  const close = () => sheetRef.current?.close();

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}     // hidden when sheet is closed
        appearsOnIndex={0}
        opacity={0.6}
        pressBehavior="close"      // tap backdrop to close
      />
    ),
    []
  );

  return (
    <>
      <Pressable onPress={open} className="bg-primary rounded-xl py-4">
        <Text className="text-white text-center">Select Recipient</Text>
      </Pressable>

      <BottomSheet
        ref={sheetRef}
        index={-1}                 // -1 = closed initially
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: "#1a1a1a" }} // or use theme token
        handleIndicatorStyle={{ backgroundColor: "#666" }}
      >
        <BottomSheetView className="p-4">
          <Text className="text-foreground text-lg font-bold mb-4">Select Recipient</Text>
          {/* content */}
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}
```

### Stack screen with modal presentation

```tsx
// app/(tabs)/settings/change-code.tsx
// Presented as a sheet that slides up from the bottom

// In your router:
router.push("/settings/change-code");

// In your layout, mark it as a modal:
// app/(tabs)/settings/_layout.tsx
<Stack>
  <Stack.Screen name="change-code" options={{ presentation: "modal" }} />
</Stack>
```

---

## 4. TextInput — Production Patterns

```tsx
import { TextInput, View, Text } from "react-native";
import { useRef } from "react";

// Fully featured input field
function FormInput({
  label,
  value,
  onChangeText,
  error,
  nextRef,
  isLast = false,
  ...rest
}: FormInputProps) {
  return (
    <View className="gap-1.5">
      <Text className="text-sm font-medium text-foreground">{label}</Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}

        // Keyboard behavior
        returnKeyType={isLast ? "done" : "next"}
        onSubmitEditing={() => nextRef?.current?.focus()} // auto-focus next field

        // Disable autocorrect for structured fields
        autoCorrect={false}
        autoCapitalize="none"

        // Disable auto-fill for sensitive fields (PIN, OTP)
        textContentType="none"

        // Performance — only re-render on blur, not every keystroke
        // (use react-hook-form Controller for this)

        // Styling
        className={`
          bg-input border rounded-xl px-4 py-3.5 text-foreground text-base
          ${error ? "border-destructive" : "border-border"}
        `}
        placeholderTextColor="#9CA3AF"

        {...rest}
      />

      {error && <Text className="text-destructive text-xs">{error}</Text>}
    </View>
  );
}
```

### textContentType — iOS autofill

```ts
// Tell iOS what data to autofill
textContentType="emailAddress"      // email
textContentType="password"          // password
textContentType="newPassword"       // new password (suggests strong password)
textContentType="oneTimeCode"       // SMS OTP (auto-fills the 6-digit code!)
textContentType="telephoneNumber"   // phone
textContentType="name"              // full name
textContentType="none"              // disable autofill entirely
```

> **`oneTimeCode` is gold for OTP screens** — iOS auto-reads the SMS and fills the code. Only requires `textContentType="oneTimeCode"` + `keyboardType="numeric"`.

### Amount input — formatted display

```tsx
// Format money while keeping numeric value
function AmountInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [displayValue, setDisplayValue] = useState(value ? String(value) : "");

  function handleChange(text: string) {
    const cleaned = text.replace(/[^0-9.]/g, "");
    setDisplayValue(cleaned);
    const num = parseFloat(cleaned);
    onChange(isNaN(num) ? 0 : num);
  }

  return (
    <TextInput
      value={displayValue}
      onChangeText={handleChange}
      keyboardType="decimal-pad"
      placeholder="0.00"
      className="text-4xl font-bold text-center text-foreground"
    />
  );
}
```

---

## 5. Image

### Decision table

```
Expo project (managed workflow)?          ──► expo-image (recommended)
Image from remote URL?                    ──► expo-image
Local asset / bundled image?             ──► expo-image or <Image> (RN built-in)
SVG file?                                ──► react-native-svg (<SvgUri> or inline <Svg>)
Circular avatar with fallback?           ──► expo-image with contentFit="cover"
```

### expo-image — always prefer this

```tsx
import { Image } from "expo-image";

// Remote URL with fallback
<Image
  source={{ uri: user.avatarUrl }}
  placeholder={require("@/assets/images/avatar-placeholder.png")}
  contentFit="cover"               // "cover" | "contain" | "fill" | "scale-down"
  transition={200}                 // fade-in duration in ms
  cachePolicy="memory-disk"       // cache in memory AND on disk
  recyclingKey={user.id}          // key for cache recycling in lists
  style={{ width: 48, height: 48, borderRadius: 24 }}
  className="rounded-full"
/>
```

**Key advantages over RN's `<Image>`:**
- Shared memory cache between list items
- Blurhash / thumbhash placeholder while loading
- `contentFit` instead of confusing `resizeMode`
- Animated WebP, AVIF support

### Avatar with initials fallback

```tsx
function Avatar({ uri, name, size = 48 }: AvatarProps) {
  const [error, setError] = useState(false);
  const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  if (error || !uri) {
    return (
      <View
        style={{ width: size, height: size, borderRadius: size / 2 }}
        className="bg-primary items-center justify-center"
      >
        <Text className="text-white font-bold" style={{ fontSize: size * 0.38 }}>
          {initials}
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      contentFit="cover"
      onError={() => setError(true)}
    />
  );
}
```

---

## 6. Platform-Specific Components

### Platform.OS — avoid overusing it

```tsx
import { Platform } from "react-native";

// ❌ Messy — logic scattered through JSX
const paddingTop = Platform.OS === "ios" ? 44 : 24;

// ✅ Encapsulate in a Platform-specific component
// file: components/ui/PlatformPicker.ios.tsx  ← iOS version
// file: components/ui/PlatformPicker.android.tsx  ← Android version
// Metro will automatically pick the right file
```

### Platform file extensions

```
MyComponent.tsx           ← shared / default
MyComponent.ios.tsx       ← iOS only (loaded on iOS)
MyComponent.android.tsx   ← Android only (loaded on Android)
MyComponent.native.tsx    ← native only (not loaded on web)
MyComponent.web.tsx       ← web only
```

```tsx
// components/DatePicker.ios.tsx
import DateTimePicker from "@react-native-community/datetimepicker";
export function DatePicker({ value, onChange }: DatePickerProps) {
  return (
    <DateTimePicker
      value={value}
      mode="date"
      display="spinner"     // "spinner" | "compact" | "inline" | "default"
      onChange={(_, date) => date && onChange(date)}
    />
  );
}

// components/DatePicker.android.tsx
import DateTimePicker from "@react-native-community/datetimepicker";
export function DatePicker({ value, onChange }: DatePickerProps) {
  return (
    <DateTimePicker
      value={value}
      mode="date"
      display="default"     // shows native material date picker
      onChange={(_, date) => date && onChange(date)}
    />
  );
}
```

### Platform.select

```tsx
import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  shadow: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
    default: {},
  }),
});

// Usage with NativeWind — use platform modifiers
<View className="ios:shadow-md android:elevation-4 rounded-xl bg-card" />
```

---

## 7. KeyboardAvoidingView

The most misunderstood component in React Native. Here's the definitive guide:

```tsx
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

// ✅ The correct pattern
function FormScreen() {
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      // On iOS, "padding" adds padding to push content up
      // On Android, "height" reduces the view height (keyboard handles the rest)
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
      // 88 = header height (64 nav bar + 24 status bar)
      // Adjust this to your actual header height
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="p-4 gap-6 pb-12"
      >
        <TextInput ... />
        <TextInput ... />
        <Pressable className="bg-primary rounded-xl py-4">
          <Text>Submit</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
```

**Alternative — `react-native-keyboard-aware-scroll-view` (already in project):**
```tsx
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// Automatically handles keyboard avoidance without Platform branches
<KeyboardAwareScrollView
  extraScrollHeight={24}         // extra space above keyboard
  enableOnAndroid={true}         // works on Android too
  keyboardShouldPersistTaps="handled"
>
  {/* content */}
</KeyboardAwareScrollView>
```

> **Use `KeyboardAwareScrollView` for forms — it works reliably on both platforms without `behavior` tuning.**

---

## 8. RefreshControl

```tsx
import { RefreshControl, FlatList, ScrollView } from "react-native";
import { useState, useCallback } from "react";

function TransactionList() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchTransactions(); // your API call
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  return (
    <FlatList
      data={transactions}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor="#7C3AED"              // iOS spinner color
          colors={["#7C3AED", "#4F46E5"]} // Android spinner colors (cycles through them)
          progressBackgroundColor="#1a1a1a" // Android only
          title="Pull to refresh"          // iOS only
          titleColor="#9CA3AF"             // iOS only
        />
      }
    />
  );
}
```

---

## 9. StatusBar & SafeAreaView

```tsx
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

// Root layout — wrap everything
export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaProvider>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Slot />
    </SafeAreaProvider>
  );
}

// Screen level — use SafeAreaView or useSafeAreaInsets
function HomeScreen() {
  const insets = useSafeAreaInsets();
  return (
    // Option A: SafeAreaView handles all edges automatically
    <SafeAreaView className="flex-1 bg-background">
      <Content />
    </SafeAreaView>
  );
}

// Option B: manual insets (more control — e.g. don't add top inset on tab screens)
function HomeScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingBottom: insets.bottom, paddingTop: insets.top }}
    >
      <Content />
    </View>
  );
}
```

**NativeWind safe area classes:**
```tsx
// With NativeWind v4 + safe-area plugin
<View className="pb-safe pt-safe flex-1 bg-background">
  {/* automatically adjusts for notches and home indicator */}
</View>
```

---

## 10. Haptics

Haptic feedback is one of the highest-impact, lowest-effort UX improvements in mobile.

```ts
import * as Haptics from "expo-haptics";

// Haptic types — use the right one for the context
export const haptic = {
  // Light tap — small UI interactions (toggle, select item)
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),

  // Medium tap — button press, confirm action
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),

  // Heavy tap — destructive action, error
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),

  // Rigid — very sharp click (keyboard keys, toggles)
  rigid: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid),

  // Soft — subtle, springy
  soft: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft),

  // System notifications
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),

  // Selection changed (picker, slider)
  selection: () => Haptics.selectionAsync(),
};
```

**Usage rules:**
```
Transfer confirmed     ──► haptic.success()
Transfer failed        ──► haptic.error()
PIN digit entered      ──► haptic.light()
PIN incorrect          ──► haptic.error()
Toggle switch          ──► haptic.selection()
Delete/destructive     ──► haptic.heavy()
Button press           ──► haptic.medium()
Drag/reorder item      ──► haptic.light() on drag start + haptic.rigid() on drop
```

```tsx
// Wrap into a HapticPressable component
import * as Haptics from "expo-haptics";
import { Pressable, PressableProps } from "react-native";

interface HapticPressableProps extends PressableProps {
  hapticStyle?: "light" | "medium" | "heavy" | "success" | "error";
}

export function HapticPressable({
  onPress,
  hapticStyle = "medium",
  children,
  ...rest
}: HapticPressableProps) {
  function handlePress(e: any) {
    haptic[hapticStyle]();
    onPress?.(e);
  }

  return (
    <Pressable onPress={handlePress} {...rest}>
      {children}
    </Pressable>
  );
}
```

---

## 11. Performance Rules

| Rule | What to do |
|------|-----------|
| Avoid anonymous functions in `renderItem` | Define `renderItem` outside the component or with `useCallback` |
| Always provide `keyExtractor` | Use stable IDs, never array index |
| Use `getItemLayout` for fixed-height rows | Eliminates layout measurement overhead |
| Don't derive state in render | Memoize with `useMemo`, compute once |
| Avoid `useEffect` chains | Multiple sequential effects cause multiple re-renders |
| Don't put inline styles on list items | Extract to `StyleSheet.create` or className strings |
| Use `InteractionManager` for heavy work | Defer until animation is done |
| `React.memo` for list items | Prevent re-renders when parent updates |

```tsx
// Correct list item memo pattern
const TransactionRow = React.memo(
  ({ transaction }: { transaction: Transaction }) => {
    return (
      <View className="flex-row items-center p-4 gap-3">
        <Text className="text-foreground font-medium">{transaction.recipient}</Text>
        <Text className="text-primary font-bold ml-auto">+${transaction.amount}</Text>
      </View>
    );
  },
  // Optional: custom equality check for complex objects
  (prev, next) => prev.transaction.id === next.transaction.id
);

// Correct renderItem
const renderItem = useCallback(
  ({ item }: { item: Transaction }) => <TransactionRow transaction={item} />,
  [] // no deps — component is stable
);

// Don't do this
<FlatList
  renderItem={({ item }) => <TransactionRow transaction={item} />} // ❌ new function every render
/>
```

```tsx
// InteractionManager — defer heavy work until after navigation animation
import { InteractionManager } from "react-native";

useEffect(() => {
  const task = InteractionManager.runAfterInteractions(() => {
    // This runs after all animations complete
    loadLargeDataset();
  });
  return () => task.cancel();
}, []);
```
