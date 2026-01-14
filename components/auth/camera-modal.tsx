import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

export default function CameraModal() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [modalVisible, setModalVisible] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [flash, setFlash] = useState('off');
  const [zoom, setZoom] = useState(0);
  const [isPreview, setIsPreview] = useState(false);

  const cameraRef = useRef(null);

  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <Text className="text-white text-lg">Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900 p-6">
        <Text className="text-white text-center text-lg mb-4">
          We need your permission to use the camera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-blue-500 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: true,
          exif: true,
        });
        setPhoto(photo);
        setIsPreview(true);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(current => {
      if (current === 'off') return 'on';
      if (current === 'on') return 'auto';
      return 'off';
    });
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 1));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0]);
      setIsPreview(true);
    }
  };

  const savePhoto = () => {
    Alert.alert('Success', 'Photo saved to gallery!');
    setPhoto(null);
    setIsPreview(false);
  };

  const retakePhoto = () => {
    setPhoto(null);
    setIsPreview(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Main Content */}
      <View className="flex-1 items-center justify-center p-4">
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-2xl shadow-2xl shadow-purple-500/50 active:scale-95 transition-all"
        >
          <View className="items-center">
            <Ionicons name="camera" size={48} color="white" />
            <Text className="text-white text-xl font-bold mt-4">Open Camera</Text>
            <Text className="text-white/80 text-sm mt-2">Capture beautiful moments</Text>
          </View>
        </TouchableOpacity>

        <Text className="text-white/60 text-center mt-8 px-6">
          Press the button above to open the camera and capture stunning photos
        </Text>
      </View>

      {/* Camera Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        statusBarTranslucent
      >
        <View className="flex-1 bg-black">
          {!isPreview ? (
            <>
              {/* Camera View */}
              <CameraView
                ref={cameraRef}
                style={{ flex: 1 }}
                facing={facing}
                flash={flash}
                zoom={zoom}
                mode="picture"
              >
                {/* Top Controls */}
                <BlurView intensity={80} className="absolute top-0 left-0 right-0">
                  <SafeAreaView className="flex-row justify-between items-center px-4 py-3">
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
                    >
                      <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>

                    <View className="flex-row space-x-4">
                      <TouchableOpacity
                        onPress={toggleFlash}
                        className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
                      >
                        <Ionicons 
                          name={flash === 'off' ? 'flash-off' : flash === 'on' ? 'flash' : 'flash-auto'} 
                          size={22} 
                          color="white" 
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={toggleCameraFacing}
                        className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
                      >
                        <Ionicons name="camera-reverse" size={22} color="white" />
                      </TouchableOpacity>
                    </View>
                  </SafeAreaView>
                </BlurView>

                {/* Zoom Controls */}
                <View className="absolute right-4 top-1/3">
                  <View className="bg-black/50 rounded-2xl p-2 items-center">
                    <TouchableOpacity onPress={handleZoomIn} className="p-2">
                      <Ionicons name="add" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white font-medium my-2">
                      {Math.round(zoom * 10)}x
                    </Text>
                    <TouchableOpacity onPress={handleZoomOut} className="p-2">
                      <Ionicons name="remove" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Bottom Controls */}
                <BlurView intensity={80} className="absolute bottom-0 left-0 right-0">
                  <SafeAreaView className="items-center py-6">
                    <View className="flex-row items-center justify-center space-x-8">
                      <TouchableOpacity
                        onPress={pickImage}
                        className="w-16 h-16 rounded-2xl bg-white/20 items-center justify-center border-2 border-white/30"
                      >
                        <Ionicons name="images" size={28} color="white" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={takePicture}
                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg shadow-white/50"
                      >
                        <View className="flex-1 m-2 rounded-full bg-white" />
                      </TouchableOpacity>

                      <View className="w-16 h-16" />
                    </View>
                  </SafeAreaView>
                </BlurView>
              </CameraView>
            </>
          ) : (
            // Preview Modal
            <View className="flex-1 bg-black">
              <Image
                source={{ uri: photo?.uri }}
                style={{ flex: 1 }}
                resizeMode="contain"
              />
              
              {/* Preview Controls */}
              <BlurView intensity={100} className="absolute bottom-0 left-0 right-0">
                <SafeAreaView className="py-6 px-8">
                  <View className="flex-row justify-between items-center">
                    <TouchableOpacity
                      onPress={retakePhoto}
                      className="px-6 py-3 rounded-full bg-white/20 items-center"
                    >
                      <Ionicons name="camera" size={22} color="white" />
                      <Text className="text-white text-sm font-medium mt-1">Retake</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={savePhoto}
                      className="px-8 py-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 items-center shadow-lg shadow-green-500/30"
                    >
                      <Ionicons name="checkmark" size={28} color="white" />
                      <Text className="text-white font-bold mt-1">Use Photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(false);
                        setIsPreview(false);
                        setPhoto(null);
                      }}
                      className="px-6 py-3 rounded-full bg-white/20 items-center"
                    >
                      <Ionicons name="close" size={22} color="white" />
                      <Text className="text-white text-sm font-medium mt-1">Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </SafeAreaView>
              </BlurView>

              {/* Top Bar */}
              <BlurView intensity={80} className="absolute top-0 left-0 right-0">
                <SafeAreaView className="px-4 py-3 items-center">
                  <Text className="text-white text-lg font-semibold">Preview</Text>
                </SafeAreaView>
              </BlurView>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}