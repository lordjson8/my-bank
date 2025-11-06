import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Link } from "expo-router";
import { CircleAlert } from "lucide-react-native";

export default function NotVerified() {
  return (
    <ScrollView
    contentContainerStyle={{ flexGrow: 1 }}
    className="flex-1 bg-white relative ">
      
      <View className="px-8 items-center justify-center flex-1 ">
        <View className="mb-6 bg-[#FEF9C3] rounded-full w-20 h-20 flex items-center justify-center">
          <CircleAlert size={48} color={"#CA8A04"} />
        </View>
        <Text className="text-xl text-gray-600  text-center leading-6">
          Votre compte n&apos;est pas validé, vous ne pouvez ajouter de numéro
          secondaire.
        </Text>
      </View>
      <View className="gap-4 mb-8">
        <Text className="text-center">Ma Banque Version 2.0.0</Text>
        <TouchableOpacity>
          <Text className="text-center font-bold text-primary">Fermer votre compte Ma Banque</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
