import { View, Text, TextInput, Platform, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Calendar } from "lucide-react-native";

export default function DateInput({
  label,
  date,
  setDate,
  placeholder,
}: {
  secure: boolean;
  label: string;
  date: Date | undefined;
  setDate: (value: Date | undefined) => void;
  placeholder: string;
  keyboardType: "email-address" | "phone-pad" | "default";
}) {
  const [show, setShow] = useState(false);

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate;
    setShow(Platform.OS === "ios"); // Close for Android in the declarative component
    setDate(currentDate ?? new Date());
  };

  const showMode = (currentMode: "date") => {
    if (Platform.OS === "android") {
      // Use the imperative Android API
      DateTimePickerAndroid.open({
        value: date ?? new Date(),
        onChange,
        mode: currentMode,
        is24Hour: true,
      });
    } else {
      // Show the declarative component on iOS
      setShow(true);
    }
  };

  const showDatePicker = () => {
    showMode("date");
  };

  return (
    <View className="mb-4">
      {/* Button to open the date picker */}

      {/* The component for iOS or when 'show' is true on other platforms */}
      {show && Platform.OS === "ios" && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date ?? new Date()}
          mode="date"
          is24Hour={true}
          display="spinner" // You can also use 'default', 'calendar', or 'compact'
          onChange={onChange}
        />
      )}
      {show && Platform.OS === "android" && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date ?? new Date()}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}

      <Text className="text-base mb-2">
        {label} <Text className="text-primary font-bold">*</Text>{" "}
      </Text>

      <TouchableOpacity
        onPress={showDatePicker}
        className="border rounded-xl px-3  py-1 border-border flex-row justify-between items-center"
      >
        <TextInput
          placeholder={placeholder}
          value={date ? date.toLocaleDateString() : ""}
          className="text-base"
          editable={false}
        />
        <Calendar size={15} />
      </TouchableOpacity>
    </View>
  );
}
