import React, { useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from 'expo-clipboard';
import { showMessage } from "react-native-flash-message";

const GeneratePassword = () => {
    
    const navigation = useNavigation();

    const [generatedPassword, setGeneratedPassword] = useState('');

    const handleGeneratePassword = () => {
        const newPassword = generateRandomPassword(12); 
        setGeneratedPassword(newPassword);
      };

    const handleBack = () => {
        navigation.navigate('Home');
    }

    const generateRandomPassword = (length) => {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_+=';
        let password = '';
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * charset.length);
          password += charset.charAt(randomIndex);
        }
        return password;
      };

      const handleCopyPassword = async () => {
        await Clipboard.setStringAsync(generatedPassword);
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
      

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={handleBack}>
                        <Ionicons name="arrow-back-circle-outline" size={30}/>
                    </TouchableOpacity>
                    <Text style={styles.passwordDetail}>Generate Password</Text>
                </View>
            </View>

            <View style={styles.mainContent}>
            <View style={styles.boxContent}>
            <TextInput
                value={generatedPassword}
                onChangeText={(text) => setGeneratedPassword(text)}
                placeholder="Generated Password"
                style={{ fontSize: 24, fontFamily: 'Open-Sans', flex: 1 }}
            />  
            <TouchableOpacity onPress={handleCopyPassword}>
                <Ionicons name="copy-outline" size={30}/>
            </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleGeneratePassword} style={{alignItems: 'center', backgroundColor: '#FAAC33', marginHorizontal: 20, paddingVertical: 15, borderRadius: 30, flexDirection: 'row', justifyContent: 'center'}}>
                <Ionicons name="key-outline" color="white" size={20}/>
                <Text style={{color: 'white', fontFamily: 'Open-Sans'}}> GENERATE</Text>
            </TouchableOpacity>
            <View style={{marginHorizontal: 20, marginTop: 20,}}>
                <Text style={{fontFamily: 'Open-Sans-Bold', fontSize: 18}}>About this feature</Text>
            </View>
            <View style={[styles.boxContent, {backgroundColor: '#CEEEB4', marginTop: 10}]}>
                <Text style={{textAlign: 'center', fontFamily: 'Open-Sans'}}><Ionicons name="alert-outline" color="orange" size={15}/>This feature helps you generate a unique password that is hard to guess by anyone. It ensures that your passwords are difficult to predict. 
                    You can generate a password and click <Ionicons name="copy-outline" size={16}/> to use it for your accounts. Don't worry because once you've generated it, 
                    you can save it in the app for safekeeping and easy access.</Text>
                
            </View>
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
        marginTop:  5,
        elevation: 5,
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
        justifyContent: 'space-between',
        backgroundColor: '#F9F7F6',
        padding: 20,
        margin: 20,
        borderRadius: 10,
        elevation: 2,
    },
});



export default GeneratePassword;