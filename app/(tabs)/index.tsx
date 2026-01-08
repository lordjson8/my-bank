import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { Wallet, Smartphone, CreditCard } from "lucide-react-native";
import { AmountInput } from "@/components/amount-input";
import { PaymentMethodsSection } from "@/components/PaymentMethodSection";
import { SectionHeader } from "@/components/section-header";
import { CardPaymentForm } from "@/components/card-payment-form";
import { useRoutesStore } from "@/store/route.store";
import ReceiverPaymentModal from "@/components/receiver-payment-modal";
import SenderPaymentModal from "@/components/sender-payment-modal";
import { Destination, PaymentMethod } from "@/types/routes";
import { useAuthStore } from "@/store/authStore";
import { countries } from "@/constants";

export default function Transfer() {
  const [amount, setAmount] = useState<string>("");
  const [fee, setFee] = useState<number>(0);
  const [selectedMethod, setSelectedMethod] = useState<string>("mobile");
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);
  const [receiverModalVisible, setReceiverModalVisible] = useState(false);
  const [senderPaymentModalVisible, setSenderPaymentModalVisible] = useState(false);
  const { user } = useAuthStore();
  const [selectedCountry, setSelectedCountry] = useState<typeof countries[0]>();

  const {
    fetchFundingMethods,
    fetchDestinations,
    fundingMethods,
    fundingCountry,
    fundingLoading,
    destinations,
    destinationsLoading,
    sourceCountry,
    error,
  } = useRoutesStore();

  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);
  const [selectedPayoutMethod, setSelectedPayoutMethod] =
    useState<PaymentMethod | null>(null);
  const [selectedFundingMethod, setSelectedFundingMethod] =
    useState<PaymentMethod | null>(null);
  const [senderPhoneNumber, setSenderPhoneNumber] = useState(user?.national_number || "");
  const [payoutPhoneNumber, setPayoutPhoneNumber] = useState("");

  // Calculate fees based on selected destination and amount
  useEffect(() => {
    if (selectedDestination && Number.parseInt(amount !==  ""? amount : "0") > 0) {
      const percentage = parseFloat(selectedDestination.fees.percentage) / 100;
      const fixed = parseFloat(selectedDestination.fees.fixed);
      const calculatedFee = Number.parseInt(amount !==  ""? amount : "0") * percentage + fixed;
      setFee(calculatedFee);
    } else {
      setFee(0);
    }
  }, [amount, selectedDestination]);

  useEffect(() => {
    if (user?.country) {
    
    setSelectedCountry(countries.find(c => c.iso === user.country)!);      
    }
  }, [user?.country]);

  console.log("Selected Country:", selectedCountry);

  // Fetch funding methods for the selected country
  useEffect(() => {
    if (user?.country) {
      fetchFundingMethods(user.country);
    }
  }, [user?.country]);

  // Fetch destinations for the selected country
  useEffect(() => {
    if (user?.country) {
      fetchDestinations(user.country);
    }
  }, [user?.country]);

  // Auto-select first funding method if available
  useEffect(() => {
    if (fundingMethods.length > 0 && !selectedFundingMethod) {
      const firstActiveMethod = fundingMethods.find(
        (method) => method.is_active
      );
      if (firstActiveMethod) {
        setSelectedFundingMethod(firstActiveMethod);
      }
    }
  }, [fundingMethods]);

  const handleSelectPaymentMethod = (
    destination: Destination,
    method: PaymentMethod
  ) => {
    setSelectedDestination(destination);
    setSelectedPayoutMethod(method);
    setPayoutPhoneNumber("");
  };

  const handleSelectFundingMethod = (method: PaymentMethod) => {
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
            style={{
              backgroundColor: selectedPayoutMethod.brand_color || "#3B82F6",
            }}
          >
            <Text className="text-white font-bold text-xs">
              {selectedPayoutMethod.method_type_display.charAt(0)}
            </Text>
          </View>
        )}
        <View className="flex-1">
          <Text className="font-semibold text-gray-900">
            {selectedPayoutMethod.mobile_provider_display ||
              selectedPayoutMethod.display_name}
          </Text>
          <Text className="text-gray-500 text-sm">
            {selectedDestination?.country_name} •{" "}
            {selectedPayoutMethod.method_type_display}
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
            style={{
              backgroundColor: selectedFundingMethod.brand_color || "#3B82F6",
            }}
          >
            <Text className="text-white font-bold text-xs">
              {selectedFundingMethod.method_type_display.charAt(0)}
            </Text>
          </View>
        )}
        <View className="flex-1">
          <Text className="font-semibold text-gray-900">
            {selectedFundingMethod.mobile_provider_display ||
              selectedFundingMethod.display_name}
          </Text>
          <Text className="text-gray-500 text-sm">
            {selectedFundingMethod.method_type_display}
          </Text>
        </View>
      </View>
    );
  };

  const totalAmount = Number.parseInt(amount !==  ""? amount : "0") + fee;

  // Validate transfer limits
  const validateAmount = () => {
    if (!selectedDestination) return true;

    const min = parseFloat(selectedDestination.limits.min);
    const max = parseFloat(selectedDestination.limits.max);

    return Number.parseInt(amount !==  ""? amount : "0") >= min && Number.parseInt(amount !==  ""? amount : "0") <= max;
  };

  const isAmountValid = validateAmount();
  const isFormValid =
    selectedDestination &&
    selectedPayoutMethod &&
    selectedFundingMethod &&
    senderPhoneNumber &&
    Number.parseInt(amount !==  ""? amount : "0") > 0 &&
    isAmountValid;

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
        <ReceiverPaymentModal
          modalVisible={receiverModalVisible}
          setModalVisible={setReceiverModalVisible}
          onSelectPaymentMethod={handleSelectPaymentMethod}
        />

        <SenderPaymentModal
          selectedFundingMethod={selectedFundingMethod}
          senderPaymentModalVisible={senderPaymentModalVisible}
          handleSelectFundingMethod={handleSelectFundingMethod}
          fundingMethods={fundingMethods}
          setSenderPaymentModalVisible={setSenderPaymentModalVisible}
          loading={fundingLoading}
          selectedCountry={selectedCountry ?? countries[0]}
        />

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
                {/* Country Display (non-editable) */}
                <View className="flex-row gap-4 mt-4 items-center border border-border rounded-lg bg-white">
                  <View className="w-20">
                    <Text className="text-center text-lg py-4 px-0 font-bold">
                      {selectedCountry?.flag} {selectedCountry?.code}
                    </Text>
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
                    {selectedCountry?.flag}
                  </Text>
                </View>

                {/* Funding Method Selection */}
                {fundingMethods.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setSenderPaymentModalVisible(true)}
                    className="mt-4 p-4 border border-border rounded-lg bg-white"
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-gray-600 font-medium">
                        Payment Method
                      </Text>
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
            onPress={() => setReceiverModalVisible(true)}
            className="mt-4 p-4 border border-border rounded-lg bg-white"
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-600 font-medium">
                Destination & Payment Method
              </Text>
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

          {/* Transfer Limits Warning */}
          {selectedDestination && !isAmountValid && (
            <View className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Text className="text-yellow-800 text-sm">
                Amount must be between {selectedDestination.limits.min} and{" "}
                {selectedDestination.limits.max} FCFA
              </Text>
            </View>
          )}

          {/* Recipient Phone Number (only if mobile money is selected) */}
          {selectedPayoutMethod &&
            selectedPayoutMethod.method_type === "mobile_money" && (
              <View className="mt-4">
                <Text className="text-gray-600 font-medium mb-2">
                  Recipient&apos;s Phone Number
                </Text>
                <View className="flex-row gap-4 items-center border border-border rounded-lg bg-white">
                  <View className="w-20">
                    <Text className="text-center text-lg py-4 px-0 font-bold">
                      {selectedDestination?.country_flag}{" "}
                      {selectedDestination?.country_code}
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
              <Text className="text-[#374151]">Transfer amount</Text>
              <Text className="text-2xl font-bold">
                {Number.parseInt(amount !==  ""? amount : "0").toFixed(2)} <Text>FCFA</Text>
              </Text>
            </View>

            <View className="flex-row justify-between items-center p-2 border-t-2 border-border">
              <Text className="text-[#374151]">Transfer fee</Text>
              <View className="items-end">
                <Text className="text-primary text-lg font-bold">
                  {fee.toFixed(2)} FCFA
                </Text>
                {selectedDestination && (
                  <Text className="text-gray-500 text-xs">
                    ({selectedDestination.fees.percentage}% +{" "}
                    {selectedDestination.fees.fixed} FCFA)
                  </Text>
                )}
              </View>
            </View>

            <View className="flex-row justify-between items-center p-2 border-t-2 border-border">
              <Text className="font-bold">Total to pay</Text>
              <Text className="text-2xl font-bold">
                {totalAmount.toFixed(2)} <Text>FCFA</Text>
              </Text>
            </View>

            {selectedFundingMethod && (
              <View className="flex-row justify-between items-center p-2 border-t-2 border-border">
                <Text className="text-gray-600">Funding method</Text>
                <Text className="text-gray-800 font-medium">
                  {selectedFundingMethod.mobile_provider_display?.split(
                    " ("
                  )[0] || selectedFundingMethod.display_name}
                </Text>
              </View>
            )}

            {selectedPayoutMethod && (
              <View className="flex-row justify-between items-center p-2 border-t-2 border-border">
                <Text className="text-gray-600">Payout method</Text>
                <Text className="text-gray-800 font-medium">
                  {selectedPayoutMethod.mobile_provider_display?.split(
                    " ("
                  )[0] || selectedPayoutMethod.display_name}
                </Text>
              </View>
            )}
          </View>

          {/* Send Button */}
          <View className="mt-4 mb-8">
            <TouchableOpacity
              className={`rounded-xl flex flex-row items-center py-4 justify-center gap-2 ${
                isFormValid ? "bg-primary" : "bg-gray-300"
              }`}
              disabled={!isFormValid}
              onPress={() => {
                console.log("Sending:", {
                  amount,
                  fee,
                  totalAmount,
                  sourceCountry: selectedCountry,
                  sourcePhoneNumber: senderPhoneNumber,
                  fundingMethod: selectedFundingMethod,
                  destination: selectedDestination,
                  payoutMethod: selectedPayoutMethod,
                  payoutPhoneNumber,
                  fees: selectedDestination?.fees,
                  limits: selectedDestination?.limits,
                });
              }}
            >
              <Text
                className={`text-xl font-bold ${
                  isFormValid ? "text-white" : "text-gray-500"
                }`}
              >
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
            {Number.parseInt(amount !==  ""? amount : "0") <= 0 && (
              <Text className="text-red-500 text-center mt-2">
                Please enter an amount greater than 0
              </Text>
            )}
            {!isAmountValid && selectedDestination && (
              <Text className="text-red-500 text-center mt-2">
                Amount must be between {selectedDestination.limits.min} and{" "}
                {selectedDestination.limits.max} FCFA
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
