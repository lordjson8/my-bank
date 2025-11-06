import React, { useState } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { Wallet } from "lucide-react-native";
import { WarningBanner } from "@/components/warning-barner";
import { AmountInput } from "@/components/amount-input";
import { PaymentMethodsSection } from "@/components/PaymentMethodSection";
import { SectionHeader } from "@/components/section-header";
import { CardPaymentForm } from "@/components/card-payment-form";
import { Link } from "expo-router";
import PhoneModal from "@/components/auth/phone-modal";
import { countries } from "@/constants";
import Checkbox from "expo-checkbox";

export default function Transfer() {
  const [amount, setAmount] = React.useState("");
  const [selectedMethod, setSelectedMethod] = React.useState("mobile");
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      style={{ flex: 1 }}
      // keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View className="flex-1">

        <ScrollView
          className="bg-gray-50"
          contentContainerStyle={{
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          
          <PhoneModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            setSelectedCountry={setSelectedCountry}
          />

          <View className="relative px-4 py-6 m-2 flex-1">
            {/* Your existing content */}
            <AmountInput amount={amount} setAmount={setAmount} />

            <PaymentMethodsSection
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
            />

            <SectionHeader icon={Wallet} title="De" />

            <View className="mt-2">
              {selectedMethod === "mobile" ? (
                <View>
                  <View className="flex-row gap-4 mt-4 items-center border border-border rounded-lg">
                    <View className="w-20">
                      <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Text className="text-center text-lg py-4 px-0 font-bold">
                          {selectedCountry.flag} {selectedCountry.code}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View className="flex-1">
                      <TextInput
                        placeholder={"Numéro de téléphone"}
                        keyboardType="phone-pad"
                        placeholderTextColor={"gray"}
                        className="w-full text-black px-0 text-lg py-4"
                      />
                    </View>
                    <Text className="text-center text-lg py-4 px-2 font-bold">
                      {selectedCountry.flag}
                    </Text>
                  </View>

                  <View  className="mt-2 px-2 border border-border rounded-lg flex-row items-center py-4 gap-2">
                    <Checkbox />
                    <Text>Je prends en charge les frais de transfert</Text>
                  </View>
                </View>
              ) : (
                <CardPaymentForm />
              )}
            </View>

            <SectionHeader icon={Wallet} title="Vers" />

            <View className="flex-row gap-4 mt-4 items-center border border-border rounded-lg">
              <View className="w-20">
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Text className="text-center text-lg py-4 px-0 font-bold">
                    {selectedCountry.flag} {selectedCountry.code}
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="flex-1">
                <TextInput
                  placeholder={"Numéro de téléphone"}
                  keyboardType="phone-pad"
                  placeholderTextColor={"gray"}
                  className="w-full text-black px-0 text-lg py-4"
                />
              </View>
              <Text className="text-center text-lg py-4 px-2 font-bold">
                {selectedCountry.flag}
              </Text>
            </View>

            <View className="px-2 py-2 rounded-lg bg-[#fae4d6] border-[#fbbf97] border-2 mt-4">
              <View className="flex-row justify-between items-center p-2">
                <Text className="text-[#374151]">Frais de transfert</Text>
                <Text className="text-primary text-2xl font-bold">
                  0 <Text>FCFA</Text>
                </Text>
              </View>

              <View className="flex-row justify-between items-center p-2 border-t-2 border-border">
                <Text className="font-bold">Frais de transfert</Text>
                <Text className="text-2xl font-bold">
                  2000 <Text>FCFA</Text>
                </Text>
              </View>
            </View>

            <View className="mt-4 mb-8">
              <Link href={"/transfer"} asChild>
                <TouchableOpacity className="rounded-xl bg-primary flex flex-row items-center py-4 justify-center gap-2">
                  <Text className="text-white text-xl font-bold">Envoyer</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
