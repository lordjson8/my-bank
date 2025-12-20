// import ChangeCode from "@/components/general/change-code";
import Contact from "../components/general/contact";

import {
  ChartLine,
  CreditCard,
  FileText,
  Headset,
  Lock,
  LucideIcon,
  Shield,
  UserPlus,
} from "lucide-react-native";

export const features = [
  {
    icon: Shield,
    title: "Sécurité renforcée",
    description:
      "Vos données sont protégées par les dernières technologies de cryptage.",
  },
  {
    icon: CreditCard,
    title: "Paiements simplifiés",
    description: "Effectuez des transactions rapidement et sans frais cachés.",
  },
  {
    icon: ChartLine,
    title: "Suivi financier",
    description: "Visualisez et gérez vos finances en temps réel.",
  },
];


interface GeneralFeature {
  icon: LucideIcon; 
  type: "component" | "link"; 
  href: string | null;
  title: string;
  description: string;
  Component: React.ComponentType | null;
}




export const general_features : GeneralFeature[] = [
  {
    icon: Headset,
    type: "component",
    href: null,
    title: "Contacter le service client",
    description: "Disponible du Lundi au Vendredi de 8h30 à 17h30",
    Component: Contact,
  },
  {
    icon: UserPlus,
    title: "Inviter un ami",
    type: "link",
    href: "/settings/invite-friend",
    description: "Partager le lien de l'application avec vos proches",
    Component: null,
  },
  {
    icon: FileText,
    type: "link",
    href: "/settings",
    title: "Conditions générales d'utilisation",
    description: "Lire les conditions générales de l'application",
    Component: null,
  },
  {
    icon: Lock,
    title: "Changer le code secret",
    type: "link",
    href: "/settings/change-code",
    description: "Modifier le code secret du compte",
    Component: null,
  },
];

export const countries = [
  { code: "+237", name: "Cameroon", flag: "🇨🇲", iso: "CM" },
  { code: "+234", name: "Nigeria", flag: "🇳🇬", iso: "NG" },
  { code: "+27", name: "South Africa", flag: "🇿🇦", iso: "ZA" },
  { code: "+254", name: "Kenya", flag: "🇰🇪", iso: "KE" },
  { code: "+233", name: "Ghana", flag: "🇬🇭", iso: "GH" },
  { code: "+20", name: "Egypt", flag: "🇪🇬", iso: "EG" },
  { code: "+212", name: "Morocco", flag: "🇲🇦", iso: "MA" },
  { code: "+251", name: "Ethiopia", flag: "🇪🇹", iso: "ET" },
  { code: "+255", name: "Tanzania", flag: "🇹🇿", iso: "TZ" },
  { code: "+243", name: "DR Congo", flag: "🇨🇩", iso: "CD" },
  { code: "+263", name: "Zimbabwe", flag: "🇿🇼", iso: "ZW" },
  { code: "+256", name: "Uganda", flag: "🇺🇬", iso: "UG" },
  { code: "+213", name: "Algeria", flag: "🇩🇿", iso: "DZ" },
  { code: "+216", name: "Tunisia", flag: "🇹🇳", iso: "TN" },
  { code: "+221", name: "Senegal", flag: "🇸🇳", iso: "SN" },
  { code: "+225", name: "Côte d'Ivoire", flag: "🇨🇮", iso: "CI" },
  { code: "+244", name: "Angola", flag: "🇦🇴", iso: "AO" },
  { code: "+258", name: "Mozambique", flag: "🇲🇿", iso: "MZ" },
  { code: "+260", name: "Zambia", flag: "🇿🇲", iso: "ZM" },
  { code: "+261", name: "Madagascar", flag: "🇲🇬", iso: "MG" },
];
