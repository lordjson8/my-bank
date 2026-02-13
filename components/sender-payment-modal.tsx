import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { X, Check } from "lucide-react-native";
import { PaymentMethod } from "@/types/routes";
import { countries } from "@/constants";
import { useAuthStore } from "@/store/authStore";

interface Props {
  selectedFundingMethod: PaymentMethod | null;
  senderPaymentModalVisible: boolean;
  handleSelectFundingMethod: (method: PaymentMethod) => void;
  fundingMethods: PaymentMethod[];
  setSenderPaymentModalVisible: (visible: boolean) => void;
  loading: boolean;
  selectedCountry: (typeof countries)[0];
}

const SenderPaymentModal: React.FC<Props> = ({
  selectedFundingMethod,
  senderPaymentModalVisible,
  handleSelectFundingMethod,
  fundingMethods,
  setSenderPaymentModalVisible,
  loading,
  selectedCountry,
}) => {
  // Filter funding methods for the current country (funding only)
  const { user } = useAuthStore();

  return (
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
                How do you want to pay from {selectedCountry.name}?
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setSenderPaymentModalVisible(false)}
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Country Info */}
          <View className="px-5 py-4 bg-blue-50 border-b border-blue-100">
            <View className="flex-row items-center">
              <Text className="text-3xl mr-3">{selectedCountry.flag}</Text>
              <View>
                <Text className="font-semibold text-gray-900">
                  {selectedCountry.name}
                </Text>
                <Text className="text-gray-500 text-sm">
                {user?.phone}
                </Text>
              </View>
            </View>
          </View>

          <ScrollView
            className="px-5 py-4"
            showsVerticalScrollIndicator={false}
          >
            {loading ? (
              <View className="py-20">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="text-center text-gray-600 mt-4">
                  Loading funding methods...
                </Text>
              </View>
            ) : fundingMethods.length === 0 ? (
              <View className="py-20 items-center">
                <Text className="text-gray-500 text-lg">
                  No funding methods available
                </Text>
                <Text className="text-gray-400 text-sm mt-2">
                  Please try another payment type
                </Text>
              </View>
            ) : (
              <>
                <Text className="text-gray-500 text-sm font-medium mb-3">
                  Available payment methods for {selectedCountry.name}:
                </Text>

                {fundingMethods.map((method) => (
                  <TouchableOpacity
                    key={method.id}
                    className={`flex-row items-center justify-between p-4 mb-3 rounded-xl border ${
                      selectedFundingMethod?.id === method.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white"
                    } ${!method.is_active ? "opacity-50" : ""}`}
                    onPress={() =>
                      method.is_active && handleSelectFundingMethod(method)
                    }
                    disabled={!method.is_active}
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
                          style={{
                            backgroundColor: method.brand_color || "#3B82F6",
                          }}
                        >
                          <Text className="text-white font-bold">
                            {method.method_type_display.charAt(0)}
                          </Text>
                        </View>
                      )}

                      <View className="flex-1">
                        <Text className="font-semibold text-gray-900">
                          {method.mobile_provider_display ||
                            method.display_name}
                        </Text>
                        <Text className="text-gray-500 text-sm">
                          {method.method_type_display}
                        </Text>
                        {!method.is_active && (
                          <Text className="text-red-500 text-xs mt-1">
                            Currently unavailable
                          </Text>
                        )}
                      </View>
                    </View>

                    {selectedFundingMethod?.id === method.id && (
                      <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center">
                        <Check size={14} color="white" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default SenderPaymentModal;
