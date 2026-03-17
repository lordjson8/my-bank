import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useColorScheme } from "nativewind";
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
import { useFocusEffect, useRouter } from "expo-router";
import * as Device from "expo-device";
import { useTransactionStore } from "@/store/transactionStore";
import Toast from "react-native-toast-message";
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

// Shared method preview used for both sender and receiver selected methods
const MethodPreview = ({
  method,
  subtitle,
}: {
  method: PaymentMethod;
  subtitle: string;
}) => (
  <View className="flex-row items-center py-2">
    {method.icon_url ? (
      <Image
        source={{ uri: method.icon_url }}
        className="w-8 h-8 rounded-lg mr-3"
        resizeMode="contain"
      />
    ) : (
      <View
        className="w-8 h-8 rounded-lg mr-3 items-center justify-center"
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
      <Text className="text-muted-foreground text-sm">{subtitle}</Text>
    </View>
  </View>
);

export default function Transfer() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const placeholderColor = colorScheme === "dark" ? "#a1a1aa" : "#9CA3AF";
  const [amount, setAmount] = useState<string>("");
  const [fee, setFee] = useState<number>(0);
  const [selectedMethod, setSelectedMethod] = useState<string>("mobile");
  const [receiverModalVisible, setReceiverModalVisible] = useState(false);
  const [senderPaymentModalVisible, setSenderPaymentModalVisible] =
    useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user, updateUser } = useAuthStore();
  const [selectedCountry, setSelectedCountry] =
    useState<(typeof countries)[0]>();

  const [recipientName, setRecipientName] = useState("");
  const [description, setDescription] = useState("");

  const {
    creatingTransfer,
    createTransferError,
    createTransfer,
    resetCreateTransferError,
  } = useTransactionStore();

  const {
    fetchFundingMethods,
    fetchDestinations,
    fundingMethods,
    fundingLoading,
    fundingError,
    destinationsError,
    transferFlow,
    transferFlowLoading,
    fetchTransferFlow,
    clearTransferFlow,
  } = useRoutesStore();

  /**
   * After a destination is picked, use corridor-specific funding methods
   * (from transfer-flow). Fall back to country-level fundingMethods if
   * transfer-flow hasn't loaded yet.
   */
  const activeFundingMethods =
    transferFlow?.funding_methods?.filter((m) => m.is_active) ??
    fundingMethods;

  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);
  const [selectedPayoutMethod, setSelectedPayoutMethod] =
    useState<PaymentMethod | null>(null);
  const [selectedFundingMethod, setSelectedFundingMethod] =
    useState<PaymentMethod | null>(null);
  const [senderPhoneNumber, setSenderPhoneNumber] = useState(
    user?.national_number || ""
  );
  const [payoutPhoneNumber, setPayoutPhoneNumber] = useState("");

  // Send button press animation
  const sendBtnScale = useSharedValue(1);
  const sendBtnAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sendBtnScale.value }],
  }));

  const refreshRoutes = useCallback(() => {
    if (user?.country) {
      fetchFundingMethods(user.country);
      fetchDestinations(user.country);
    }
  }, [user?.country]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    updateUser().finally(() => {
      refreshRoutes();
      setRefreshing(false);
    });
  }, [updateUser, refreshRoutes]);

  useFocusEffect(
    useCallback(() => {
      updateUser();
    }, [])
  );

  useEffect(() => {
    const parsedAmount = Number.parseInt(amount !== "" ? amount : "0");
    if (selectedDestination && parsedAmount > 0) {
      // Prefer corridor-validated fees from transfer-flow; fall back to embedded destination fees
      const feeSource = transferFlow?.corridor ?? selectedDestination.fees as any;
      const percentage =
        parseFloat(feeSource.percentage_fee ?? feeSource.percentage) / 100;
      const fixed = parseFloat(feeSource.fixed_fee ?? feeSource.fixed);
      setFee(parsedAmount * percentage + fixed);
    } else {
      setFee(0);
    }
  }, [amount, selectedDestination, transferFlow]);

  useEffect(() => {
    if (user?.country) {
      setSelectedCountry(countries.find((c) => c.iso === user.country)!);
    }
  }, [user?.country]);

  useEffect(() => {
    if (user?.country) {
      fetchFundingMethods(user.country);
    }
  }, [user?.country]);

  useEffect(() => {
    if (user?.country) {
      fetchDestinations(user.country);
    }
  }, [user?.country]);

  // Auto-select first active funding method from corridor-specific list (if destination chosen)
  // or from country-level list (no destination yet)
  useEffect(() => {
    if (!selectedFundingMethod && activeFundingMethods.length > 0) {
      const first = activeFundingMethods.find((m) => m.is_active);
      if (first) setSelectedFundingMethod(first);
    }
  }, [activeFundingMethods]);

  // Clear corridor data & funding method selection when destination is cleared
  useEffect(() => {
    if (!selectedDestination) {
      clearTransferFlow();
    }
  }, [selectedDestination]);

  useEffect(() => {
    if (createTransferError) {
      Toast.show({
        type: "error",
        text1: "Erreur de transfert",
        text2: createTransferError || "Une erreur s'est produite",
      });
      resetCreateTransferError();
    }
  }, [createTransferError]);

  const handleSelectPaymentMethod = (
    destination: Destination,
    method: PaymentMethod
  ) => {
    setSelectedDestination(destination);
    setSelectedPayoutMethod(method);
    setPayoutPhoneNumber("");
    setRecipientName("");
    // Validate corridor + get corridor-specific funding methods for sender side
    if (user?.country) {
      fetchTransferFlow(user.country, destination.country_code);
    }
    // Reset funding method selection so user picks one valid for this corridor
    setSelectedFundingMethod(null);
  };

  const handleSelectFundingMethod = (method: PaymentMethod) => {
    setSelectedFundingMethod(method);
    setSenderPaymentModalVisible(false);
  };

  const totalAmount = Number.parseInt(amount !== "" ? amount : "0") + fee;

  const amountLimits = transferFlow
    ? { min: transferFlow.corridor.min_amount, max: transferFlow.corridor.max_amount }
    : selectedDestination
    ? { min: selectedDestination.limits.min, max: selectedDestination.limits.max }
    : null;

  const validateAmount = () => {
    if (!amountLimits) return true;
    const val = Number.parseInt(amount !== "" ? amount : "0");
    return val >= parseFloat(amountLimits.min) && val <= parseFloat(amountLimits.max);
  };

  const isAmountValid = validateAmount();
  const isFormValid =
    selectedDestination &&
    selectedPayoutMethod &&
    selectedFundingMethod &&
    senderPhoneNumber &&
    payoutPhoneNumber &&
    recipientName &&
    Number.parseInt(amount !== "" ? amount : "0") > 0 &&
    isAmountValid;

  const handleSendMoney = async () => {
    if (!isFormValid || creatingTransfer) return;

    let deviceId = "unknown";
    if (Device.isDevice) {
      deviceId = Device.osBuildId || "unknown";
    }

    const payload = {
      sender_phone: `${selectedCountry?.code}${senderPhoneNumber}`,
      sender_name:
        user?.full_name || user?.email?.split("@")[0] || "Unknown Sender",
      recipient_name: recipientName,
      recipient_phone: `${selectedDestination.phone_prefix}${payoutPhoneNumber}`,
      amount: parseFloat(amount),
      currency: "XAF",
      description: description,
      funding_provider: selectedFundingMethod!.mobile_provider,
      payout_provider: selectedPayoutMethod!.mobile_provider,
      device_id: deviceId,
    };

    try {
      if (user?.has_kyc_profile) {
        const result = await createTransfer(payload);
        if (result) {
          router.push({
            pathname: "/(tabs)/transfer-results",
            params: { transferId: result.id, status: result.status },
          });
          setAmount("");
          setRecipientName("");
          setDescription("");
          setPayoutPhoneNumber("");
          setSelectedDestination(null);
          setSelectedPayoutMethod(null);
        }
      } else {
        Toast.show({
          type: "error",
          text1: "KYC requis",
          text2:
            "Veuillez compléter votre profil KYC avant d'effectuer un transfert.",
        });
        router.push("./(kyc)/update-profile");
      }
    } catch (_error) {
      // Géré par le store via createTransferError
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#F97316"
            colors={["#F97316"]}
          />
        }
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
          fundingMethods={activeFundingMethods}
          setSenderPaymentModalVisible={setSenderPaymentModalVisible}
          loading={fundingLoading || transferFlowLoading}
          selectedCountry={selectedCountry ?? countries[0]}
          corridorActive={!!transferFlow}
          destinationCountryName={
            transferFlow?.destination_country?.name ??
            selectedDestination?.country_name
          }
        />

        <View className="px-4 py-6">
          {/* Bannière d'erreur routes */}
          {(fundingError || destinationsError) && (
            <Animated.View
              entering={FadeInDown.duration(250)}
              className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-xl flex-row items-center justify-between"
            >
              <Text className="text-destructive text-sm flex-1">
                Impossible de charger les méthodes de paiement.
              </Text>
              <TouchableOpacity
                onPress={refreshRoutes}
                className="ml-3 bg-destructive/20 px-3 py-1.5 rounded-lg"
              >
                <Text className="text-destructive text-sm font-semibold">
                  Réessayer
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Montant */}
          <AmountInput amount={amount} setAmount={setAmount} />

          {/* Méthode de paiement */}
          <Animated.View entering={FadeInDown.delay(80).duration(400)}>
            <PaymentMethodsSection
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
            />
          </Animated.View>

          {/* Section Envoyeur */}
          <Animated.View entering={FadeInDown.delay(160).duration(400)}>
            <SectionHeader
              icon={selectedMethod === "mobile" ? Smartphone : CreditCard}
              title="De"
            />

            <View className="mt-2">
              {selectedMethod === "mobile" ? (
                <View>
                  {/* 1. Funding method picker — always visible */}
                  <TouchableOpacity
                    onPress={() => setSenderPaymentModalVisible(true)}
                    className="mt-4 p-4 border border-border rounded-xl bg-card"
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-muted-foreground font-medium">
                        Votre mode de paiement
                      </Text>
                      <Text className="text-primary text-sm font-medium">
                        {selectedFundingMethod ? "Modifier" : "Choisir"}
                      </Text>
                    </View>
                    {fundingLoading && !selectedFundingMethod ? (
                      <View className="py-2 items-start">
                        <ActivityIndicator size="small" color="#F97316" />
                      </View>
                    ) : selectedFundingMethod ? (
                      <MethodPreview
                        method={selectedFundingMethod}
                        subtitle={selectedFundingMethod.method_type_display}
                      />
                    ) : (
                      <Text className="text-base py-2 text-muted-foreground">
                        Sélectionner votre mode de paiement
                      </Text>
                    )}
                  </TouchableOpacity>

                  {/* 2. Phone number input */}
                  <View className="flex-row gap-4 mt-4 items-center border border-border rounded-xl bg-card">
                    <View className="w-20">
                      <Text className="text-center text-lg py-4 px-0 font-bold text-foreground">
                        {selectedCountry?.flag} {selectedCountry?.code}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <TextInput
                        placeholder="Votre numéro"
                        keyboardType="phone-pad"
                        placeholderTextColor={placeholderColor}
                        value={senderPhoneNumber}
                        onChangeText={setSenderPhoneNumber}
                        className="w-full text-foreground px-0 text-lg py-4"
                      />
                    </View>
                    <Text className="text-center text-lg py-4 px-2 font-bold text-foreground">
                      {selectedCountry?.flag}
                    </Text>
                  </View>
                </View>
              ) : (
                <CardPaymentForm />
              )}
            </View>
          </Animated.View>

          {/* Section Bénéficiaire — unlocked only after sender method + phone are set */}
          <Animated.View entering={FadeInDown.delay(240).duration(400)}>
            <SectionHeader icon={Wallet} title="Vers" />

            {selectedFundingMethod && senderPhoneNumber ? (
              <TouchableOpacity
                onPress={() => setReceiverModalVisible(true)}
                className="mt-4 p-4 border border-border rounded-xl bg-card"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-muted-foreground font-medium">
                    Destination & Mode de paiement
                  </Text>
                  <Text className="text-primary text-sm font-medium">
                    {selectedDestination ? "Modifier" : "Choisir"}
                  </Text>
                </View>

                {selectedDestination ? (
                  <View>
                    <View className="flex-row items-center mb-3">
                      <Text className="text-2xl mr-3">
                        {selectedDestination.country_flag}
                      </Text>
                      <View>
                        <Text className="text-lg font-semibold text-foreground">
                          {selectedDestination.country_name}
                        </Text>
                        <Text className="text-muted-foreground">
                          {selectedDestination.country_code}
                        </Text>
                      </View>
                    </View>
                    {selectedPayoutMethod && (
                      <MethodPreview
                        method={selectedPayoutMethod}
                        subtitle={`${selectedDestination.country_name} • ${selectedPayoutMethod.method_type_display}`}
                      />
                    )}
                  </View>
                ) : (
                  <View className="py-3">
                    <Text className="text-muted-foreground text-base">
                      Appuyer pour sélectionner la destination
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ) : (
              <View className="mt-4 p-4 border border-dashed border-border rounded-xl bg-muted">
                <Text className="text-muted-foreground text-center text-sm">
                  Sélectionnez d'abord votre mode de paiement et renseignez votre numéro
                </Text>
              </View>
            )}
          </Animated.View>

          {/* Avertissement de limites */}
          {selectedDestination && !isAmountValid && (
            <Animated.View
              entering={FadeInDown.duration(200)}
              className="mt-2 p-3 bg-destructive/10 border border-destructive/30 rounded-xl"
            >
              <Text className="text-destructive text-sm">
                Le montant doit être entre {amountLimits?.min} et{" "}
                {amountLimits?.max} FCFA
              </Text>
            </Animated.View>
          )}

          {/* Numéro du bénéficiaire (Mobile Money) */}
          {selectedPayoutMethod?.method_type === "mobile_money" && (
            <Animated.View entering={FadeInDown.duration(250)} className="mt-4">
              <Text className="text-muted-foreground font-medium mb-2">
                Numéro du bénéficiaire
              </Text>
              <View className="flex-row gap-4 items-center border border-border rounded-xl bg-card">
                <View className="w-24">
                  <Text className="text-center text-base py-4 px-0 font-bold text-foreground">
                    {selectedDestination?.country_flag}{" "}
                    {selectedDestination?.phone_prefix}
                  </Text>
                </View>
                <View className="flex-1">
                  <TextInput
                    placeholder="Numéro de téléphone"
                    keyboardType="phone-pad"
                    placeholderTextColor={placeholderColor}
                    value={payoutPhoneNumber}
                    onChangeText={setPayoutPhoneNumber}
                    className="w-full text-foreground px-0 text-lg py-4"
                  />
                </View>
              </View>
            </Animated.View>
          )}

          {/* Nom du bénéficiaire */}
          {selectedDestination && selectedPayoutMethod && (
            <Animated.View entering={FadeInDown.duration(250)} className="mt-4">
              <Text className="text-muted-foreground font-medium mb-2">
                Nom complet du bénéficiaire
              </Text>
              <View className="border border-border rounded-xl bg-card">
                <TextInput
                  placeholder="Entrez le nom complet du bénéficiaire"
                  placeholderTextColor={placeholderColor}
                  value={recipientName}
                  onChangeText={setRecipientName}
                  className="w-full text-foreground px-4 py-4 text-base"
                />
              </View>
            </Animated.View>
          )}

          {/* Description */}
          {selectedDestination && selectedPayoutMethod && (
            <Animated.View entering={FadeInDown.duration(250)} className="mt-4">
              <Text className="text-muted-foreground font-medium mb-2">
                Description (Optionnel)
              </Text>
              <View className="border border-border rounded-xl bg-card">
                <TextInput
                  placeholder="Motif du transfert (optionnel)"
                  placeholderTextColor={placeholderColor}
                  value={description}
                  onChangeText={setDescription}
                  className="w-full text-foreground px-4 py-4 text-base"
                  multiline
                  numberOfLines={2}
                />
              </View>
            </Animated.View>
          )}

          {/* Récapitulatif */}
          <Animated.View
            entering={FadeInDown.delay(320).duration(400)}
            className="px-2 py-2 rounded-xl bg-primary/10 border border-primary/30 mt-5"
          >
            <View className="flex-row justify-between items-center p-2">
              <Text className="text-muted-foreground">Montant du transfert</Text>
              <Text className="text-2xl font-bold text-foreground">
                {Number.parseInt(amount !== "" ? amount : "0").toFixed(2)}{" "}
                <Text className="text-base">FCFA</Text>
              </Text>
            </View>

            <View className="flex-row justify-between items-center p-2 border-t border-border">
              <Text className="text-muted-foreground">Frais de transfert</Text>
              <View className="items-end">
                <Text className="text-primary text-lg font-bold">
                  {fee.toFixed(2)} FCFA
                </Text>
                {selectedDestination && (
                  <Text className="text-muted-foreground text-xs">
                    {transferFlow
                      ? `(${transferFlow.corridor.percentage_fee}% + ${transferFlow.corridor.fixed_fee} FCFA)`
                      : `(${selectedDestination.fees.percentage}% + ${selectedDestination.fees.fixed} FCFA)`}
                  </Text>
                )}
              </View>
            </View>

            <View className="flex-row justify-between items-center p-2 border-t border-border">
              <Text className="font-bold text-foreground">Total à payer</Text>
              <Text className="text-2xl font-bold text-foreground">
                {totalAmount.toFixed(2)}{" "}
                <Text className="text-base">FCFA</Text>
              </Text>
            </View>

            {selectedFundingMethod && (
              <View className="flex-row justify-between items-center p-2 border-t border-border">
                <Text className="text-muted-foreground">Mode de financement</Text>
                <Text className="text-foreground font-medium">
                  {selectedFundingMethod.mobile_provider_display?.split(
                    " ("
                  )[0] || selectedFundingMethod.display_name}
                </Text>
              </View>
            )}

            {selectedPayoutMethod && (
              <View className="flex-row justify-between items-center p-2 border-t border-border">
                <Text className="text-muted-foreground">Mode de paiement</Text>
                <Text className="text-foreground font-medium">
                  {selectedPayoutMethod.mobile_provider_display?.split(
                    " ("
                  )[0] || selectedPayoutMethod.display_name}
                </Text>
              </View>
            )}
          </Animated.View>

          {/* Bouton Envoyer */}
          <View className="mt-5 mb-8">
            <Animated.View
              entering={FadeInDown.delay(400).duration(400)}
              style={sendBtnAnimStyle}
            >
              <TouchableOpacity
                className={`rounded-xl flex flex-row items-center py-4 justify-center gap-2 ${
                  isFormValid && !creatingTransfer ? "bg-primary" : "bg-muted"
                }`}
                disabled={!isFormValid || creatingTransfer}
                onPressIn={() => {
                  if (isFormValid && !creatingTransfer) {
                    sendBtnScale.value = withSpring(0.96);
                  }
                }}
                onPressOut={() => {
                  sendBtnScale.value = withSpring(1);
                }}
                onPress={handleSendMoney}
              >
                {creatingTransfer ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text
                    className={`text-xl font-bold ${
                      isFormValid ? "text-white" : "text-muted-foreground"
                    }`}
                  >
                    Envoyer
                  </Text>
                )}
              </TouchableOpacity>
            </Animated.View>

            {/* Messages d'erreur de validation — ordered by step */}
            {!selectedFundingMethod && (
              <Text className="text-destructive text-center mt-2 text-sm">
                Sélectionnez votre mode de paiement
              </Text>
            )}
            {selectedFundingMethod && !senderPhoneNumber && (
              <Text className="text-destructive text-center mt-2 text-sm">
                Renseignez votre numéro de téléphone
              </Text>
            )}
            {selectedFundingMethod && senderPhoneNumber && (!selectedDestination || !selectedPayoutMethod) && (
              <Text className="text-destructive text-center mt-2 text-sm">
                Sélectionnez une destination et un mode de paiement
              </Text>
            )}
            {selectedPayoutMethod?.method_type === "mobile_money" &&
              !payoutPhoneNumber && (
                <Text className="text-destructive text-center mt-2 text-sm">
                  Entrez le numéro du bénéficiaire
                </Text>
              )}
            {selectedDestination && selectedPayoutMethod && !recipientName && (
              <Text className="text-destructive text-center mt-2 text-sm">
                Entrez le nom du bénéficiaire
              </Text>
            )}
            {Number.parseInt(amount !== "" ? amount : "0") <= 0 && (
              <Text className="text-destructive text-center mt-2 text-sm">
                Veuillez entrer un montant supérieur à 0
              </Text>
            )}
            {!isAmountValid && amountLimits && (
              <Text className="text-destructive text-center mt-2 text-sm">
                Le montant doit être entre {amountLimits.min} et{" "}
                {amountLimits.max} FCFA
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
