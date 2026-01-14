import { View, Text, TouchableOpacity, Button } from "react-native";
import React, { useState } from "react";
import { LucideIcon } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";

const renderPicture = (uri: string) => {
  return (
    <View>
      <Image
        source={{ uri: uri }}
        contentFit="contain"
       className="ng-red-500"
        style={{ width: "100%", aspectRatio: 1, borderRadius: 8, height: "auto" }}
      />
    </View>
  );
};

export default function FileInput({
  label,
  Icon,
  inputLabel,
  description,
  image,
  error,
  setImage,
}: {
  error?: string | any;
  label: string;
  Icon: LucideIcon;
  inputLabel: string;
  description: string;
  image: ImagePicker.ImagePickerAsset | null;
  setImage: (file: ImagePicker.ImagePickerAsset | null) => void;
}) {
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      // aspect: [9,16],
      quality: 1,
    });

    console.log(result);
    console.log("Error ", error);

    if (!result.canceled) {
      console.log("image ", typeof result.assets[0].file);
      setImage(result.assets[0] ?? null);
    }
  };

  return (
    <View className="mb-4">
      <Text className="text-base mb-2">
        {label} <Text className="text-primary font-bold">*</Text>{" "}
      </Text>

      <View
        className={`border ${error ? "border-red-300" : "border-border"} px-6 py-8 bg-white rounded-xl flex items-center ${!image && "justify-center"}`}
      >
        {image ? (
          <>
            {/* {renderPicture(image.uri!)} */}
            <View className="flex-row gap-2 px-3 py-3 bg-card items-center mb-3">
              <Icon size={24} color={"#F97316"} />
              <Text className="text-sm  mt-2 max-h-6">{image.fileName}</Text>
            </View>
            <TouchableOpacity
              onPress={pickImage}
              className="rounded-xl  flex items-center justify-center"
            >
              <Text className="text-primary ">Changer</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={pickImage}
              className="w-20 h-20 rounded-full bg-card flex items-center justify-center"
            >
              <Icon size={34} color={"#F97316"} />
            </TouchableOpacity>
            <Text className="mt-3">{inputLabel}</Text>
            <Text className="text-sm text-gray-400 mt-2">{description}</Text>
            {error && <Text className="text-red-500 text-sm">{error}</Text>}
          </>
        )}
      </View>
    </View>
  );
}

export function PhotoInput({
  label,
  Icon,
  inputLabel,
  description,
  image,
  error,
  setImage,
}: {
  error?: string | any;
  label: string;
  Icon: LucideIcon;
  inputLabel: string;
  description: string;
  image: ImagePicker.ImagePickerAsset | null;
  setImage: (file: ImagePicker.ImagePickerAsset | null) => void;
}) {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View>
        <Text>We need your permission to show the camera</Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-primary py-3 mt-2 rounded-lg mb-2"
        >
          <Text className="text-white text-center">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      // aspect: [9,16],
      quality: 1,
    });

    console.log(result);
    console.log("Error ", error);

    if (!result.canceled) {
      console.log();
      setImage(result.assets[0] ?? null);
    }
  };

  return (
    <View className="mb-4">
      <Text className="text-base mb-2">
        {label} <Text className="text-primary font-bold">*</Text>{" "}
      </Text>
      <CameraView style={{ width: "100%", height: 200 }} facing={facing} />
      <View
        className={`border ${error ? "border-red-300" : "border-border"} px-6 py-8 rounded-xl flex items-center justify-center`}
      >
        {image ? (
          <>
            <View className="flex-row gap-2 px-3 py-3 bg-card items-center mb-3">
              <Icon size={24} color={"#F97316"} />
              <Text className="text-sm  mt-2 max-h-6">{image.fileName}</Text>
            </View>
            <TouchableOpacity
              onPress={pickImage}
              className="rounded-xl  flex items-center justify-center"
            >
              <Text className="text-primary ">Changer</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={toggleCameraFacing}
              className="w-20 h-20 rounded-full bg-card flex items-center justify-center"
            >
              <Icon size={34} color={"#F97316"} />
            </TouchableOpacity>
            <Text className="mt-3">{inputLabel}</Text>
            <Text className="text-sm text-gray-400 mt-2">{description}</Text>
            {error && <Text className="text-red-500 text-sm">{error}</Text>}
          </>
        )}
      </View>
    </View>
  );
}
