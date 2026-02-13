import { View, Text, TouchableOpacity, Linking } from "react-native";
import React from "react";
import { MessageCircle, Phone } from "lucide-react-native";

const phoneNumber = "+237656849690";
const whatsappNumber = "237656849690";
const message = "Hello, I need support";

export default function Contact() {
  const callPhone = async () => {
    const url = `tel:${phoneNumber}`;
    await Linking.openURL(url);
  };

  const openWhatsapp = async () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    await Linking.openURL(url);
  };

  return (
    <View className="py-2">
      <Text className="font-bold mb-2">{phoneNumber}</Text>
      <View className="flex-row justify-evenly items-center py-2 gap-4">
        <TouchableOpacity onPress={openWhatsapp} className="bg-[#22C55E] flex-1 rounded-lg px-4 py-4 flex-row justify-center items-center space-x-2 gap-3">
          <MessageCircle size={16} color="white" />
          <Text className="text-white">WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={callPhone} className="bg-black flex-1 rounded-lg px-4 py-4 flex-row justify-center items-center space-x-2 gap-3">
          <Phone size={16} color="white" />
          <Text className="text-white">Appel direct</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
