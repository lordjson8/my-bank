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
import {
  X,
  AlertCircle,
  ChevronRight,
  Check,
  ShieldCheck,
  RefreshCw,
} from "lucide-react-native";
import { useAuthStore } from "@/store/authStore";

interface Props {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  onSelectPaymentMethod: (
    destination: Destination,
    method: PaymentMethod
  ) => void;
}

const PaymentMethodsModal: React.FC<Props> = ({
  modalVisible,
  setModalVisible,
  onSelectPaymentMethod,
}) => {
  const {
    destinations,
    destinationsLoading,
    destinationsError,
    fetchDestinations,
    fetchTransferFlow,
    transferFlow,
    transferFlowLoading,
    transferFlowError,
    clearTransferFlow,
  } = useRoutesStore();
  const { user } = useAuthStore();

  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<{
    countryCode: string;
    methodId: number;
  } | null>(null);

  const toggleCountry = (destination: Destination) => {
    const code = destination.country_code;
    if (expandedCountry === code) {
      setExpandedCountry(null);
      clearTransferFlow();
      return;
    }
    setExpandedCountry(code);
    // Fetch corridor-specific payout methods for this destination
    if (user?.country) {
      fetchTransferFlow(user.country, code);
    }
  };

  const handleRetryDestinations = () => {
    if (user?.country) {
      fetchDestinations(user.country);
    }
  };

  const handleRetryFlow = () => {
    if (user?.country && expandedCountry) {
      fetchTransferFlow(user.country, expandedCountry);
    }
  };

  const handleMethodSelect = (
    destination: Destination,
    method: PaymentMethod
  ) => {
    setSelectedMethod({
      countryCode: destination.country_code,
      methodId: method.id,
    });
    onSelectPaymentMethod(destination, method);
    setModalVisible(false);
  };

  // Payout methods for the currently expanded country:
  // use corridor-validated methods if available, otherwise fall back to embedded
  const getPayoutMethodsForExpanded = (destination: Destination): PaymentMethod[] => {
    if (
      transferFlow &&
      !transferFlowLoading &&
      !transferFlowError &&
      expandedCountry === destination.country_code
    ) {
      return transferFlow.payout_methods.filter((m) => m.is_active);
    }
    return destination.payout_methods?.filter((m) => m.is_active) ?? [];
  };

  const renderPayoutMethods = (destination: Destination) => {
    // While transfer-flow is loading, show spinner
    if (transferFlowLoading && expandedCountry === destination.country_code) {
      return (
        <View className="py-6 items-center">
          <ActivityIndicator size="small" color="#F97316" />
          <Text className="text-muted-foreground text-sm mt-2">
            Chargement des méthodes...
          </Text>
        </View>
      );
    }

    // Transfer-flow error for this corridor
    if (
      transferFlowError &&
      expandedCountry === destination.country_code
    ) {
      return (
        <View className="py-4 items-center">
          <AlertCircle size={24} color="#EF4444" />
          <Text className="text-destructive text-sm mt-2 text-center px-2">
            {transferFlowError}
          </Text>
          <TouchableOpacity
            onPress={handleRetryFlow}
            className="mt-3 bg-primary px-4 py-2 rounded-full"
          >
            <Text className="text-white text-sm font-medium">Réessayer</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const activeMethods = getPayoutMethodsForExpanded(destination);

    if (activeMethods.length === 0) {
      return (
        <View className="py-4 items-center">
          <AlertCircle size={24} color="#9CA3AF" />
          <Text className="text-muted-foreground text-sm mt-2">
            Aucun mode de paiement disponible pour ce corridor
          </Text>
        </View>
      );
    }

    return (
      <View className="pt-2">
        {activeMethods.map((method) => {
          const isSelected =
            selectedMethod?.countryCode === destination.country_code &&
            selectedMethod?.methodId === method.id;

          return (
            <TouchableOpacity
              key={method.id}
              className={`flex-row items-center justify-between p-3 mb-2 rounded-xl border ${
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card"
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
                    style={{ backgroundColor: method.brand_color || "#F97316" }}
                  >
                    <Text className="text-white font-bold text-xs">
                      {method.method_type_display.charAt(0)}
                    </Text>
                  </View>
                )}

                <View className="flex-1">
                  <Text className="font-semibold text-foreground">
                    {method.mobile_provider_display || method.display_name}
                  </Text>
                  <Text className="text-muted-foreground text-sm">
                    {method.method_type_display}
                  </Text>
                  {/* Corridor fees shown via transfer-flow */}
                  {transferFlow &&
                    expandedCountry === destination.country_code && (
                      <View className="flex-row items-center mt-1">
                        <Text className="text-xs text-muted-foreground">
                          Frais : {transferFlow.corridor.percentage_fee}% +{" "}
                          {transferFlow.corridor.fixed_fee} FCFA
                        </Text>
                        <Text className="text-xs text-muted-foreground mx-2">
                          •
                        </Text>
                        <Text className="text-xs text-muted-foreground">
                          {transferFlow.corridor.min_amount} –{" "}
                          {transferFlow.corridor.max_amount} FCFA
                        </Text>
                      </View>
                    )}
                </View>
              </View>

              <View className="flex-row items-center ml-2">
                {isSelected ? (
                  <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                    <Check size={14} color="white" />
                  </View>
                ) : (
                  <ChevronRight size={20} color="#9CA3AF" />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderCountryCard = (destination: Destination) => {
    const previewMethods =
      destination.payout_methods?.filter((m) => m.is_active) || [];
    const hasMethods = previewMethods.length > 0;
    const isExpanded = expandedCountry === destination.country_code;

    return (
      <View key={destination.corridor_id} className="mb-3">
        <TouchableOpacity
          className={`p-4 rounded-2xl border-2 ${
            hasMethods ? "border-border bg-card" : "border-border bg-muted"
          } ${isExpanded ? "rounded-b-none border-b-0" : ""}`}
          onPress={() => hasMethods && toggleCountry(destination)}
          disabled={!hasMethods}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Text className="text-2xl mr-3">{destination.country_flag}</Text>
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">
                  {destination.country_name}
                </Text>
                <Text className="text-sm text-muted-foreground">
                  {destination.country_code}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              {hasMethods ? (
                <View className="items-end mr-2">
                  <Text className="text-primary text-sm font-medium">
                    {previewMethods.length} méthode
                    {previewMethods.length !== 1 ? "s" : ""}
                  </Text>
                  <Text className="text-muted-foreground text-xs">
                    Frais : {destination.fees.percentage}%
                  </Text>
                </View>
              ) : (
                <View className="bg-muted px-3 py-1 rounded-full mr-2">
                  <Text className="text-muted-foreground text-xs font-medium">
                    Indisponible
                  </Text>
                </View>
              )}

              {hasMethods && (
                <ChevronRight
                  size={20}
                  color="#9CA3AF"
                  style={{
                    transform: [{ rotate: isExpanded ? "90deg" : "0deg" }],
                  }}
                />
              )}
            </View>
          </View>
        </TouchableOpacity>

        {isExpanded && hasMethods && (
          <View className="bg-muted rounded-b-2xl border-2 border-t-0 border-border p-4">
            {/* Corridor validation badge */}
            {transferFlow &&
              expandedCountry === destination.country_code &&
              !transferFlowLoading && (
                <View className="mb-3 p-2 bg-primary/10 rounded-lg border border-primary/20 flex-row items-center gap-2">
                  <ShieldCheck size={14} color="#F97316" />
                  <Text className="text-primary text-xs font-medium flex-1">
                    Corridor validé ·{" "}
                    {destination.country_name}
                  </Text>
                </View>
              )}
            <Text className="text-foreground font-medium mb-3">
              Sélectionnez un mode de paiement :
            </Text>
            {renderPayoutMethods(destination)}
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
        <View className="bg-background rounded-t-3xl h-4/5 pt-5">
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pb-4 border-b border-border">
            <View>
              <Text className="text-2xl font-bold text-foreground">
                Mode de paiement
              </Text>
              <Text className="text-sm text-muted-foreground mt-1">
                Choisissez une destination et un mode de paiement
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="w-10 h-10 items-center justify-center rounded-full bg-muted"
            >
              <X size={22} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
            {destinationsLoading ? (
              <View className="py-20 items-center">
                <ActivityIndicator size="large" color="#F97316" />
                <Text className="text-center text-muted-foreground mt-4">
                  Chargement...
                </Text>
              </View>
            ) : destinationsError ? (
              <View className="py-20 items-center">
                <AlertCircle size={48} color="#EF4444" />
                <Text className="text-destructive text-lg font-medium mt-4">
                  Erreur de chargement
                </Text>
                <Text className="text-muted-foreground text-center mt-2">
                  {destinationsError}
                </Text>
                <TouchableOpacity
                  onPress={handleRetryDestinations}
                  className="mt-6 bg-primary px-6 py-3 rounded-full"
                >
                  <Text className="text-white font-medium">Réessayer</Text>
                </TouchableOpacity>
              </View>
            ) : destinations.length === 0 ? (
              <View className="py-20 items-center">
                <Text className="text-muted-foreground text-lg">
                  Aucune destination disponible
                </Text>
                <Text className="text-muted-foreground text-sm mt-2">
                  Essayez un autre pays source
                </Text>
                <TouchableOpacity
                  onPress={handleRetryDestinations}
                  className="mt-6 bg-primary px-6 py-3 rounded-full"
                >
                  <Text className="text-white font-medium">Actualiser</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="py-4">
                {selectedMethod && (
                  <View className="mb-4 p-3 bg-primary/10 rounded-xl border border-primary/30">
                    <Text className="text-primary font-medium">
                      Destination et méthode sélectionnées ✓
                    </Text>
                  </View>
                )}

                <Text className="text-muted-foreground text-sm font-medium mb-3">
                  Destinations disponibles ({destinations.length})
                </Text>

                {destinations.map(renderCountryCard)}
              </View>
            )}

            {/* Footer */}
            <View className="pb-8 pt-4 items-center">
              <View className="flex-row items-center gap-2">
                <ShieldCheck size={16} color="#9CA3AF" />
                <Text className="text-muted-foreground text-sm text-center">
                  Tous les paiements sont sécurisés et cryptés
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default PaymentMethodsModal;
