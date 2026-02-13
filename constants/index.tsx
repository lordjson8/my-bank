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


export interface GeneralFeature {
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
  { code: "+221", name: "Senegal", flag: "🇸🇳", iso: "SN" },
  { code: "+225", name: "Côte d'Ivoire", flag: "🇨🇮", iso: "CI" },
  { code: "+229", name: "Benin", flag: "🇧🇯", iso: "BJ" },
  { code: "+223", name: "Mali", flag: "🇲🇱", iso: "ML" },
  { code: "+226", name: "Burkina Faso", flag: "🇧🇫", iso: "BF" },
  { code: "+228", name: "Togo", flag: "🇹🇬", iso: "TG" },
  { code: "+224", name: "Guinea", flag: "🇬🇳", iso: "GN" },
  { code: "+241", name: "Gabon", flag: "🇬🇦", iso: "GA" },
];
