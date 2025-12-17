import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import PhoneModal from "../auth/phone-modal";
import { countries } from "@/constants";
import { Control, Controller } from "react-hook-form";

export default function CountrySelect({
  control,
  name,
}: {
  name: string;
  control: Control<any>;
}) {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [modalVisible, setModalVisible] = useState(false);

  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = React.useCallback(() => setIsFocused(true), []);
  const handleBlur = React.useCallback(() => setIsFocused(false), []);

  return (
    <View className="mb-2">
      <PhoneModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setSelectedCountry={setSelectedCountry}
      />
      <Text className="text-base mb-2 ">
        Pays <Text className="text-primary font-bold">*</Text>{" "}
      </Text>
      <View className={`flex-row gap-4 items-center border-2 rounded-lg ${isFocused ? "border-primary" : "border-border"} `}>
        <View className="w-20">
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text className="text-center text-lg py-4 px-0 font-bold">
              {selectedCountry.flag} {selectedCountry.code}
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-1 ">
          {/* <Text className="text-sm invisible text-muted-foreground">
                          {"placeholder"}
                        </Text> */}
          <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value } }) => (
              <TextInput
                onChange={onChange}
                value={value}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder={"Numéro de téléphone"}
                keyboardType="phone-pad"
                placeholderTextColor={"gray"}
                className={` w-full text-black px-0 text-lg py-4 `}
              />
            )}
          />
        </View>
      </View>
    </View>
  );
}
