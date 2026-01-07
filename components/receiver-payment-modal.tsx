import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRoutesStore } from "@/store/route.store";
import { Destination, PaymentMethod } from "@/types/routes";
import { X, AlertCircle, ChevronRight, Check } from "lucide-react-native";

interface Props {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  onSelectPaymentMethod: (destination: Destination, method: PaymentMethod) => void;
}

const PaymentMethodsModal: React.FC<Props> = ({
  modalVisible,
  setModalVisible,
  onSelectPaymentMethod,
}) => {
  const { destinations, destinationsLoading, error } = useRoutesStore();
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<{
    countryCode: string;
    methodId: number;
  } | null>(null);

  const toggleCountry = (countryCode: string) => {
    setExpandedCountry(expandedCountry === countryCode ? null : countryCode);
  };

  const handleMethodSelect = (destination: Destination, method: PaymentMethod) => {
    setSelectedMethod({
      countryCode: destination.country_code,
      methodId: method.id
    });
    onSelectPaymentMethod(destination, method);
    setModalVisible(false);
  };

  const renderPaymentMethods = (destination: Destination) => {
    if (!destination.payout_methods || destination.payout_methods.length === 0) {
      return (
        <View className="py-4 items-center">
          <AlertCircle size={24} color="#9CA3AF" />
          <Text className="text-gray-500 text-sm mt-2">
            No payment methods available
          </Text>
        </View>
      );
    }

    const activeMethods = destination.payout_methods.filter(method => method.is_active);

    if (activeMethods.length === 0) {
      return (
        <View className="py-4 items-center">
          <AlertCircle size={24} color="#9CA3AF" />
          <Text className="text-gray-500 text-sm mt-2">
            All payment methods are currently unavailable
          </Text>
        </View>
      );
    }

    return (
      <View className="pt-2">
        {activeMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            className={`flex-row items-center justify-between p-3 mb-2 rounded-xl border ${
              selectedMethod?.countryCode === destination.country_code && 
              selectedMethod?.methodId === method.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white"
            }`}
            onPress={() => handleMethodSelect(destination, method)}
          >
            <View className="flex-row items-center flex-1">
              {method.icon_url ? (
                <Image
                  source={{ uri: method.icon_url }}
                  className="w-10 h-10 rounded-lg mr-3"
                  resizeMode="contain"
                />
              ) : (
                <View
                  className="w-10 h-10 rounded-lg mr-3 items-center justify-center"
                  style={{ backgroundColor: method.brand_color || "#3B82F6" }}
                >
                  <Text className="text-white font-bold text-xs">
                    {method.method_type_display.charAt(0)}
                  </Text>
                </View>
              )}
              
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">
                  {method.mobile_provider_display || method.display_name}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {method.method_type_display}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Text className="text-xs text-gray-500">
                    Fees: {destination.fees.percentage}% + {destination.fees.fixed} FCFA
                  </Text>
                  <Text className="text-xs text-gray-500 mx-2">•</Text>
                  <Text className="text-xs text-gray-500">
                    Limits: {destination.limits.min} - {destination.limits.max} FCFA
                  </Text>
                </View>
              </View>
            </View>
            
            <View className="flex-row items-center">
              {selectedMethod?.countryCode === destination.country_code && 
               selectedMethod?.methodId === method.id ? (
                <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center mr-2">
                  <Check size={14} color="white" />
                </View>
              ) : null}
              <ChevronRight size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderCountryCard = (destination: Destination) => {
    const activeMethods = destination.payout_methods?.filter(method => method.is_active) || [];
    const hasMethods = activeMethods.length > 0;
    const isExpanded = expandedCountry === destination.country_code;

    return (
      <View key={destination.corridor_id} className="mb-3">
        <TouchableOpacity
          className={`p-4 rounded-2xl border-2 ${
            hasMethods
              ? "border-gray-100 bg-white"
              : "border-gray-100 bg-gray-50"
          } ${isExpanded ? "rounded-b-none border-b-0" : ""}`}
          onPress={() => hasMethods && toggleCountry(destination.country_code)}
          disabled={!hasMethods}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Text className="text-2xl mr-3">
                {destination.country_flag}
              </Text>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900">
                  {destination.country_name}
                </Text>
                <Text className="text-sm text-gray-500">
                  {destination.country_code}
                </Text>
              </View>
            </View>
            
            <View className="flex-row items-center">
              {hasMethods ? (
                <View className="items-end">
                  <Text className="text-blue-600 text-sm font-medium">
                    {activeMethods.length} method{activeMethods.length !== 1 ? 's' : ''}
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    Fees: {destination.fees.percentage}%
                  </Text>
                </View>
              ) : (
                <View className="bg-gray-100 px-3 py-1 rounded-full">
                  <Text className="text-gray-500 text-xs font-medium">
                    Unavailable
                  </Text>
                </View>
              )}
              
              {hasMethods && (
                <ChevronRight 
                  size={20} 
                  color="#6B7280"
                  style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}
                  className="ml-2"
                />
              )}
            </View>
          </View>
        </TouchableOpacity>
        
        {isExpanded && hasMethods && (
          <View className="bg-gray-50 rounded-b-2xl border-2 border-t-0 border-gray-100 p-4">
            <Text className="text-gray-700 font-medium mb-3">
              Select a payment method:
            </Text>
            {renderPaymentMethods(destination)}
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl h-4/5 pt-5">
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pb-4 border-b border-gray-100">
            <View>
              <Text className="text-2xl font-bold text-gray-900">
                Select Payment Method
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                Choose a destination and payment method
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
            {destinationsLoading ? (
              <View className="py-20">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="text-center text-gray-600 mt-4">
                  Loading destinations...
                </Text>
              </View>
            ) : error ? (
              <View className="py-20 items-center">
                <AlertCircle size={48} color="#EF4444" />
                <Text className="text-red-500 text-lg font-medium mt-4">
                  Error loading data
                </Text>
                <Text className="text-gray-600 text-center mt-2">
                  {error}
                </Text>
                <TouchableOpacity className="mt-6 bg-blue-500 px-6 py-3 rounded-full">
                  <Text className="text-white font-medium">Try Again</Text>
                </TouchableOpacity>
              </View>
            ) : destinations.length === 0 ? (
              <View className="py-20 items-center">
                <Text className="text-gray-500 text-lg">
                  No destinations available
                </Text>
                <Text className="text-gray-400 text-sm mt-2">
                  Please try another source country
                </Text>
              </View>
            ) : (
              <View className="py-4">
                {selectedMethod && (
                  <View className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <Text className="text-blue-800 font-medium">
                      Selected destination and method
                    </Text>
                  </View>
                )}
                
                <Text className="text-gray-500 text-sm font-medium mb-3">
                  Available destinations ({destinations.length})
                </Text>
                
                {destinations.map(renderCountryCard)}
              </View>
            )}

            {/* Footer Info */}
            <View className="pb-8 pt-4">
              <View className="items-center">
                <Text className="text-gray-500 text-sm text-center">
                  All payments are secure and encrypted
                </Text>
                <TouchableOpacity className="mt-2">
                  <Text className="text-blue-600 font-medium">Learn more</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default PaymentMethodsModal;