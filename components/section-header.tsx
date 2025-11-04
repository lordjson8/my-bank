
import { View, Text } from "react-native";
import { LucideIcon } from "lucide-react-native";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
}

export const SectionHeader = ({ icon: Icon, title }: SectionHeaderProps) => (
  <View className="mt-2 flex-row items-center gap-2">
    <Icon size={15} />
    <Text>{title}</Text>
  </View>
);