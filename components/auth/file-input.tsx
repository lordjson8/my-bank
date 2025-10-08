import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { LucideIcon } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

export default function FileInput({
  label,
  Icon,
  inputLabel,
  description,
  image,
  setImage,
}: {
  label: string;
  Icon: LucideIcon;
  inputLabel: string;
  description: string;
  image: string | undefined;
  setImage: React.Dispatch<React.SetStateAction<string>>;
}) {
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      // aspect: [9,16],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].fileName ?? "file");
    }
  };

  return (
    <View className="mb-4">
      <Text className="text-base mb-2">
        {label} <Text className="text-primary font-bold">*</Text>{" "}
      </Text>

      <View className="border border-border px-6 py-8 rounded-xl flex items-center justify-center">
        {image === "" ? (
          <>
            <TouchableOpacity
              onPress={pickImage}
              className="w-20 h-20 rounded-full bg-card flex items-center justify-center"
            >
              <Icon size={34} color={"#F97316"} />
            </TouchableOpacity>
            <Text className="mt-3">{inputLabel}</Text>
            <Text className="text-sm text-gray-400 mt-2">{description}</Text>
          </>
        ) : (
          <>
            <View className="flex-row gap-2 px-3 py-3 bg-card items-center mb-3">
              <Icon size={24} color={"#F97316"}/>
              <Text className="text-sm  mt-2 max-h-6">{image}</Text>
            </View>
             <TouchableOpacity
              onPress={pickImage}
              className="rounded-xl  flex items-center justify-center"
            >
              <Text className="text-primary ">Changer</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}
