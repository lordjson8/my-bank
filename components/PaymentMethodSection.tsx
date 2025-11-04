
import { View, Text } from "react-native";
import { Wallet, CreditCard } from "lucide-react-native";
import { PaymentMethod } from "./payment-method";

interface PaymentMethodsSectionProps {
  selectedMethod: string;
  setSelectedMethod: (method: string) => void;
}

const METHODS = [
  {
    label: "Mobile Money",
    method: "mobile",
    Icon: Wallet,
  },
  {
    label: "Carte bancaire",
    method: "card",
    Icon: CreditCard,
  },
];

export const PaymentMethodsSection = ({
  selectedMethod,
  setSelectedMethod,
}: PaymentMethodsSectionProps) => (
  <View className="mt-2">
    <Text className="font-bold">Méthode de paiement</Text>
    <View className="flex-row items-center justify-evenly gap-1">
      {METHODS.map((method) => (
        <PaymentMethod
          key={method.method}
          Icon={method.Icon}
          label={method.label}
          method={method.method}
          selectedMethod={selectedMethod}
          setSelectedMethod={setSelectedMethod}
        />
      ))}
    </View>
  </View>
);