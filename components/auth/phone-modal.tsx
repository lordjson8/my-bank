import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { use, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { countries } from "@/constants";
import { Key, Search } from "lucide-react-native";
import { set } from "zod";

export default function PhoneModal({
  modalVisible,
  setModalVisible,
  setSelectedCountry,
}: {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  setSelectedCountry: (value: (typeof countries)[0]) => void;
}) {
  const [search, setSearch] = React.useState("");
  const [filtered_countries, setFilteredCountries] = React.useState(countries);

  useEffect(() => {
    setFilteredCountries(
      countries.filter(
        (country) =>
          country.name.toLowerCase().startsWith(search.toLowerCase()) ||
          country.code.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);
  return (  

    <Modal
      visible={modalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setModalVisible(false)}
    >
      <SafeAreaView className="w-full bg-black/50  justify-center flex-1">
      
          <View className="bg-white relative rounded-xl max-h-screen mx-4">
            <View className="px-4 py-4 border-b border-border">
              <Text className="text-center text-lg font-bold">
                Select your country
              </Text>
            </View>
            <View className="mt-2 mb-5 bg-gray-50 flex-row  gap-2 items-center px-2 rounded-xl mx-4">
              <Search size={17} color={"gray"} />
              <TextInput
                className="border-none w-full outline-none px-3 py-3"
                placeholder="Rechercher un pays"
                placeholderTextColor={"gray"}
                value={search}
                onChangeText={(e) => {
                  setSearch(e);
                }}
              />
            </View>
            <FlatList
              className=""
              data={filtered_countries}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedCountry(item);
                    setModalVisible(false);
                  }}
                  className="px-4 py-4 flex-row items-center gap-6 border-t border-border"
                >
                  <Text>{item.flag}</Text>
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="px-4 py-4 border-t w-fit border-border"
            >
              <Text className="text-center text-lg font-bold text-primary">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
      </SafeAreaView>
    </Modal>
  );
}
