import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Alert, ToastAndroid, ActivityIndicator} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadBytes, ref } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { FIREBASE_STORAGE } from "../../../Firebaseconfig";
import { getDownloadURL } from "firebase/storage";
import LoadingOverlay from "../../components/LoadingOverlay";
import { PLATFORM_IMAGES } from "../../utils/platformImages";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileImageUpload = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const userUID = user ? user.uid : null;
  
    const [profileImage, setProfileImage] = useState(null);
    const [uploading, setUploading] = useState(false);
  
    useEffect(() => {
      const storageRef = ref(FIREBASE_STORAGE, `profileImages/${userUID}`);
      getDownloadURL(storageRef)
        .then((url) => setProfileImage(url))
        .catch((error) => {
          
          //setProfileImage(PLATFORM_IMAGES.security.uri); 
        });
    }, [userUID]);

    useEffect(() => {
      const getStoredProfileImage = async () => {
        try {
          const storedImage = await AsyncStorage.getItem(`profileImage/${user}`);
          if (storedImage) {
            setProfileImage(storedImage);
          }
        } catch (error) {
          console.error("Error retrieving stored profile image:", error);
        }
      };
    
      getStoredProfileImage();
    }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
    setUploading(true);
      
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();
      const storageRef = ref(FIREBASE_STORAGE, `profileImages/${userUID}`);
      
      try {
       
        await uploadBytes(storageRef, blob);
        ToastAndroid.show('Uploaded Successfully', ToastAndroid.SHORT);

        await AsyncStorage.setItem(`profileImage/${user}`, result.assets[0].uri);
      } catch (error) {
        console.error("Error uploading image:", error);
        ToastAndroid.show('Upload Failed', ToastAndroid.SHORT);
      } finally {
        setUploading(false);
      }
      
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={pickImage} disabled={uploading}>
        {uploading ? (
          //<ActivityIndicator size="small" color="#0000ff"/>
          <LoadingOverlay />
        ) : (
          <Image
            source={profileImage ? { uri: profileImage } : PLATFORM_IMAGES.security.uri}
            style={{ width: 50, height: 50, borderRadius: 50, borderWidth: 2, borderColor: 'black' }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};


export default ProfileImageUpload;
