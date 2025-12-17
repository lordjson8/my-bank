import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { MessageCircle, Phone } from "lucide-react-native";

export default function Contact() {
  return (
    <View className="py-2">
      <Text className="font-bold mb-2 ">+221 77 190 26 41</Text>
      <View className="flex-row justify-evenly items-center py-2 gap-4">
        <TouchableOpacity className="bg-[#22C55E] flex-1 rounded-lg px-4 py-4 flex-row justify-center items-center space-x-2 gap-3">
          <MessageCircle size={16} color="white" />
          <Text className="text-white">WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-black flex-1 rounded-lg px-4 py-4 flex-row justify-center items-center space-x-2 gap-3">
          <Phone size={16} color="white" />
          <Text className="text-white">Appel direct</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
