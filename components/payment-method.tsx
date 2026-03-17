import { TouchableOpacity, Text } from "react-native";
import { LucideIcon } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useEffect } from "react";

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
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isSelected) {
      scale.value = withSpring(0.94, { damping: 10 }, () => {
        scale.value = withSpring(1, { damping: 12 });
      });
    }
  }, [isSelected]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    flex: 1,
  }));

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        onPress={() => setSelectedMethod(method)}
        className={`border-2 gap-2 justify-center flex-row my-2 rounded-xl px-4 py-4 ${
          isSelected ? "bg-primary/10 border-primary" : "border-border bg-card"
        }`}
      >
        <Icon color={isSelected ? "#F97316" : "#6B7280"} size={16} />
        <Text
          className={`font-medium ${
            isSelected ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
