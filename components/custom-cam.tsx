import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { Camera, CameraType } from 'expo-camera';

const CameraForm = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [formData, setFormData] = useState({
    // Other form fields
    itemName: '',
    itemPhoto: null, // Will store the photoUri
  });

  // --- Permissions and Side Effects ---
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // --- Camera Logic ---
  const takePicture = async () => {
    if (cameraRef) {
      try {
        let photo = await cameraRef.takePictureAsync({
          quality: 0.5, // Adjust quality as needed
          base64: false,
          exif: false,
        });
        
        // Save the URI and hide the camera
        setPhotoUri(photo.uri);
        setFormData({ ...formData, itemPhoto: photo.uri });
        setShowCamera(false); 
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  };

  // --- Form Logic ---
  const handleSubmit = () => {
    console.log('Form Submitted with Photo:', formData);
    // Here you would typically send the formData to your backend,
    // including uploading the file at formData.itemPhoto.
    alert('Form submitted! Check console for data.');
  };

  // --- Rendering ---
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {/* This is the main form view. 
        It conditionally renders the Camera or the Form fields.
      */}

      {!showCamera && (
        <View>
          <Text style={styles.header}>Item Submission Form</Text>
          
          {/* Example Form Field (e.g., TextInput for Item Name) */}
          <Text>Item Name: {formData.itemName}</Text>
          <Button title="Edit Item Name" onPress={() => setFormData({...formData, itemName: 'New Item'})}/>
          
          <View style={styles.photoSection}>
            <Text style={styles.label}>Item Photo:</Text>
            {photoUri ? (
              <>
                <Image source={{ uri: photoUri }} style={styles.preview} />
                <Button 
                  title="Retake Photo" 
                  onPress={() => {
                    setPhotoUri(null);
                    setShowCamera(true);
                  }}
                />
              </>
            ) : (
              <Button title="Take Photo" onPress={() => setShowCamera(true)} />
            )}
          </View>

          <Button 
            title="Submit Form" 
            onPress={handleSubmit} 
            disabled={!formData.itemPhoto || !formData.itemName}
          />
        </View>
      )}

      {/* Camera View (Only shows when showCamera is true) */}
      {showCamera && (
        <View style={styles.cameraContainer}>
          <Camera
            style={styles.camera}
            type={CameraType.back}
            ref={ref => setCameraRef(ref)}
          >
            <View style={styles.buttonContainer}>
              <Button title="Snap Photo" onPress={takePicture} />
            </View>
          </Camera>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  photoSection: {
    marginVertical: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  preview: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 15,
    borderRadius: 5,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  camera: {
    flex: 1,
    aspectRatio: 1, // Optional: keeps the camera view square
  },
  buttonContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
    alignSelf: 'center',
  },
});

export default CameraForm;