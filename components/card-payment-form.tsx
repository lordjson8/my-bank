
import { View, Text } from "react-native";
import { CreditCard, Lock } from "lucide-react-native";
import Input from "@/components/auth/input";

export const CardPaymentForm = () => (
  <View className="border-border border-2 rounded-lg px-2 py-3">
    <View className="flex-row items-center justify-between">
      <View className="flex-row gap-2 items-center">
        <CreditCard size={20} color={"#F97316"} />
        <Text className="font-bold">Informations de carte</Text>
      </View>
      <Lock size={16} color={"#9CA3AF"} />
    </View>
    <View className="mt-3">
      <Input
        keyboardType="default"
        secure={false}
        value=""
        setValue={() => {}}
        label="Numéro de carte"
        placeholder="1234 5678 9012 3456"
      />
      <Input
        keyboardType="default"
        secure={false}
        value=""
        setValue={() => {}}
        label="Nom sur la carte"
        placeholder="JOHN DOE"
      />
      <View className="flex-row items-center justify-evenly gap-2">
        <Input
          keyboardType="default"
          secure={false}
          value=""
          setValue={() => {}}
          label="Date d'expiration"
          placeholder="MM/AA"
        />
        <Input
          keyboardType="default"
          secure={false}
          value=""
          setValue={() => {}}
          label="CVV"
          placeholder="123"
        />
      </View>
    </View>
  </View>
);