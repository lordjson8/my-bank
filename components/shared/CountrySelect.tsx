import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import PhoneModal from "../auth/phone-modal";
import { countries } from "@/constants";
import { Control, Controller } from "react-hook-form";

export default function CountrySelect({
  control,
  name,
  disable = false,
  selectedCountry,
  setSelectedCountry
}: {
  name: string;
  disable?: boolean;
  control: Control<any>;
  selectedCountry: (typeof countries)[0];
  setSelectedCountry: (value: (typeof countries)[0]) => void;
}) {
  // const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [modalVisible, setModalVisible] = useState(false);

  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = React.useCallback(() => setIsFocused(true), []);
  const handleBlur = React.useCallback(() => setIsFocused(false), []);

  return (
    <View className="mb-2">
      <PhoneModal
        modalVisible={modalVisible && !disable}
        setModalVisible={setModalVisible}
        setSelectedCountry={setSelectedCountry}
      />
      <Text className="text-base mb-2 ">
        Pays <Text className="text-primary font-bold">*</Text>{" "}
      </Text>

      {/* <Text className="text-sm invisible text-muted-foreground">
                          {"placeholder"}
                        </Text> */}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <View
              className={`flex-row gap-4 items-center border-2 rounded-lg ${isFocused ? "border-primary" : "border-border"} ${error ? "border-red-500" : "border-border"}`}
            >
              <View className="w-20">
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Text className={`text-center ${disable ? 'text-gray-500' : 'text-black'} text-lg py-4 px-0 font-bold`}>
                    {selectedCountry.flag} {selectedCountry.code}
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="flex-1 ">
                <TextInput
                  editable={!disable}
                  onChangeText={onChange}
                  value={value}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                  placeholder={"Numéro de téléphone"}
                  keyboardType="phone-pad"
                  placeholderTextColor={"gray"}
                  className={` w-full  px-0 text-lg  py-4 ${disable ? 'text-gray-500' : 'text-black'} `}
                />
              </View>
            </View>

            {error && (
              <Text className="text-red-500 text-md mt-1">{error.message}</Text>
            )}
          </>
        )}
      />
    </View>
  );
}
