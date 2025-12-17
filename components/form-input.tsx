
import { View, TextInput, TouchableOpacity, Text } from "react-native";

interface PhoneInputProps {
  label: string;
  placeholder: string;
}

export const PhoneInput = ({ label, placeholder }: PhoneInputProps) => (
  <View className="flex-1 mb-4">
    <View className="flex-row gap-4 mt-4 items-center border border-border rounded-lg">
      <View className="w-20">
        <TouchableOpacity>
          <Text className="text-center text-lg py-4 px-0 font-bold">
            {/* {selectedCountry.flag} {selectedCountry.code} */}
          </Text>
        </TouchableOpacity>
      </View>
      <View className="flex-1 flex-row">
        <TextInput
          placeholder={placeholder}
          keyboardType="phone-pad"
          placeholderTextColor="gray"
          className="w-full text-black px-0 text-lg py-4"
        />
      </View>
    </View>
  </View>
);