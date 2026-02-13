import { View, Text, TextInput } from "react-native";

interface AmountInputProps {
  amount: string;
  setAmount: (value: string) => void;
}

export const AmountInput = ({ amount, setAmount }: AmountInputProps) => (
  <View className="flex-1 ">
    <Text className="font-bold">Montant</Text>
    <TextInput
      placeholder="0"
      value={amount.toString()}
      keyboardType="decimal-pad"
      autoCapitalize="none"
      onChangeText={(e) => setAmount(e)}
      placeholderTextColor="gray"
      className="border-2 my-2 text-2xl rounded-xl text-black px-4 font-bold py-4 border-border"
    />
  </View>
);