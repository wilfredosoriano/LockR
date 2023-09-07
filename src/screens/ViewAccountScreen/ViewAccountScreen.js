import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, Modal, ToastAndroid } from 'react-native';
import { useNavigation, useRoute } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import { showMessage, hideMessage } from "react-native-flash-message";
import * as Clipboard from 'expo-clipboard';
import { doc, deleteDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { FIREBASE_FIRESTORE } from "../../../Firebaseconfig";
import { PLATFORM_IMAGES } from "../../utils/platformImages";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import * as LocalAuthentication from 'expo-local-authentication';

const ViewAccountScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();

    const auth = getAuth();

    const selectedItem = route.params?.selectedItem;
    
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editUsername, setEditUsername] = useState('');
    const [editPassword, setEditPassword] = useState('');

    const [showPasswords, setShowPasswords] = useState({});
    
    const [passwordStrength, setPasswordStrength] = useState('');

    const [selectedEditItem, setSelectedEditItem] = useState(null);

    useEffect(() => {
        evaluatePasswordStrength(selectedItem.password);
    }, [selectedItem]);

    const evaluatePasswordStrength = (password) => {
        
        if (password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password)) {
            setPasswordStrength('Strong');
        } else if (password.length >= 6) {
            setPasswordStrength('Moderate');
        } else {
            setPasswordStrength('Weak');
        }
    };

    const handleBack = () => {
        navigation.navigate('Home');
    }
    const togglePasswordVisibility = (itemId) => {
        setShowPasswords((prevShowPasswords) => ({
          ...prevShowPasswords,
          [itemId]: !prevShowPasswords[itemId],
        }));
      };

    const handleCopyPassword = async () => {
        await Clipboard.setStringAsync(selectedItem.password);
        showMessage({
            message: "Copied to Clipboard",
            type: "success",
            backgroundColor: "gray",
            color: "white",
            duration: 2000, 
            floating: true,
            icon: { icon: "success", position: "left" }, 
        });
    }
    const handleCopyPassword2 = async () => {
        await Clipboard.setStringAsync(selectedItem.username);
        showMessage({
            message: "Copied to Clipboard",
            type: "success",
            backgroundColor: "gray",
            color: "white",
            duration: 2000, 
            floating: true,
            icon: { icon: "success", position: "left" }, 
        });
    }

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    }
    const handleTouchablePress = () => {
        
        setDropdownVisible(false);
    };

    const logHistory = async (action, timestamp) => {
        try {
          const user = auth.currentUser;
          await addDoc(collection(FIREBASE_FIRESTORE, 'history'), {
            userId: user.uid,
            action,
            timestamp,
          });
          console.log('History log added:', action);
        } catch (error) {
          console.error('Error logging history:', error);
        }
      };

    const deleteItem = async (itemId) => {
        const isAuthenticated = await authenticateWithBiometrics();
        if (isAuthenticated) {
            try {
                const createdAt = new Date();
    
                await logHistory('Deleted Account', createdAt);
                    
                ToastAndroid.show('Account deleted', ToastAndroid.SHORT);
                await deleteDoc(doc(FIREBASE_FIRESTORE, 'accounts', itemId));
                navigation.navigate('Home');
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        } else {
            ToastAndroid.show('Authenticate first to delete your account', ToastAndroid.SHORT);
        }
    };

    const authenticateWithBiometrics = async () => {
        try {
            const hasBiometrics = await LocalAuthentication.hasHardwareAsync();
            if (hasBiometrics) {
                    await LocalAuthentication.isEnrolledAsync();
                    const result = await LocalAuthentication.authenticateAsync({
                        promptMessage: 'Authenticate to delete your account',
                    });
                    if (result.success) {
                        return true;
                    } else {
                        console.log('Biometric authentication failed');
                    }
            } else {
                console.log('Biometric hardware is not available');
            }
        } catch (error) {
            console.error('Error during biometric authentication:', error);
        }
    };
    

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={handleBack}>
                        <Ionicons name="arrow-back-circle-outline" size={30}/>
                    </TouchableOpacity>
                    <Text style={styles.passwordDetail}>Password Detail</Text>
                </View>
                <TouchableOpacity onPress={toggleDropdown}>
                    <Ionicons name="ellipsis-vertical-outline" size={30}/>
                </TouchableOpacity>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={dropdownVisible}
                    onRequestClose={toggleDropdown}>
                    <TouchableOpacity style={styles.modalContainer} activeOpacity={11} onPress={handleTouchablePress}>
                        <View style={styles.dropdownContainer}>
                            {/*<TouchableOpacity style={styles.dropdownItem} onPress={() => {setDropdownVisible(false); handleItemEdit(selectedItem)}}>
                                <FontAwesomeIcon icon={faEdit} size={18} style={styles.dropdownIcon} />
                                <Text style={styles.dropdownText}>Edit Account</Text>
                            </TouchableOpacity>*/}
                            <TouchableOpacity style={styles.dropdownItem} onPress={() => {setDropdownVisible(false); deleteItem(selectedItem.id);}}>
                                <Ionicons name="trash-outline" size={24}/>
                                <Text style={styles.dropdownText}>Delete Account</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
            <View style={styles.mainContent}>
                <View style={{alignItems: 'center'}}>
                <Image
                source={(() => {
                    if (selectedItem.title === 'Facebook') {
                        return PLATFORM_IMAGES.facebook.uri;
                    } else if (selectedItem.title === 'Google') {
                        return PLATFORM_IMAGES.google.uri;
                    } else if (selectedItem.title === 'Microsoft') {
                        return PLATFORM_IMAGES.microsoft.uri;
                    } else if (selectedItem.title === 'Shopee') {
                        return PLATFORM_IMAGES.shopee.uri;
                    } else if (selectedItem.title === 'Twitter') {
                        return PLATFORM_IMAGES.twitter.uri;
                    } else if (selectedItem.title === 'Telegram') {
                        return PLATFORM_IMAGES.telegram.uri;
                    } else if (selectedItem.title === 'Instagram') {
                        return PLATFORM_IMAGES.instagram.uri;
                    }
                })()}
                style={styles.image}
                resizeMode="contain"
                />
                    <Text style={{fontSize: 20, fontWeight: 'bold', marginTop: 10,}}>{selectedItem.title}</Text>
                </View>

                <View style={styles.boxContent}>
                <Text style={{color: 'gray'}}>Username/email address</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={{fontSize: 18, maxWidth: 220}}>{selectedItem.username}</Text>
                <TouchableOpacity onPress={handleCopyPassword2}>
                    <Ionicons name="copy-outline" size={20}/>
                </TouchableOpacity>
                </View>

                <Text style={{color: 'gray', marginTop: 10}}>Password</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        {showPasswords[selectedItem.id] ? (
                        <Text style={{fontSize: 18, maxWidth: 220}}>{selectedItem.password}</Text>
                        ) : (
                            <TextInput editable={false} style={[styles.asterisks, {maxWidth: 200}]}>{'*'.repeat(selectedItem.password.length)}</TextInput>
                        )}
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => togglePasswordVisibility(selectedItem.id)}>
                                {showPasswords[selectedItem.id] ? (
                                    <Ionicons name="eye-outline" size={20} style={{marginRight: 5}}/>
                                ) : (
                                    <Ionicons name="eye-off-outline" size={20} style={{marginRight: 5}}/>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCopyPassword}>
                                <Ionicons name="copy-outline" size={20}/>
                            </TouchableOpacity>
                        </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: 'gray'}}>Password Strength: </Text>
                {passwordStrength === 'Weak' && (
                    <Text style={[styles.passwordStrengthWeak, styles.passwordStrengthIcon]}>Weak ✘</Text>
                )}
                {passwordStrength === 'Moderate' && (
                    <Text style={[styles.passwordStrengthModerate, styles.passwordStrengthIcon]}> Moderate ⚠</Text>
                )}
                {passwordStrength === 'Strong' && (
                    <Text style={[styles.passwordStrengthStrong, styles.passwordStrengthIcon]}> Strong ✔</Text>
                )}
                </View>
            </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#09055D',
    },
    header: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        padding: 10,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        justifyContent: 'space-between'
    },
    headerLeft: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    passwordDetail: {
        fontSize: 20,
        marginHorizontal: 10,
        fontWeight: 'bold'
    },
    image: {
    width: 50,
    height: 50,
    marginTop: 20,
    borderRadius: 50,
    },
    mainContent: {
        backgroundColor: 'white',
        flex: 1,
        elevation: 2,
        marginTop: 10,
        marginBottom: 20,
        marginHorizontal: 20,
        borderRadius: 20,
    },
    boxContent: {
        backgroundColor: '#F9F7F6',
        padding: 20,
        margin: 20,
        borderRadius: 10,
        elevation: 2,
    },
    dropdownContainer: {
        position: "absolute",
        top: 40,
        right: 20,
        backgroundColor: "white",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    dropdownItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    dropdownIcon: {
        marginRight: 10,
    },
    dropdownText: {
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
    passwordStrengthWeak: {
        color: '#DC1431',
    },
    passwordStrengthModerate: {
        color: '#E1B02E',
    },
    passwordStrengthStrong: {
        color: 'green',
    },
    passwordStrengthIcon: {
        fontSize: 18,
        marginLeft: 10,
    },
    modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
    backgroundColor: 'white',
    width: 300,
    padding: 30,
    borderRadius: 20,
    elevation: 5,
    },
    modalButton: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between'
    },
    addAccountContainer: {
    borderWidth: 1,
    width: '90%',
    paddingHorizontal: 10,
    padding: 5,
    marginVertical: 5,
    borderRadius: 10,
    }
});

export default ViewAccountScreen;