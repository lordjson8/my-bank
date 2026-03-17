import { View, Text } from "react-native";
import { LucideIcon } from "lucide-react-native";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
}

export const SectionHeader = ({ icon: Icon, title }: SectionHeaderProps) => (
  <View className="mt-5 mb-1 flex-row items-center gap-2">
    <View className="w-7 h-7 rounded-full bg-primary/10 items-center justify-center">
      <Icon size={14} color="#F97316" />
    </View>
    <Text className="font-bold text-base text-foreground tracking-wide">
      {title}
    </Text>
  </View>
);
