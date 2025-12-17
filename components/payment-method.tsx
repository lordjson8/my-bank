
import { TouchableOpacity, Text } from "react-native";
import { LucideIcon } from "lucide-react-native";

interface PaymentMethodProps {
  label: string;
  selectedMethod: string;
  method: string;
  Icon: LucideIcon;
  setSelectedMethod: (value: string) => void;
}

export const PaymentMethod = ({
  label,
  selectedMethod,
  method,
  Icon,
  setSelectedMethod,
}: PaymentMethodProps) => {
  const isSelected = method === selectedMethod;
  
  return (
    <TouchableOpacity
      onPress={() => setSelectedMethod(method)}
      className={`border-2 gap-2 justify-center flex-row flex-1 my-2 text-2xl rounded-xl text-black px-4 font-bold py-4 ${
        isSelected ? "bg-[#fae4d6] border-[#fbbf97]" : "border-border"
      }`}
    >
      <Icon color={isSelected ? "#FE6703" : "#000"} size={15} />
      <Text className={isSelected ? "text-[#FE6703]" : ""}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};