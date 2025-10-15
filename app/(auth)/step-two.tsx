import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SignupHeader from "@/components/auth/signup-header";
import { Link } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";

export default function StepTwo() {
const countries = [
  { code: "+237", name: "Cameroon", flag: "🇨🇲" },
  { code: "+234", name: "Nigeria", flag: "🇳🇬" },
  { code: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "+254", name: "Kenya", flag: "🇰🇪" },
  { code: "+233", name: "Ghana", flag: "🇬🇭" },
  ];
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 p-4  bg-white">
      <ScrollView
        contentContainerStyle={{
          display: "flex",
          justifyContent: "space-between",
          minHeight: "100%",
        }}
        className="flex-1 px-4 py-8"
      >
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="w-full h-10 bg-black/50  justify-center flex-1">
            <View className="bg-white rounded-xl max-h-3/4 mx-4">
              <View className="px-4 py-4 border-b border-border">
                <Text className="text-center text-lg font-bold">
                  Select your country
                </Text>
              </View>
              <FlatList
                className="max-h-96"
                data={countries}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedCountry(item);
                      setModalVisible(false);
                    }}
                    className="px-4 py-4 flex-row items-center gap-6 border-b border-border"
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
                className="px-4 py-4 border-t border-border"
              >
                <Text className="text-center text-lg font-bold text-primary">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View className="">
          <SignupHeader
            label="Quel est ton numéro de portable ?"
            progress="40%"
            step={2}
          />
          <Text className="text-xl text-muted-foreground">
            Nous utiliserons ce numéro comme numéro de compte Swift Pay.
          </Text>
          <View className="flex-row gap-4 mt-4 items-center">
            <View className="border-b border-border  w-20 ">
              {/* <Text className="text-sm text-muted-foreground">Pays</Text> */}
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text className="text-center text-lg py-4 px-0 font-bold">
                  {selectedCountry.flag} {selectedCountry.code}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-1  border-b border-border ">
              {/* <Text className="text-sm invisible text-muted-foreground">
                {"placeholder"}
              </Text> */}
                <TextInput
                  placeholder={"Numéro de téléphone"}
                  keyboardType="phone-pad"
                  placeholderTextColor={"gray"}
                  className={` w-full text-black px-0 text-lg py-4 border-border `}
                />
            </View>
          </View>
        </View>
        <View>
          <View className="flex-row items-center gap-3 mb-4">
            <Text className="text-base text-muted-foreground">
              En fournissant votre numéro de téléphone, vous acceptez que nous
              puissions vous contacter par SMS/messagerie texte. Des frais de
              messagerie et de données peuvent s&apos;appliquer.
            </Text>
          </View>
          <View className="mt-4 mb-12">
            <Link href={"/(auth)/step-three"} asChild>
              <TouchableOpacity className="rounded-xl bg-primary flex flex-row items-center py-4 justify-center gap-2">
                <Text className="text-white text-base">Soumettre</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
