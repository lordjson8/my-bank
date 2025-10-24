import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CircleCheckBig } from "lucide-react-native";

export default function CongratulationsScreen() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className=" px-8 items-center min-h-screen flex justify-center ">
        <View className="mb-6 bg-green-100 rounded-full w-20 h-20 flex items-center justify-center">
          <CircleCheckBig size={48} color={"#16A34A"} />
        </View>
        <Text className="text-4xl font-extrabold text-gray-900 mb-4 text-center">
          Félicitations !
        </Text>

        <Text className="text-xl text-gray-600 mb-12 text-center leading-6">
          Votre compte a été créé avec succès. Vous pouvez maintenant accéder à
          tous nos services bancai
        </Text>
        <View className="w-full rounded-xl px-6 py-6 bg-card">
          <Text className="text-center text-xl mb-3 font-semibold">Prochaines étapes</Text>

          <View className="flex-row gap-3 items-center mb-2">
            <View className="bg-primary rounded-full flex items-center justify-center w-6 h-6">
              <Text className="text-white ">1</Text>
            </View>
            <Text className="text-lg">Explorez votre tableau de bord</Text>
          </View>
          <View className="flex-row gap-3 items-center mb-2">
            <View className="bg-primary rounded-full flex items-center justify-center w-6 h-6">
              <Text className="text-white ">2</Text>
            </View>
            <Text className="text-lg">Complétez votre profil financier</Text>
          </View>
          <View className="flex-row gap-3 items-center mb-2">
            <View className="bg-primary rounded-full flex items-center justify-center w-6 h-6">
              <Text className="text-white ">3</Text>
            </View>
            <Text className="text-lg">Activez votre carte bancaire</Text>
          </View>
        </View>
        <Link href={'/(tabs)/dashboard'} asChild>
          <TouchableOpacity className="mt-6 bg-primary rounded-xl w-full py-4 ">
            <Text className="text-center text-white font-bold">
              Accéder à mon compte
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}
