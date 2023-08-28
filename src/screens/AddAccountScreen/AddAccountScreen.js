import React, { useState, useCallback } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, Modal } from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronCircleLeft, faEllipsisV, faEye, faEyeSlash, faClone, faTrashAlt, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import { showMessage, hideMessage } from "react-native-flash-message";
import * as Clipboard from 'expo-clipboard';
import { doc, deleteDoc, addDoc, collection } from "firebase/firestore";
import { FIREBASE_FIRESTORE, FIREBASE_AUTH } from "../../../Firebaseconfig";
import { getAuth } from "firebase/auth";
import CryptoJS from 'crypto-js';
//import { useFonts, OpenSans_400Regular } from "@expo-google-fonts/open-sans";
import { useFonts } from "expo-font";
import { SelectList } from "react-native-dropdown-select-list";


const AddAccountScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();

    const auth = getAuth();

    //const [fontLoaded] = useFonts({
    //    OpenSans_400Regular, // Load the Open Sans font
    //  })

    const selectedItem = route.params?.selectedItem;

    const[visible, setVisible] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [titleValue, setTitleValue] = useState('');
    const [usernameValue, setUsernameValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');

    const [selectedPlatform, setSelectedPlatform] = useState('');

    const [passwordStrength, setPasswordStrength] = useState('');

    const evaluatePasswordStrength = (password) => {
        
        if (password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password)) {
            setPasswordStrength('Strong');
        } else if (password.length >= 6) {
            setPasswordStrength('Moderate');
        } else {
            setPasswordStrength('Weak');
        }
    };

    const handlePasswordChange = (newPassword) => {
        setPasswordValue(newPassword);
        evaluatePasswordStrength(newPassword);
    };
  
    const platformOptions = [
        {key:'1', value:'Google'},
        {key:'2', value:'Facebook'},
        {key:'3', value:'Microsoft'},
        {key:'4', value:'Twitter'},
        {key:'5', value:'Shopee'},
        {key:'6', value:'Instagram'},
    ]

    const handlePlatformSelect = (selectedPlatform) => {
      
      setSelectedPlatform(selectedPlatform);
    };

    const handleBack = () => {
        navigation.navigate('Home');
    }

    const togglePasswordVisibility = () => {
        setShowPassword(prevShowPassword => !prevShowPassword);
    };

    const handleCopyPassword = async () => {
        await Clipboard.setStringAsync(passwordValue);
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
        await Clipboard.setStringAsync(usernameValue);
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

    const deleteItem = async (itemId) => {
        try {
            // Delete from Firestore
            await deleteDoc(doc(FIREBASE_FIRESTORE, 'accounts', itemId));
            // Update state to remove the deleted item from the UI
            //setSortedAccounts((prevAccounts) => prevAccounts.filter((account) => account.id !== itemId));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleAddAccount = async () => {

        if (!selectedPlatform || !usernameValue || !passwordValue) {
            showMessage({
                message: "Please input all details first",
                type: "danger",
                backgroundColor: "red",
                color: "white",
                duration: 2000,
                floating: true,
                icon: { icon: "danger", position: "left" },
            });
            return;
        }

        try {
            const createdAt = new Date();
            const user = auth.currentUser;                                           

            try {
                const userDocRef = await addDoc(collection(FIREBASE_FIRESTORE, 'accounts'), {
                    title: selectedPlatform,
                    username: usernameValue,
                    password: CryptoJS.AES.encrypt(JSON.stringify({ passwordValue }), 'secret').toString(),
                    createdAt: createdAt,
                    userId: user.uid,
                });

                console.log('Document written with ID: ', userDocRef.id);

                setTitleValue('');
                setUsernameValue('');
                setPasswordValue('');
            } catch (error) {
                console.error('Error adding document: ', error);
            }
        } catch (error) {
            console.error('Error hashing password: ', error);
        }
    }
    

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={handleBack}>
                        <FontAwesomeIcon icon={ faChevronCircleLeft } size={24} style={{color: '#018FF8'}}/>
                    </TouchableOpacity>
                    <Text style={styles.passwordDetail}>Add Account</Text>
                </View>
                <TouchableOpacity onPress={toggleDropdown}>
                    <FontAwesomeIcon icon={ faEllipsisV } size={24} style={{color: '#018FF8'}}/>
                </TouchableOpacity>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={dropdownVisible}
                    onRequestClose={toggleDropdown}>
                    <TouchableOpacity style={styles.modalContainer} activeOpacity={11} onPress={handleTouchablePress}>
                        <View style={styles.dropdownContainer}>
                            <TouchableOpacity style={styles.dropdownItem} onPress={() => {setDropdownVisible(false); deleteItem(selectedItem.id); navigation.navigate('Home');}}>
                                <FontAwesomeIcon icon={faTrashAlt} size={18} style={styles.dropdownIcon} />
                                <Text style={styles.dropdownText}>Delete Account</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
            <View style={styles.mainContent}>

                <View style={styles.boxContent}>
                <SelectList 
                    setSelected={(selectedPlatform) => handlePlatformSelect(selectedPlatform)} 
                    data={platformOptions} 
                    save="value"
                />
                <View style={styles.inputBox}>
                    <TextInput style={styles.input} placeholder="Username/Email address"
                    value={usernameValue}
                    onChangeText={setUsernameValue}></TextInput>
                    <TouchableOpacity onPress={handleCopyPassword2}>
                        <FontAwesomeIcon icon={ faClone } size={18} style={{color: 'gray', marginHorizontal: 10}}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.inputBox}>
                    <TextInput style={styles.input} placeholder="Password"                    
                value={passwordValue}
                secureTextEntry={!showPassword}
                onChangeText={handlePasswordChange}></TextInput>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={togglePasswordVisibility}>
                            <FontAwesomeIcon
                                icon={showPassword ? faEyeSlash : faEye}
                                size={18}
                                style={{ color: 'gray' }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCopyPassword}>
                            <FontAwesomeIcon icon={ faClone } size={18} style={{color: 'gray', marginHorizontal: 10}}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={handleAddAccount}>
                <View style={{backgroundColor: 'transparent', borderWidth: 1, marginVertical: 10 , alignItems: 'center', padding: 15, borderRadius: 10, borderColor: '#018FF8'}}>
                    <Text style={{color: '#018FF8'}}>ADD</Text>
                </View>
                </TouchableOpacity>
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
        marginTop: 10,
        marginBottom: 20,
        marginHorizontal: 20,
        borderRadius: 20,
        elevation: 2,
    },
    boxContent: {
        backgroundColor: '#F9F7F6',
        padding: 20,
        margin: 20,
        borderRadius: 20,
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
    input: {
        fontSize: 18,
        padding: 5,
        width: '80%',
    },
    inputBox: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end', 
        marginTop: 10, 
        alignItems: 'center', 
        backgroundColor: 'white',
        padding: 5,
        elevation: 0,
        borderRadius: 10, 
        elevation: 2,
    },
    optionText: {
        
    },
    optionButton: {
        backgroundColor: 'white',
        width: '100%',
        elevation: 2,
        borderRadius: 10,
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
});

export default AddAccountScreen;