
import { View, Text } from "react-native";

import { CreditCard, Lock } from "lucide-react-native";

import Input from "@/components/auth/input";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {

  CardPaymentFormType,

  CardPaymentSchema,

} from "@/utils/zod-schemas";



export const CardPaymentForm = () => {

  const {

    control,

    handleSubmit,

    formState: { errors },

  } = useForm<CardPaymentFormType>({

    resolver: zodResolver(CardPaymentSchema),

    defaultValues: {

      cardNumber: "",

      cardName: "",

      expiryDate: "",

      cvv: "",

    },

  });



  return (

    <View className="border-border border-2 rounded-lg px-2 py-3">

      <View className="flex-row items-center justify-between">

        <View className="flex-row gap-2 items-center">

          <CreditCard size={20} color={"#F97316"} />

          <Text className="font-bold">Informations de carte</Text>

        </View>

        <Lock size={16} color={"#9CA3AF"} />

      </View>

      <View className="mt-3">

        <Input

          name="cardNumber"

          control={control}

          keyboardType="phone-pad"

          label="Numéro de carte"

          placeholder="1234 5678 9012 3456"

          secure={false}

        />

        {errors.cardNumber && (

          <Text className="text-red-500 text-sm mt-1 ml-1">

            {errors.cardNumber.message}

          </Text>

        )}

        <Input

          name="cardName"

          control={control}

          keyboardType="default"

          label="Nom sur la carte"

          placeholder="JOHN DOE"

          secure={false}

        />

        {errors.cardName && (

          <Text className="text-red-500 text-sm mt-1 ml-1">

            {errors.cardName.message}

          </Text>

        )}

        <View className="flex-row items-start justify-evenly gap-2">

          <View className="flex-1">

            <Input

              name="expiryDate"

              control={control}

              keyboardType="phone-pad"

              label="Date d'expiration"

              placeholder="MM/AA"

              secure={false}

            />

            {errors.expiryDate && (

              <Text className="text-red-500 text-sm mt-1 ml-1">

                {errors.expiryDate.message}

              </Text>

            )}

          </View>

          <View className="flex-1">

            <Input

              name="cvv"

              control={control}

              keyboardType="phone-pad"

              label="CVV"

              placeholder="123"

              secure={false}

            />

            {errors.cvv && (

              <Text className="text-red-500 text-sm mt-1 ml-1">

                {errors.cvv.message}

              </Text>

            )}

          </View>

        </View>

      </View>

    </View>

  );

};