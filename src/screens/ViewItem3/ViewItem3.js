import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, TouchableOpacity, ScrollView, Linking, ToastAndroid } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "firebase/auth";
import { FIREBASE_FIRESTORE } from "../../../Firebaseconfig";
import { addDoc, collection} from "firebase/firestore";

const ViewItem3 = () => {
    
    const navigation = useNavigation();
    const auth = getAuth();
    const user = auth.currentUser;

    const handleBack = () => {
        navigation.navigate('Home');
    }
    const [isHeartFilled, setIsHeartFilled] = useState(false);
    const [timeDifference, setTimeDifference] = useState(null);

    // Calculate the time for 23 hours (in milliseconds)
    const twentyThreeHours = 24 * 60 * 60 * 1000;

    const handleHeartClick = async () => {

        if (isHeartFilled) {
            const lastLikeTimestamp = await AsyncStorage.getItem(user.uid + 'item3_last_like');
            if (lastLikeTimestamp !== null) {
              const lastLikeDate = new Date(parseInt(lastLikeTimestamp));
              const currentDate = new Date();
      
              // Calculate the time difference in milliseconds
              const difference = currentDate - lastLikeDate;
              
              setTimeDifference(difference);
      
              if (difference < twentyThreeHours) {
                const remainingTime = twentyThreeHours - difference;
                const remainingHours = Math.floor(remainingTime / (60 * 60 * 1000));
                ToastAndroid.show(`You already liked today. You can like again in ${remainingHours} hours.`, ToastAndroid.SHORT);
                return; // Prevent further execution
              }
            }
        } else {
            setIsHeartFilled(true);

            try {   
                await AsyncStorage.setItem(user.uid + 'item3', JSON.stringify(!isHeartFilled));
                    await AsyncStorage.setItem(user.uid + 'item3_last_like', String(new Date().getTime()));
                    // If not liked, add a new like document to Firestore
                    await addDoc(collection(FIREBASE_FIRESTORE, 'likes'), {
                        itemId: 'item3', // Replace with the actual item ID
                        userId: user.uid,
                    });
    
                    // Update the local state to reflect that the user has liked the item
    
                    // Increment the like count
                    //setLikeCount(likeCount + 1);
                    console.log('like added:', user.uid);
            } catch (error) {
                console.error("Error handling heart click:", error);
            }
        }
    }

    useEffect(() => {
        // You can add code here to fetch the initial like count from the database
        // and update the like count and heart icon accordingly.

        if (user){
            const fetchLikedStatus = async () => {
                try {
                    const likedStatus = await AsyncStorage.getItem(user.uid + 'item3');
                    if (likedStatus !== null) {
                        setIsHeartFilled(JSON.parse(likedStatus));
                    }
                } catch (error) {
                    // Handle error
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
            <Text style={{marginHorizontal: 5, fontWeight: 'bold', marginVertical: 10, fontSize: 15,}}>Most common reasons why account have been hacked: <Text onPress={() => { Linking.openURL('https://www.nbcnews.com/storyline/hacking-in-america/surprising-reason-why-you-keep-getting-hacked-n689081'); }} style={{fontWeight: '300', textDecorationLine: "underline"}}>Learn more</Text> </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginTop: 5}]}>
                <Text style={{textAlign: 'center'}}><Text style={{fontWeight: 'bold'}}>1. Weak Passwords:</Text> Using simple, easily guessable passwords, or reusing the same password across multiple accounts.</Text>
            </View>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginTop: 5}]}>
                <Text style={{textAlign: 'center'}}><Text style={{fontWeight: 'bold'}}>2. Phishing Attacks:</Text> Falling victim to phishing emails or websites that trick users into revealing their login credentials.</Text>
            </View>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginTop: 5}]}>
                <Text style={{textAlign: 'center'}}><Text style={{fontWeight: 'bold'}}>3. No Two-Factor Authentication (2FA):</Text> Not enabling 2FA, leaving accounts vulnerable to unauthorized access.</Text>
            </View>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginTop: 5}]}>
                <Text style={{textAlign: 'center'}}><Text style={{fontWeight: 'bold'}}>4. Outdated Software:</Text> Failing to update operating systems, applications, and plugins, which can contain security vulnerabilities.</Text>
            </View>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginTop: 5}]}>
                <Text style={{textAlign: 'center'}}><Text style={{fontWeight: 'bold'}}>5. Public Wi-Fi Risks:</Text> Using unsecured public Wi-Fi networks, making it easier for hackers to intercept data.</Text>
            </View>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginTop: 5}]}>
                <Text style={{textAlign: 'center'}}><Text style={{fontWeight: 'bold'}}>6. Malware Infections:</Text> Downloading malicious software unknowingly, which can steal login information.</Text>
            </View>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginTop: 5}]}>
                <Text style={{textAlign: 'center'}}><Text style={{fontWeight: 'bold'}}>7. Password Sharing:</Text> Sharing login credentials with others, even trusted individuals, can lead to breaches.</Text>
            </View>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginTop: 5}]}>
                <Text style={{textAlign: 'center'}}><Text style={{fontWeight: 'bold'}}>8. Lack of Security Awareness:</Text> Not being aware of common online threats and safe online practices.</Text>
            </View>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginTop: 5}]}>
                <Text style={{textAlign: 'center'}}><Text style={{fontWeight: 'bold'}}>9. Social Engineering:</Text> Falling for social engineering tactics where attackers manipulate users into revealing information.</Text>
            </View>
            <View style={[styles.boxContent, {borderLeftWidth: 5, borderRightWidth: 2, marginVertical: 5}]}>
                <Text style={{textAlign: 'center'}}><Text style={{fontWeight: 'bold'}}>10. Data Breaches:</Text> Account information being exposed in data breaches from other services, which is then used to target other accounts.</Text>
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



export default ViewItem3;