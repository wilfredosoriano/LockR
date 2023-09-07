import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Alert, ToastAndroid, ActivityIndicator} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadBytes, ref } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { FIREBASE_STORAGE } from "../../../Firebaseconfig";
import { getDownloadURL } from "firebase/storage";

const DeveloperProfile = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const userUID = user ? user.uid : null;
  
    const [profileImage, setProfileImage] = useState(null);
    const [uploading, setUploading] = useState(false);
  
    useEffect(() => {
      const storageRef = ref(FIREBASE_STORAGE, `profileImages/security.png`);
      getDownloadURL(storageRef)
        .then((url) => setProfileImage(url))
        .catch((error) => {
          
          setProfileImage(require('../../images/security.png')); 
        });
    }, [userUID]);

  const pickImage = async () => {

    if (user && user.email === "wilfredosoriano.bsit.ucu@gmail.com") {
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
        const storageRef = ref(FIREBASE_STORAGE, `profileImages/security.png`);
        
        
        try {
            
            await uploadBytes(storageRef, blob);
            ToastAndroid.show('Uploaded Successfully', ToastAndroid.SHORT);
        } catch (error) {
            console.error("Error uploading image:", error);
            ToastAndroid.show('Upload Failed', ToastAndroid.SHORT);
        } finally {
            setUploading(false);
        }
        
       
        setProfileImage(result.assets[0].uri);
        }
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={pickImage} disabled={uploading}>
        {uploading ? (
            <View style={{marginTop: 20}}>
                <ActivityIndicator size="large" color="black"/>
            </View>
        ) : (
          <Image
            source={profileImage ? { uri: profileImage } : require('../../images/security.png')}
            style={{ width: 80, height: 80, borderRadius: 50, borderWidth: 2, borderColor: 'black' }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};


export default DeveloperProfile;
