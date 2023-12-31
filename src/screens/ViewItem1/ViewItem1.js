import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, TouchableOpacity, ScrollView, Linking, ToastAndroid} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { FIREBASE_FIRESTORE } from "../../../Firebaseconfig";
import { getAuth } from "firebase/auth";
import { collection, addDoc  } from "firebase/firestore"; 
import AsyncStorage from "@react-native-async-storage/async-storage";

const ViewItem1 = () => {
    
    const navigation = useNavigation();
    const auth = getAuth();
    const user = auth.currentUser;

    const handleBack = () => {
        navigation.navigate('Home');
    }
    const [isHeartFilled, setIsHeartFilled] = useState(false);

    const handleHeartClick = async () => {

        if (isHeartFilled){
            ToastAndroid.show('You already liked this. Thank you.', ToastAndroid.SHORT);
        }

        if (!isHeartFilled) {
            setIsHeartFilled(true);

            try {   
                    AsyncStorage.setItem(user.uid + 'item1', 'true');
                    await addDoc(collection(FIREBASE_FIRESTORE, 'likes'), {
                        itemId: 'item1', 
                        userId: user.uid,
                    });
    
                    console.log('like added:', user.uid);
    
            } catch (error) {
                console.error("Error handling heart click:", error);
            }
          }
    }

    useEffect(() => {
        
        

        if (user){
            const fetchLikedStatus = async () => {
                try {
                    const likedStatus = await AsyncStorage.getItem(user.uid + 'item1');
                    if (likedStatus !== null) {
                        setIsHeartFilled(JSON.parse(likedStatus));
                    }
                } catch (error) {
                    console.log(error);
                }
            };
    
            fetchLikedStatus();
        }
    }, []);
    
    
    
    
      
      

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={handleBack}>
                        <Ionicons name="arrow-back-circle-outline" size={30}/>
                    </TouchableOpacity>
                    <Text style={styles.passwordDetail}></Text>
                </View>
                <TouchableOpacity onPress={handleHeartClick}>
                <Ionicons
                    name={isHeartFilled ? "heart" : "heart-outline"}
                    size={30}
                    color={isHeartFilled ? "red" : "black"}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.mainContent}>
            <Text style={{marginHorizontal: 5, fontFamily: 'Open-Sans-Bold', marginVertical: 10, fontSize: 15,}}>Steps on how to create a strong password: <Text onPress={() => { Linking.openURL('https://www.nist.gov/cybersecurity'); }} style={{fontWeight: '300', textDecorationLine: "underline"}}>Learn more</Text> </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginTop: 5}]}>
                <Text style={{textAlign: 'center', fontFamily: 'Open-Sans'}}><Text style={{fontFamily: 'Open-Sans-Bold'}}>1. Length:</Text> Make your password long. Aim for at least 12 characters or more. Longer passwords are generally more secure.</Text>
            </View>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginTop: 5}]}>
                <Text style={{textAlign: 'center', fontFamily: 'Open-Sans'}}><Text style={{fontFamily: 'Open-Sans-Bold'}}>2. Complexity:</Text> Use a mix of character types. Include uppercase letters, lowercase letters, numbers, and special symbols (such as !, @, #, $, %, etc.) in your password. This diversity makes it harder to guess.</Text>
            </View>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginTop: 5}]}>
                <Text style={{textAlign: 'center', fontFamily: 'Open-Sans'}}><Text style={{fontFamily: 'Open-Sans-Bold'}}>3. Avoid Personal Information:</Text> Avoid using easily discoverable information like your name, birthdate, or common words found in the dictionary. Hackers often use automated tools that can guess these easily.</Text>
            </View>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginTop: 5}]}>
                <Text style={{textAlign: 'center', fontFamily: 'Open-Sans'}}><Text style={{fontFamily: 'Open-Sans-Bold'}}>4. Unpredictability:</Text> Create a password that doesn't follow easily guessable patterns. Avoid common patterns like "12345" or "password."</Text>
            </View>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginTop: 5}]}>
                <Text style={{textAlign: 'center', fontFamily: 'Open-Sans'}}><Text style={{fontFamily: 'Open-Sans-Bold'}}>5. Uniqueness:</Text> Use a different password for each of your accounts. This way, if one password is compromised, your other accounts remain secure.</Text>
            </View>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginTop: 5}]}>
                <Text style={{textAlign: 'center', fontFamily: 'Open-Sans'}}><Text style={{fontFamily: 'Open-Sans-Bold'}}>6. Avoid Dictionary Words:</Text> Don't use complete words that can be found in a dictionary, as attackers often use dictionary attacks. Instead, consider using a combination of unrelated words, misspellings, or abbreviations.</Text>
            </View>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginTop: 5}]}>
                <Text style={{textAlign: 'center', fontFamily: 'Open-Sans'}}><Text style={{fontFamily: 'Open-Sans-Bold'}}>7. Use Passphrases:</Text> Consider using passphrases or a combination of random words. A passphrase is a longer sequence of words or a sentence, which can be easier to remember and more secure. For example, "BlueTiger$Dances#UnderMoon" is a strong passphrase.</Text>
            </View>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginTop: 5}]}>
                <Text style={{textAlign: 'center', fontFamily: 'Open-Sans'}}><Text style={{fontFamily: 'Open-Sans-Bold'}}>8. Regularly Update Passwords: </Text> Periodically change your passwords, especially for critical accounts. Avoid using the same password for an extended period.</Text>
            </View>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginTop: 5}]}>
                <Text style={{textAlign: 'center', fontFamily: 'Open-Sans'}}><Text style={{fontFamily: 'Open-Sans-Bold'}}>9. Enable Two-Factor Authentication (2FA):</Text>  Whenever possible, enable two-factor authentication for your accounts. 2FA provides an extra layer of security by requiring you to enter a one-time code or use a second authentication method, such as a fingerprint or authentication app, in addition to your password.</Text>
            </View>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginVertical: 5}]}>
                <Text style={{textAlign: 'center', fontFamily: 'Open-Sans'}}><Text style={{fontFamily: 'Open-Sans-Bold'}}>10. Use a Password Manager:</Text> Consider using a reputable password manager to generate, store, and manage your passwords securely. Password managers can generate complex passwords for you and help you keep track of them across different accounts.</Text>
            </View>
            </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        padding: 10,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 5,
        marginTop: 5,
        justifyContent: 'space-between'
    },
    headerLeft: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    passwordDetail: {
        fontSize: 20,
        marginHorizontal: 10,
        fontFamily: 'Open-Sans-Bold'
    },
    mainContent: {
        backgroundColor: 'white',
        flex: 1,
        elevation: 5,
        marginTop: 10,
        marginBottom: 20,
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 5,
    },
    boxContent: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#F9F7F6',
        padding: 20,
        marginHorizontal: 5,
        borderRadius: 10,
        elevation: 2,
    },
});



export default ViewItem1;