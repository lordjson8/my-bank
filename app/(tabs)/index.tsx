import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
} from "react-native";
import { Wallet, Smartphone, CreditCard, ChevronDown, Check, X } from "lucide-react-native";
import { AmountInput } from "@/components/amount-input";
import { PaymentMethodsSection } from "@/components/PaymentMethodSection";
import { SectionHeader } from "@/components/section-header";
import { CardPaymentForm } from "@/components/card-payment-form";
import { Link } from "expo-router";
import PhoneModal from "@/components/auth/phone-modal";
import { countries } from "@/constants";
import Checkbox from "expo-checkbox";
import { Destination, PayoutMethod, FundingMethod } from "@/types/routes";
import { useRoutesStore } from "@/store/route.store";
import PaymentMethodsModal from "@/components/receiver-payment-modal";

export default function Transfer() {
  const [amount, setAmount] = React.useState(0);
  const [fee, setFee] = React.useState(amount * 0.01);
  const [selectedMethod, setSelectedMethod] = React.useState("mobile");
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [senderPaymentModalVisible, setSenderPaymentModalVisible] = useState(false);
  const { fetchDestinations, destinations } = useRoutesStore()
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState<PayoutMethod | null>(null);
  const [selectedFundingMethod, setSelectedFundingMethod] = useState<FundingMethod | null>(null);
  const [senderPhoneNumber, setSenderPhoneNumber] = useState("");
  const [payoutPhoneNumber, setPayoutPhoneNumber] = useState("");
  const [sourceFundingMethods, setSourceFundingMethods] = useState<FundingMethod[]>([]);

  useEffect(() => {
    setFee(amount * 0.01);
    fetchDestinations(selectedCountry.iso);
  }, [amount, selectedCountry]);

  // Extract funding methods for the selected source country

  const handleSelectPaymentMethod = (destination: Destination, method: PayoutMethod) => {
    setSelectedDestination(destination);
    setSelectedPayoutMethod(method);
    setPayoutPhoneNumber("");
  };

  const handleSelectFundingMethod = (method: FundingMethod) => {
    setSelectedFundingMethod(method);
    setSenderPaymentModalVisible(false);
  };

  const renderSelectedPayoutMethod = () => {
    if (!selectedPayoutMethod) {
      return (
        <Text className="text-lg py-4 text-gray-400">
          Select payment method
        </Text>
      );
    }

    return (
      <View className="flex-row items-center py-2">
        {selectedPayoutMethod.icon_url ? (
          <Image
            source={{ uri: selectedPayoutMethod.icon_url }}
            className="w-8 h-8 rounded-lg mr-3"
            resizeMode="contain"
          />
        ) : (
          <View
            className="w-8 h-8 rounded-lg mr-3 items-center justify-center"
            style={{ backgroundColor: selectedPayoutMethod.brand_color || "#3B82F6" }}
          >
            <Text className="text-white font-bold text-xs">
              {selectedPayoutMethod.method_type_display.charAt(0)}
            </Text>
          </View>
        )}
        <View className="flex-1">
          <Text className="font-semibold text-gray-900">
            {selectedPayoutMethod.mobile_provider_display}
          </Text>
          <Text className="text-gray-500 text-sm">
            {selectedDestination?.country_name} • {selectedPayoutMethod.method_type_display}
          </Text>
        </View>
      </View>
    );
  };

  const renderSelectedFundingMethod = () => {
    if (!selectedFundingMethod) {
      return (
        <Text className="text-lg py-4 text-gray-400">
          Select funding method
        </Text>
      );
    }

    return (
      <View className="flex-row items-center py-2">
        {selectedFundingMethod.icon_url ? (
          <Image
            source={{ uri: selectedFundingMethod.icon_url }}
            className="w-8 h-8 rounded-lg mr-3"
            resizeMode="contain"
          />
        ) : (
          <View
            className="w-8 h-8 rounded-lg mr-3 items-center justify-center"
            style={{ backgroundColor: selectedFundingMethod.brand_color || "#3B82F6" }}
          >
            <Text className="text-white font-bold text-xs">
              {selectedFundingMethod.method_type_display.charAt(0)}
            </Text>
          </View>
        )}
        <View className="flex-1">
          <Text className="font-semibold text-gray-900">
            {selectedFundingMethod.mobile_provider_display}
          </Text>
          <Text className="text-gray-500 text-sm">
            {selectedFundingMethod.method_type_display}
          </Text>
        </View>
        <ChevronDown size={20} color="#6B7280" />
      </View>
    );
  };

  // Sender payment methods modal
  const SenderPaymentModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={senderPaymentModalVisible}
      onRequestClose={() => setSenderPaymentModalVisible(false)}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl h-3/4 pt-5">
          <View className="flex-row items-center justify-between px-5 pb-4 border-b border-gray-100">
            <View>
              <Text className="text-2xl font-bold text-gray-900">
                Select Funding Method
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                How do you want to pay?
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setSenderPaymentModalVisible(false)}
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView className="px-5 py-4">
            {sourceFundingMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                className={`flex-row items-center justify-between p-4 mb-3 rounded-xl border ${
                  selectedFundingMethod?.id === method.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
                onPress={() => handleSelectFundingMethod(method)}
              >
                <View className="flex-row items-center flex-1">
                  {method.icon_url ? (
                    <Image
                      source={{ uri: method.icon_url }}
                      className="w-12 h-12 rounded-lg mr-4"
                      resizeMode="contain"
                    />
                  ) : (
                    <View
                      className="w-12 h-12 rounded-lg mr-4 items-center justify-center"
                      style={{ backgroundColor: method.brand_color || "#3B82F6" }}
                    >
                      <Text className="text-white font-bold">
                        {method.method_type_display.charAt(0)}
                      </Text>
                    </View>
                  )}
                  
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900">
                      {method.mobile_provider_display}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {method.method_type_display}
                    </Text>
                  </View>
                </View>
                
                {selectedFundingMethod?.id === method.id && (
                  <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center">
                    <Check size={14} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
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
          modalVisible={phoneModalVisible}
          setModalVisible={setPhoneModalVisible}
          setSelectedCountry={setSelectedCountry}
        />
        
        <PaymentMethodsModal
          modalVisible={paymentModalVisible}
          setModalVisible={setPaymentModalVisible}
          onSelectPaymentMethod={handleSelectPaymentMethod}
        />

        <SenderPaymentModal />

        <View className="relative px-4 py-6 m-2 flex-1">
          {/* Amount Input */}
          <AmountInput amount={amount} setAmount={setAmount} />

          {/* Payment Method Selection */}
          <PaymentMethodsSection
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
          />

          {/* Sender Section */}
          <SectionHeader 
            icon={selectedMethod === "mobile" ? Smartphone : CreditCard} 
            title="From" 
          />

          <View className="mt-2">
            {selectedMethod === "mobile" ? (
              <View>
                {/* Country Selection */}
                <View className="flex-row gap-4 mt-4 items-center border border-border rounded-lg bg-white">
                  <View className="w-20">
                    <TouchableOpacity onPress={() => setPhoneModalVisible(true)}>
                      <Text className="text-center text-lg py-4 px-0 font-bold">
                        {selectedCountry.flag} {selectedCountry.code}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View className="flex-1">
                    <TextInput
                      placeholder="Your phone number"
                      keyboardType="phone-pad"
                      placeholderTextColor="gray"
                      value={senderPhoneNumber}
                      onChangeText={setSenderPhoneNumber}
                      className="w-full text-black px-0 text-lg py-4"
                    />
                  </View>
                  <Text className="text-center text-lg py-4 px-2 font-bold">
                    {selectedCountry.flag}
                  </Text>
                </View>

                {/* Funding Method Selection */}
                {sourceFundingMethods.length > 0 && (
                  <TouchableOpacity 
                    onPress={() => setSenderPaymentModalVisible(true)}
                    className="mt-4 p-4 border border-border rounded-lg bg-white"
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-gray-600 font-medium">Payment Method</Text>
                      <Text className="text-blue-600 text-sm">Change</Text>
                    </View>
                    {renderSelectedFundingMethod()}
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <CardPaymentForm />
            )}
          </View>

          {/* Recipient Section */}
          <SectionHeader icon={Wallet} title="To" />

          {/* Destination and Payment Method Selection */}
          <TouchableOpacity 
            onPress={() => setPaymentModalVisible(true)}
            className="mt-4 p-4 border border-border rounded-lg bg-white"
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-600 font-medium">Destination & Payment Method</Text>
              <Text className="text-blue-600 text-sm">Change</Text>
            </View>
            
            {selectedDestination ? (
              <View>
                <View className="flex-row items-center mb-3">
                  <Text className="text-2xl mr-3">
                    {selectedDestination.country_flag}
                  </Text>
                  <View>
                    <Text className="text-lg font-semibold text-gray-900">
                      {selectedDestination.country_name}
                    </Text>
                    <Text className="text-gray-500">
                      {selectedDestination.country_code}
                    </Text>
                  </View>
                </View>
                
                {renderSelectedPayoutMethod()}
              </View>
            ) : (
              <View className="py-3">
                <Text className="text-gray-400 text-lg">
                  Tap to select destination and payment method
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Recipient Phone Number (only if mobile money is selected) */}
          {selectedPayoutMethod && selectedPayoutMethod.method_type === "mobile_money" && (
            <View className="mt-4">
              <Text className="text-gray-600 font-medium mb-2">
                Recipient&apos;s Phone Number
              </Text>
              <View className="flex-row gap-4 items-center border border-border rounded-lg bg-white">
                <View className="w-20">
                  <Text className="text-center text-lg py-4 px-0 font-bold">
                    {selectedDestination?.country_flag} {selectedDestination?.country_code}
                  </Text>
                </View>
                <View className="flex-1">
                  <TextInput
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                    placeholderTextColor="gray"
                    value={payoutPhoneNumber}
                    onChangeText={setPayoutPhoneNumber}
                    className="w-full text-black px-0 text-lg py-4"
                  />
                </View>
              </View>
            </View>
          )}

          {/* Summary Section */}
          <View className="px-2 py-2 rounded-lg bg-[#fae4d6] border-[#fbbf97] border-2 mt-4">
            <View className="flex-row justify-between items-center p-2">
              <Text className="text-[#374151]">Transfer fee</Text>
              <Text className="text-primary text-2xl font-bold">
                {fee.toFixed(2)} <Text>FCFA</Text>
              </Text>
            </View>

            <View className="flex-row justify-between items-center p-2 border-t-2 border-border">
              <Text className="font-bold">Total amount</Text>
              <Text className="text-2xl font-bold">
                {amount} <Text>FCFA</Text>
              </Text>
            </View>
            
            {selectedFundingMethod && (
              <View className="flex-row justify-between items-center p-2 border-t-2 border-border">
                <Text className="text-gray-600">Funding method</Text>
                <Text className="text-gray-800 font-medium">
                  {selectedFundingMethod.mobile_provider_display.split(" (")[0]}
                </Text>
              </View>
            )}
            
            {selectedPayoutMethod && (
              <View className="flex-row justify-between items-center p-2 border-t-2 border-border">
                <Text className="text-gray-600">Payout method</Text>
                <Text className="text-gray-800 font-medium">
                  {selectedPayoutMethod.mobile_provider_display.split(" (")[0]}
                </Text>
              </View>
            )}
          </View>

          {/* Send Button */}
          <View className="mt-4 mb-8">
            <TouchableOpacity 
              className={`rounded-xl flex flex-row items-center py-4 justify-center gap-2 ${
                selectedDestination && 
                selectedPayoutMethod && 
                selectedFundingMethod && 
                senderPhoneNumber && 
                amount > 0
                  ? "bg-primary"
                  : "bg-gray-300"
              }`}
              disabled={
                !selectedDestination || 
                !selectedPayoutMethod || 
                !selectedFundingMethod || 
                !senderPhoneNumber || 
                amount <= 0
              }
              onPress={() => {
                // Handle send logic here
                console.log("Sending:", {
                  amount,
                  fee,
                  sourceCountry: selectedCountry,
                  sourcePhoneNumber: senderPhoneNumber,
                  fundingMethod: selectedFundingMethod,
                  destination: selectedDestination,
                  payoutMethod: selectedPayoutMethod,
                  payoutPhoneNumber,
                });
              }}
            >
              <Text className={`text-xl font-bold ${
                selectedDestination && 
                selectedPayoutMethod && 
                selectedFundingMethod && 
                senderPhoneNumber && 
                amount > 0
                  ? "text-white"
                  : "text-gray-500"
              }`}>
                Send Money
              </Text>
            </TouchableOpacity>
            
            {!selectedFundingMethod && (
              <Text className="text-red-500 text-center mt-2">
                Please select a funding method
              </Text>
            )}
            {!senderPhoneNumber && (
              <Text className="text-red-500 text-center mt-2">
                Please enter your phone number
              </Text>
            )}
            {(!selectedDestination || !selectedPayoutMethod) && (
              <Text className="text-red-500 text-center mt-2">
                Please select a destination and payment method
              </Text>
            )}
            {amount <= 0 && (
              <Text className="text-red-500 text-center mt-2">
                Please enter an amount greater than 0
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}