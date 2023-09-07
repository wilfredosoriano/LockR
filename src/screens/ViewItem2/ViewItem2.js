import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, TouchableOpacity, ScrollView, Linking, ToastAndroid } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "firebase/auth";
import { FIREBASE_FIRESTORE } from "../../../Firebaseconfig";
import { addDoc, collection} from "firebase/firestore";

const ViewItem2 = () => {
    
    const navigation = useNavigation();
    const auth = getAuth();
    const user = auth.currentUser;

    const handleBack = () => {
        navigation.navigate('Home');
    }
    const [isHeartFilled, setIsHeartFilled] = useState(false);
    const [timeDifference, setTimeDifference] = useState(null);

 
    const twentyThreeHours = 24 * 60 * 60 * 1000;

    const handleHeartClick = async () => {

        if (isHeartFilled) {
            const lastLikeTimestamp = await AsyncStorage.getItem(user.uid + 'item2_last_like');
            if (lastLikeTimestamp !== null) {
              const lastLikeDate = new Date(parseInt(lastLikeTimestamp));
              const currentDate = new Date();
      
            
              const difference = currentDate - lastLikeDate;
              
              setTimeDifference(difference);
      
              if (difference < twentyThreeHours) {
                const remainingTime = twentyThreeHours - difference;
                const remainingHours = Math.floor(remainingTime / (60 * 60 * 1000));
                ToastAndroid.show(`You already liked today. You can like again in ${remainingHours} hours.`, ToastAndroid.SHORT);
                return; 
              }
            }
          } else {
            setIsHeartFilled(true);

            try {   
                    await AsyncStorage.setItem(user.uid + 'item2', JSON.stringify(!isHeartFilled));
                    await AsyncStorage.setItem(user.uid + 'item2_last_like', String(new Date().getTime()));
             
                    await addDoc(collection(FIREBASE_FIRESTORE, 'likes'), {
                        itemId: 'item2',
                        userId: user.uid,
                    });
    

                    //setLikeCount(likeCount + 1);
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
                    const likedStatus = await AsyncStorage.getItem(user.uid + 'item2');
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
                    name={isHeartFilled && timeDifference < twentyThreeHours ? "heart" : "heart-outline"}
                    size={30}
                    color={isHeartFilled && timeDifference < twentyThreeHours ? "red" : "black"}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.mainContent}>
            <Text style={{marginHorizontal: 5, fontWeight: 'bold', marginVertical: 10, fontSize: 15,}}>How to secure your account: <Text onPress={() => { Linking.openURL('https://staysafeonline.org/resources/online-safety-basics/'); }} style={{fontWeight: '300', textDecorationLine: "underline"}}>Learn more</Text> </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginTop: 5}]}>
                <Text style={{textAlign: 'center'}}><Text style={{fontWeight: 'bold'}}>1. Use Strong, Unique Passwords:</Text> Create complex passwords for each account. Use a mix of uppercase letters, lowercase letters, numbers, and special characters. Avoid using easily guessable information like birthdays or common words.</Text>
            </View>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginTop: 5}]}>
                <Text style={{textAlign: 'center'}}><Text style={{fontWeight: 'bold'}}>2. Enable Two-Factor Authentication (2FA):</Text> Whenever possible, enable 2FA for your accounts. This adds an extra layer of security by requiring a second verification step, such as a code sent to your phone.</Text>
            </View>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginTop: 5}]}>
                <Text style={{textAlign: 'center'}}><Text style={{fontWeight: 'bold'}}>3. Regularly Update Passwords:</Text> Change your passwords periodically, especially for critical accounts. This helps protect your account from breaches.</Text>
            </View>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginTop: 5}]}>
                <Text style={{textAlign: 'center'}}><Text style={{fontWeight: 'bold'}}>4. Beware of Phishing Emails:</Text> Be cautious of unsolicited emails or messages asking for personal information. Verify the sender's identity before clicking on any links or providing information.</Text>
            </View>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginTop: 5}]}>
                <Text style={{textAlign: 'center'}}><Text style={{fontWeight: 'bold'}}>5. Use a Password Manager: </Text> Consider using a password manager to securely store and manage your passwords. It can generate and autofill complex passwords for you.</Text>
            </View>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginTop: 5}]}>
                <Text style={{textAlign: 'center'}}><Text style={{fontWeight: 'bold'}}>6. Monitor Your Accounts:</Text> Regularly review your account activity for any suspicious or unauthorized transactions. Report any anomalies immediately.</Text>
            </View>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginTop: 5}]}>
                <Text style={{textAlign: 'center'}}><Text style={{fontWeight: 'bold'}}>7. Secure Your Devices:</Text> Ensure that your devices, including smartphones and computers, have up-to-date security software and are locked with strong PINs or passwords.</Text>
            </View>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginTop: 5}]}>
                <Text style={{textAlign: 'center'}}><Text style={{fontWeight: 'bold'}}>8. Protect Your Wi-Fi:</Text> Secure your home Wi-Fi network with a strong password. Avoid using default router passwords.</Text>
            </View>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginTop: 5}]}>
                <Text style={{textAlign: 'center'}}><Text style={{fontWeight: 'bold'}}>9. Limit Personal Information Sharing:</Text> Be cautious about sharing personal information on social media and other online platforms. Cybercriminals can use this information for identity theft.</Text>
            </View>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginVertical: 5}]}>
                <Text style={{textAlign: 'center'}}><Text style={{fontWeight: 'bold'}}>10. Educate Yourself:</Text> Stay informed about online security threats and best practices. Learn how to recognize common scams and protect yourself.</Text>
            </View>
            </ScrollView>
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
    mainContent: {
        backgroundColor: 'white',
        flex: 1,
        elevation: 2,
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



export default ViewItem2;