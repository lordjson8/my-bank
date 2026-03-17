import { View, Text, TextInput } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface AmountInputProps {
  amount: string;
  setAmount: (value: string) => void;
}

export const AmountInput = ({ amount, setAmount }: AmountInputProps) => (
  <Animated.View entering={FadeInDown.duration(400)} className="mb-2">
    <Text className="font-bold text-foreground mb-1">Montant</Text>
    <View className="flex-row items-center border-2 my-2 rounded-xl border-border bg-card overflow-hidden">
      <TextInput
        placeholder="0"
        value={amount}
        keyboardType="decimal-pad"
        autoCapitalize="none"
        onChangeText={setAmount}
        placeholderTextColor="#9CA3AF"
        className="flex-1 text-3xl text-foreground px-4 font-bold py-4"
      />
      <View className="px-4 py-4 border-l border-border">
        <Text className="text-primary font-bold text-lg">FCFA</Text>
      </View>
    </View>
  </Animated.View>
);
