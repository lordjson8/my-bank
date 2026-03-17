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
import { X, Check, ShieldCheck, AlertCircle } from "lucide-react-native";
import { PaymentMethod } from "@/types/routes";
import { countries } from "@/constants";
import { useAuthStore } from "@/store/authStore";
import { useRoutesStore } from "@/store/route.store";

interface Props {
  selectedFundingMethod: PaymentMethod | null;
  senderPaymentModalVisible: boolean;
  handleSelectFundingMethod: (method: PaymentMethod) => void;
  fundingMethods: PaymentMethod[];
  setSenderPaymentModalVisible: (visible: boolean) => void;
  loading: boolean;
  selectedCountry: (typeof countries)[0];
  corridorActive?: boolean;
  destinationCountryName?: string;
}

const SenderPaymentModal: React.FC<Props> = ({
  selectedFundingMethod,
  senderPaymentModalVisible,
  handleSelectFundingMethod,
  fundingMethods,
  setSenderPaymentModalVisible,
  loading,
  selectedCountry,
  corridorActive,
  destinationCountryName,
}) => {
  const { user } = useAuthStore();
  const { fundingError, fetchFundingMethods } = useRoutesStore();

  const handleRetry = () => {
    if (user?.country) {
      fetchFundingMethods(user.country);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={senderPaymentModalVisible}
      onRequestClose={() => setSenderPaymentModalVisible(false)}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-background rounded-t-3xl h-3/4 pt-5">
          {/* En-tête */}
          <View className="flex-row items-center justify-between px-5 pb-4 border-b border-border">
            <View>
              <Text className="text-2xl font-bold text-foreground">
                Mode de financement
              </Text>
              <Text className="text-sm text-muted-foreground mt-1">
                Comment souhaitez-vous payer depuis {selectedCountry.name} ?
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setSenderPaymentModalVisible(false)}
              className="w-10 h-10 items-center justify-center rounded-full bg-muted"
            >
              <X size={22} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Infos pays */}
          <View className="px-5 py-4 bg-primary/10 border-b border-primary/20">
            <View className="flex-row items-center">
              <Text className="text-3xl mr-3">{selectedCountry.flag}</Text>
              <View className="flex-1">
                <Text className="font-semibold text-foreground">
                  {selectedCountry.name}
                </Text>
                <Text className="text-muted-foreground text-sm">
                  {user?.phone}
                </Text>
              </View>
            </View>
            {corridorActive && destinationCountryName && (
              <View className="mt-3 flex-row items-center gap-2 p-2 bg-primary/10 rounded-lg border border-primary/20">
                <ShieldCheck size={14} color="#F97316" />
                <Text className="text-primary text-xs font-medium flex-1">
                  Corridor validé · Envoi vers {destinationCountryName}
                </Text>
              </View>
            )}
          </View>

          <ScrollView className="px-5 py-4" showsVerticalScrollIndicator={false}>
            {loading ? (
              <View className="py-20 items-center">
                <ActivityIndicator size="large" color="#F97316" />
                <Text className="text-center text-muted-foreground mt-4">
                  Chargement...
                </Text>
              </View>
            ) : fundingError ? (
              <View className="py-20 items-center">
                <AlertCircle size={48} color="#EF4444" />
                <Text className="text-destructive text-lg font-medium mt-4">
                  Erreur de chargement
                </Text>
                <Text className="text-muted-foreground text-center mt-2 px-4">
                  {fundingError}
                </Text>
                <TouchableOpacity
                  onPress={handleRetry}
                  className="mt-6 bg-primary px-6 py-3 rounded-full"
                >
                  <Text className="text-white font-medium">Réessayer</Text>
                </TouchableOpacity>
              </View>
            ) : fundingMethods.length === 0 ? (
              <View className="py-20 items-center">
                <AlertCircle size={48} color="#9CA3AF" />
                <Text className="text-muted-foreground text-lg mt-4">
                  Aucun mode de financement disponible
                </Text>
                <Text className="text-muted-foreground text-sm mt-2">
                  Essayez un autre type de paiement
                </Text>
                <TouchableOpacity
                  onPress={handleRetry}
                  className="mt-6 bg-primary px-6 py-3 rounded-full"
                >
                  <Text className="text-white font-medium">Actualiser</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text className="text-muted-foreground text-sm font-medium mb-3">
                  Modes disponibles pour {selectedCountry.name} :
                </Text>

                {fundingMethods.map((method) => {
                  const isSelected = selectedFundingMethod?.id === method.id;
                  return (
                    <TouchableOpacity
                      key={method.id}
                      className={`flex-row items-center justify-between p-4 mb-3 rounded-xl border ${
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card"
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
                            className="w-12 h-12 rounded-xl mr-4"
                            resizeMode="contain"
                          />
                        ) : (
                          <View
                            className="w-12 h-12 rounded-xl mr-4 items-center justify-center"
                            style={{
                              backgroundColor: method.brand_color || "#F97316",
                            }}
                          >
                            <Text className="text-white font-bold">
                              {method.method_type_display.charAt(0)}
                            </Text>
                          </View>
                        )}

                        <View className="flex-1">
                          <Text className="font-semibold text-foreground">
                            {method.mobile_provider_display ||
                              method.display_name}
                          </Text>
                          <Text className="text-muted-foreground text-sm">
                            {method.method_type_display}
                          </Text>
                          {!method.is_active && (
                            <Text className="text-destructive text-xs mt-1">
                              Actuellement indisponible
                            </Text>
                          )}
                        </View>
                      </View>

                      {isSelected && (
                        <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                          <Check size={14} color="white" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </>
            )}

            <View className="pb-8 pt-2 items-center">
              <View className="flex-row items-center gap-2">
                <ShieldCheck size={16} color="#9CA3AF" />
                <Text className="text-muted-foreground text-sm">
                  Tous les paiements sont sécurisés
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default SenderPaymentModal;
