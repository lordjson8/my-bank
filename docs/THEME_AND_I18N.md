# Thème & Internationalisation — Guide complet

> Documentation technique pour l'application **Chic Transfer** (React Native + Expo + NativeWind v4)

---

## Table des matières

1. [Système de thème — De zéro à hero](#1-système-de-thème--de-zéro-à-hero)
   - 1.1 [Vue d'ensemble de l'architecture](#11-vue-densemble-de-larchitecture)
   - 1.2 [Couche 1 — Variables CSS (global.css)](#12-couche-1--variables-css-globalcss)
   - 1.3 [Couche 2 — Configuration Tailwind](#13-couche-2--configuration-tailwind)
   - 1.4 [Couche 3 — Le store Zustand (themeStore)](#14-couche-3--le-store-zustand-themestore)
   - 1.5 [Couche 4 — Initialisation dans le layout racine](#15-couche-4--initialisation-dans-le-layout-racine)
   - 1.6 [Couche 5 — UI de sélection du thème (Settings)](#16-couche-5--ui-de-sélection-du-thème-settings)
   - 1.7 [Utiliser les tokens de thème dans les composants](#17-utiliser-les-tokens-de-thème-dans-les-composants)
   - 1.8 [Comportement de la StatusBar](#18-comportement-de-la-statusbar)
   - 1.9 [Flux complet de bout en bout](#19-flux-complet-de-bout-en-bout)
2. [Internationalisation (i18n) — Guide pour l'avenir](#2-internationalisation-i18n--guide-pour-lavenir)
   - 2.1 [Pourquoi préparer l'i18n maintenant ?](#21-pourquoi-préparer-li18n-maintenant-)
   - 2.2 [Bibliothèque recommandée : i18next + react-i18next](#22-bibliothèque-recommandée--i18next--react-i18next)
   - 2.3 [Architecture des fichiers de traduction](#23-architecture-des-fichiers-de-traduction)
   - 2.4 [Configuration de i18next](#24-configuration-de-i18next)
   - 2.5 [Intégration dans l'application](#25-intégration-dans-lapplication)
   - 2.6 [Utilisation dans les composants](#26-utilisation-dans-les-composants)
   - 2.7 [Persister la langue choisie](#27-persister-la-langue-choisie)
   - 2.8 [Sélecteur de langue dans les Settings](#28-sélecteur-de-langue-dans-les-settings)
   - 2.9 [Formatage des dates et montants](#29-formatage-des-dates-et-montants)
   - 2.10 [Checklist de migration](#210-checklist-de-migration)

---

## 1. Système de thème — De zéro à hero

### 1.1 Vue d'ensemble de l'architecture

Le système de thème repose sur **4 couches** qui s'articulent de bas en haut :

```
┌─────────────────────────────────────────────────┐
│  4. UI (Settings screen — boutons Clair/Sombre/Système) │
├─────────────────────────────────────────────────┤
│  3. themeStore (Zustand — persiste + appelle NativeWind) │
├─────────────────────────────────────────────────┤
│  2. NativeWind colorScheme.set() — applique la classe .dark │
├─────────────────────────────────────────────────┤
│  1. global.css — CSS variables :root / .dark / @media     │
└─────────────────────────────────────────────────┘
```

**Principe de fonctionnement :**
- Les couleurs sont définies comme des **variables CSS** dans `global.css`
- NativeWind traduit ces variables en valeurs React Native à la volée
- Quand l'utilisateur change le thème, on appelle `colorScheme.set()` qui bascule la classe `.dark` sur l'élément racine
- Le store Zustand **persiste** la préférence dans SecureStore entre les sessions

---

### 1.2 Couche 1 — Variables CSS (`global.css`)

C'est la fondation. Toutes les couleurs de l'application sont définies ici en tant que variables CSS, jamais en dur dans les composants.

```css
/* ─── Mode clair (défaut) ─── */
:root {
  --color-text: #0f172a;
  --color-background: #ffffff;
  --color-foreground: #0f172a;

  --color-primary: #f97316;           /* Orange principal */
  --color-primary-foreground: #ffffff;

  --color-card: #eff6ff;              /* Fond des cartes */
  --color-card-foreground: #0f172a;

  --color-muted: #f1f5f9;             /* Zones atténuées */
  --color-muted-foreground: #64748b;

  --color-border: #e2e8f0;
  --color-destructive: #ef4444;
  --color-success: #22c55e;
}

/* ─── Mode sombre automatique (système) ─── */
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #09090b;
    --color-primary: #fb923c;
    /* ... */
  }
}

/* ─── Mode sombre forcé (toggle manuel) ─── */
.dark {
  --color-background: #09090b;
  --color-primary: #fb923c;
  /* ... */
}
```

> **Règle d'or :** Ajouter une nouvelle couleur = ajouter une variable dans `:root` ET dans `.dark`. Ne jamais coder une couleur en dur dans un composant.

---

### 1.3 Couche 2 — Configuration Tailwind (`tailwind.config.js`)

NativeWind lit les variables CSS et les expose comme classes Tailwind.

```js
module.exports = {
  darkMode: "selector", // ← CLEF : active le mode manuel via la classe .dark
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
        },
        card: {
          DEFAULT: "var(--color-card)",
          foreground: "var(--color-card-foreground)",
        },
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
        border: "var(--color-border)",
        destructive: "var(--color-destructive)",
        success: "var(--color-success)",
      },
    },
  },
};
```

`darkMode: "selector"` est **obligatoire** pour que `colorScheme.set()` de NativeWind fonctionne. Sans ça, le dark mode ne peut pas être déclenché manuellement.

---

### 1.4 Couche 3 — Le store Zustand (`store/themeStore.tsx`)

C'est le cerveau du système. Il :
1. Stocke la préférence utilisateur (`light` | `dark` | `system`)
2. Applique immédiatement le changement via NativeWind
3. Persiste la préférence dans SecureStore
4. Restaure la préférence au démarrage de l'app via `onRehydrateStorage`

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { secureStore } from "@/utils/secureStoreAdapter";
import { colorScheme } from "nativewind"; // ← API NativeWind v4

export type ThemePreference = "light" | "dark" | "system";

interface ThemeState {
  preference: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preference: "system",           // ← Valeur par défaut
      setTheme: (preference) => {
        colorScheme.set(preference);  // ← Applique immédiatement
        set({ preference });          // ← Sauvegarde dans le store
      },
    }),
    {
      name: "theme-ui-storage",
      storage: createJSONStorage(() => secureStore),
      onRehydrateStorage: () => (state) => {
        // ← Restaure au démarrage AVANT le premier rendu
        if (state?.preference) {
          colorScheme.set(state.preference);
        }
      },
    }
  )
);
```

**Pourquoi `onRehydrateStorage` ?**
Sans ce callback, l'app démarrerait toujours en mode clair puis basculerait brusquement au thème sauvegardé — un flash visible appelé FOUC (Flash Of Unstyled Content). Le callback s'exécute dès que SecureStore est lu, avant le premier rendu.

---

### 1.5 Couche 4 — Initialisation dans le layout racine (`app/_layout.tsx`)

Double protection : le store s'auto-applique via `onRehydrateStorage`, mais on ajoute aussi un `useEffect` dans le layout racine pour couvrir les cas de re-montage.

```typescript
import { colorScheme, useColorScheme } from "nativewind";
import { useThemeStore } from "@/store/themeStore";

export default function RootLayout() {
  const { preference } = useThemeStore();
  const { colorScheme: currentScheme } = useColorScheme(); // ← 'light' | 'dark'

  // Re-applique si la préférence change en cours de session
  useEffect(() => {
    colorScheme.set(preference);
  }, [preference]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* ... navigation ... */}

      {/* StatusBar dynamique selon le thème résolu */}
      <StatusBar style={currentScheme === "dark" ? "light" : "dark"} />
    </GestureHandlerRootView>
  );
}
```

> **Note :** `useColorScheme()` retourne le thème **résolu** (`light` ou `dark`), jamais `system`. C'est ce dont on a besoin pour la StatusBar.

---

### 1.6 Couche 5 — UI de sélection du thème (Settings)

```typescript
import { useThemeStore, ThemePreference } from "@/store/themeStore";
import { Sun, Moon, Monitor } from "lucide-react-native";

const THEME_OPTIONS = [
  { value: "light" as ThemePreference, label: "Clair",   Icon: Sun },
  { value: "dark"  as ThemePreference, label: "Sombre",  Icon: Moon },
  { value: "system"as ThemePreference, label: "Système", Icon: Monitor },
];

const ThemeSection = () => {
  const { preference, setTheme } = useThemeStore();

  return (
    <View className="flex-row gap-2 p-4">
      {THEME_OPTIONS.map(({ value, label, Icon }) => {
        const isSelected = preference === value;
        return (
          <TouchableOpacity
            key={value}
            onPress={() => setTheme(value)}   // ← Une seule ligne pour tout changer
            className={`flex-1 flex-row gap-1.5 items-center justify-center py-3 rounded-xl border-2 ${
              isSelected ? "border-primary bg-primary/10" : "border-border bg-card"
            }`}
          >
            <Icon size={15} color={isSelected ? "#F97316" : "#9CA3AF"} />
            <Text className={isSelected ? "text-primary font-medium" : "text-muted-foreground"}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
```

---

### 1.7 Utiliser les tokens de thème dans les composants

**❌ Ne jamais faire :**
```tsx
<View className="bg-white">
  <Text className="text-gray-900">Bonjour</Text>
  <Text className="text-gray-500">Sous-titre</Text>
</View>
```

**✅ Toujours faire :**
```tsx
<View className="bg-card">
  <Text className="text-foreground">Bonjour</Text>
  <Text className="text-muted-foreground">Sous-titre</Text>
</View>
```

**Table de correspondance des tokens :**

| Cas d'usage | Token Tailwind | Clair | Sombre |
|---|---|---|---|
| Fond principal | `bg-background` | `#ffffff` | `#09090b` |
| Fond d'une carte | `bg-card` | `#eff6ff` | `#18181b` |
| Zone atténuée | `bg-muted` | `#f1f5f9` | `#27272a` |
| Texte principal | `text-foreground` | `#0f172a` | `#fafafa` |
| Texte secondaire | `text-muted-foreground` | `#64748b` | `#a1a1aa` |
| Bordures | `border-border` | `#e2e8f0` | `#3f3f46` |
| Couleur principale | `text-primary` / `bg-primary` | `#f97316` | `#fb923c` |
| Erreur | `text-destructive` / `bg-destructive` | `#ef4444` | `#f87171` |
| Succès | `text-success` | `#22c55e` | `#4ade80` |

**Style inline avec opacité (pour overlays, etc.) :**
```tsx
// Fonctionne avec les deux modes
<View className="bg-primary/10 border border-primary/30">
```

---

### 1.8 Comportement de la StatusBar

La `StatusBar` d'Expo prend `style="light"` (texte blanc) ou `style="dark"` (texte sombre). En mode sombre, on veut un texte **clair** sur fond sombre, donc la logique est inversée :

```typescript
import { useColorScheme } from "nativewind";

const { colorScheme } = useColorScheme(); // 'light' | 'dark'

<StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
```

---

### 1.9 Flux complet de bout en bout

```
Utilisateur appuie sur "Sombre" dans Settings
        ↓
setTheme("dark") → useThemeStore
        ↓
colorScheme.set("dark") → NativeWind
        ↓
Classe .dark appliquée sur l'élément racine
        ↓
CSS variables .dark prennent effet
        ↓
Tous les composants utilisant bg-card, text-foreground, etc. se mettent à jour
        ↓
"dark" persisté dans SecureStore
        ↓
Au prochain démarrage : onRehydrateStorage() → colorScheme.set("dark")
        ↓
L'app démarre directement en mode sombre, sans flash
```

---

## 2. Internationalisation (i18n) — Guide pour l'avenir

### 2.1 Pourquoi préparer l'i18n maintenant ?

L'app cible des marchés africains. Les utilisateurs potentiels parlent :
- **Français** (actuel — Cameroun, Sénégal, Côte d'Ivoire, etc.)
- **Anglais** (Nigeria, Ghana, Kenya, Ouganda — futurs marchés)
- **Arabe** (Maroc, Tunisie, Algérie — avec RTL à gérer)

Migrer une app vers l'i18n *après coup* est coûteux. Préparer la structure maintenant coûte peu.

---

### 2.2 Bibliothèque recommandée : `i18next` + `react-i18next`

```bash
npx expo install i18next react-i18next
npx expo install expo-localization  # Pour détecter la langue du système
```

Pourquoi cette stack ?
- Standard de l'industrie, bien maintenu
- Supporte le pluriel, l'interpolation, les namespaces
- Compatible React Native + Expo sans configuration particulière
- `expo-localization` donne la locale du système sans permission supplémentaire

---

### 2.3 Architecture des fichiers de traduction

```
locales/
├── fr/
│   ├── common.json       ← Boutons, labels génériques
│   ├── transfer.json     ← Écran de transfert
│   ├── history.json      ← Historique
│   ├── settings.json     ← Paramètres
│   ├── auth.json         ← Connexion, inscription
│   ├── kyc.json          ← Vérification d'identité
│   └── errors.json       ← Messages d'erreur
├── en/
│   ├── common.json
│   ├── transfer.json
│   └── ...               ← Même structure que fr/
└── ar/
    ├── common.json
    └── ...               ← Même structure + RTL
```

**Exemple `locales/fr/transfer.json` :**
```json
{
  "title": "Transférer",
  "amount": "Montant",
  "currency": "FCFA",
  "from": "De",
  "to": "Vers",
  "fundingMethod": "Mode de financement",
  "payoutMethod": "Mode de paiement",
  "recipientName": "Nom complet du bénéficiaire",
  "recipientPhone": "Numéro du bénéficiaire",
  "description": "Description (Optionnel)",
  "descriptionPlaceholder": "Motif du transfert (optionnel)",
  "summary": {
    "transferAmount": "Montant du transfert",
    "fee": "Frais de transfert",
    "total": "Total à payer"
  },
  "sendButton": "Envoyer",
  "errors": {
    "selectFunding": "Veuillez sélectionner un mode de financement",
    "enterPhone": "Veuillez entrer votre numéro de téléphone",
    "selectDestination": "Veuillez sélectionner une destination",
    "enterRecipientName": "Veuillez entrer le nom du bénéficiaire",
    "enterRecipientPhone": "Veuillez entrer le numéro du bénéficiaire",
    "amountRequired": "Veuillez entrer un montant supérieur à 0",
    "amountOutOfRange": "Le montant doit être entre {{min}} et {{max}} FCFA"
  }
}
```

**Exemple `locales/en/transfer.json` :**
```json
{
  "title": "Transfer",
  "amount": "Amount",
  "currency": "FCFA",
  "from": "From",
  "to": "To",
  "fundingMethod": "Funding method",
  "payoutMethod": "Payout method",
  "recipientName": "Recipient full name",
  "recipientPhone": "Recipient phone number",
  "description": "Description (Optional)",
  "descriptionPlaceholder": "Reason for transfer (optional)",
  "summary": {
    "transferAmount": "Transfer amount",
    "fee": "Transfer fee",
    "total": "Total to pay"
  },
  "sendButton": "Send",
  "errors": {
    "selectFunding": "Please select a funding method",
    "enterPhone": "Please enter your phone number",
    "selectDestination": "Please select a destination",
    "enterRecipientName": "Please enter recipient's full name",
    "enterRecipientPhone": "Please enter recipient's phone number",
    "amountRequired": "Please enter an amount greater than 0",
    "amountOutOfRange": "Amount must be between {{min}} and {{max}} FCFA"
  }
}
```

---

### 2.4 Configuration de i18next

Créer `utils/i18n.ts` :

```typescript
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

// Imports statiques (bundlés dans l'app — pas de fetch réseau)
import frCommon from "@/locales/fr/common.json";
import frTransfer from "@/locales/fr/transfer.json";
import frHistory from "@/locales/fr/history.json";
import frSettings from "@/locales/fr/settings.json";
import frAuth from "@/locales/fr/auth.json";
import frErrors from "@/locales/fr/errors.json";

import enCommon from "@/locales/en/common.json";
import enTransfer from "@/locales/en/transfer.json";
import enHistory from "@/locales/en/history.json";
import enSettings from "@/locales/en/settings.json";
import enAuth from "@/locales/en/auth.json";
import enErrors from "@/locales/en/errors.json";

// Langue détectée par le système
const systemLocale = Localization.getLocales()[0]?.languageCode ?? "fr";
const supportedLanguages = ["fr", "en"];
const defaultLanguage = supportedLanguages.includes(systemLocale)
  ? systemLocale
  : "fr";

i18n.use(initReactI18next).init({
  resources: {
    fr: {
      common: frCommon,
      transfer: frTransfer,
      history: frHistory,
      settings: frSettings,
      auth: frAuth,
      errors: frErrors,
    },
    en: {
      common: enCommon,
      transfer: enTransfer,
      history: enHistory,
      settings: enSettings,
      auth: enAuth,
      errors: enErrors,
    },
  },
  lng: defaultLanguage,    // Langue initiale (peut être écrasée par le store)
  fallbackLng: "fr",       // Si une clé manque dans la langue choisie
  defaultNS: "common",     // Namespace par défaut
  interpolation: {
    escapeValue: false,    // React Native gère l'échappement
  },
});

export default i18n;
```

---

### 2.5 Intégration dans l'application

**Importer `i18n.ts` une seule fois dans `app/_layout.tsx` :**

```typescript
// app/_layout.tsx
import "@/utils/i18n"; // ← Doit être importé avant tout composant qui utilise t()
import { I18nextProvider } from "react-i18next";
import i18n from "@/utils/i18n";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <I18nextProvider i18n={i18n}>
        {/* reste de l'app */}
      </I18nextProvider>
    </GestureHandlerRootView>
  );
}
```

---

### 2.6 Utilisation dans les composants

**Hook `useTranslation` :**

```typescript
import { useTranslation } from "react-i18next";

export default function Transfer() {
  // Namespace "transfer" → lit locales/{lang}/transfer.json
  const { t } = useTranslation("transfer");

  return (
    <View>
      <Text>{t("amount")}</Text>         {/* "Montant" / "Amount" */}
      <Text>{t("sendButton")}</Text>     {/* "Envoyer" / "Send" */}

      {/* Interpolation avec variables */}
      <Text>
        {t("errors.amountOutOfRange", { min: "500", max: "500000" })}
        {/* "Le montant doit être entre 500 et 500000 FCFA" */}
      </Text>

      {/* Clés imbriquées */}
      <Text>{t("summary.total")}</Text>  {/* "Total à payer" */}
    </View>
  );
}
```

**Utiliser plusieurs namespaces dans un même composant :**

```typescript
const { t: tCommon } = useTranslation("common");
const { t: tTransfer } = useTranslation("transfer");
```

---

### 2.7 Persister la langue choisie

Ajouter un champ `language` dans le `themeStore` existant ou créer un store dédié. Le plus simple est d'étendre `themeStore` :

```typescript
// store/themeStore.tsx — version étendue avec langue
import i18n from "@/utils/i18n";

export type SupportedLanguage = "fr" | "en";

interface ThemeState {
  preference: ThemePreference;
  language: SupportedLanguage;
  setTheme: (theme: ThemePreference) => void;
  setLanguage: (lang: SupportedLanguage) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preference: "system",
      language: "fr",
      setTheme: (preference) => {
        colorScheme.set(preference);
        set({ preference });
      },
      setLanguage: (language) => {
        i18n.changeLanguage(language); // ← Change la langue dans i18next
        set({ language });             // ← Persiste le choix
      },
    }),
    {
      name: "theme-ui-storage",
      storage: createJSONStorage(() => secureStore),
      onRehydrateStorage: () => (state) => {
        if (state?.preference) colorScheme.set(state.preference);
        if (state?.language) i18n.changeLanguage(state.language);
      },
    }
  )
);
```

---

### 2.8 Sélecteur de langue dans les Settings

```typescript
import { useThemeStore, SupportedLanguage } from "@/store/themeStore";
import { Languages } from "lucide-react-native";

const LANGUAGE_OPTIONS = [
  { value: "fr" as SupportedLanguage, label: "Français", flag: "🇫🇷" },
  { value: "en" as SupportedLanguage, label: "English",  flag: "🇬🇧" },
];

const LanguageSection = () => {
  const { language, setLanguage } = useThemeStore();

  return (
    <View className="border-b border-border px-4 py-4">
      <View className="flex-row items-center gap-2 mb-3">
        <Languages color="#F97316" size={20} />
        <Text className="text-lg font-[500] text-foreground">Langue</Text>
      </View>
      <View className="flex-row gap-2">
        {LANGUAGE_OPTIONS.map(({ value, label, flag }) => {
          const isSelected = language === value;
          return (
            <TouchableOpacity
              key={value}
              onPress={() => setLanguage(value)}
              className={`flex-1 flex-row gap-2 items-center justify-center py-3 rounded-xl border-2 ${
                isSelected ? "border-primary bg-primary/10" : "border-border bg-card"
              }`}
            >
              <Text>{flag}</Text>
              <Text className={isSelected ? "text-primary font-medium" : "text-muted-foreground"}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
```

---

### 2.9 Formatage des dates et montants

Ne jamais formater les dates et montants en dur. Utiliser `Intl` qui respecte la locale.

**Dates :**
```typescript
import { useTranslation } from "react-i18next";

const formatDate = (dateStr: string, language: string): string => {
  return new Intl.DateTimeFormat(language === "fr" ? "fr-FR" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
};

// Utilisation
const { i18n } = useTranslation();
formatDate(transaction.created_at, i18n.language); // "15 janv. 2024" / "15 Jan 2024"
```

**Montants :**
```typescript
const formatAmount = (amount: number, currency: string, language: string): string => {
  return new Intl.NumberFormat(language === "fr" ? "fr-FR" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

formatAmount(15000, "XAF", "fr"); // "15 000 FCFA" (espace en séparateur)
formatAmount(15000, "XAF", "en"); // "FCFA 15,000"
```

**Pluriel avec i18next :**
```json
// locales/fr/transfer.json
{
  "methodCount": "{{count}} méthode",
  "methodCount_other": "{{count}} méthodes"
}
```
```typescript
t("methodCount", { count: activeMethods.length })
// 1 → "1 méthode"
// 3 → "3 méthodes"
```

---

### 2.10 Checklist de migration

Quand viendra le moment d'ajouter une nouvelle langue, voici les étapes dans l'ordre :

- [ ] Créer `locales/{lang}/` avec tous les fichiers JSON copiés depuis `fr/`
- [ ] Traduire chaque valeur (ne jamais traduire les **clés**, uniquement les valeurs)
- [ ] Ajouter l'import dans `utils/i18n.ts` et enregistrer dans `resources`
- [ ] Ajouter l'option dans `LANGUAGE_OPTIONS` du sélecteur Settings
- [ ] Ajouter le type `SupportedLanguage` dans `themeStore`
- [ ] Tester les chaînes avec variables (`{{min}}`, `{{max}}`, `{{count}}`)
- [ ] Vérifier le formatage des dates et montants avec `Intl`
- [ ] Si la langue est RTL (Arabe) : ajouter `I18nManager.forceRTL(true)` et redémarrer
- [ ] Vérifier que le fallback `"fr"` fonctionne pour les clés manquantes

**Pour tester une traduction manquante localement :**
```typescript
i18n.init({
  // ...
  saveMissing: true,  // Log les clés manquantes en dev
  missingKeyHandler: (lng, ns, key) => {
    console.warn(`[i18n] Clé manquante: ${ns}:${key} (${lng})`);
  },
});
```

---

*Document généré le 2026-03-16 — Chic Transfer v1.0*
