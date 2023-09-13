import React, { useEffect, useState} from "react";
import { View, Text, StyleSheet, ToastAndroid, ActivityIndicator, TouchableOpacity, TextInput} from 'react-native';
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useForm } from 'react-hook-form';
import app from "../../../Firebaseconfig";
import { getAuth } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const LoginScreen = () => {

    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState(""); 
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const toggleCheckbox = () => {
      setRememberMe((prev) => !prev);
    };

    useEffect(() => {
      const loadStoredCredentials = async () => {

        try {
          const storedEmail = await AsyncStorage.getItem("email");
          const storedPassword = await AsyncStorage.getItem("password");

          if (storedEmail && storedPassword) {
            setEmail(storedEmail);
            setPassword(storedPassword);
            setRememberMe(true);
          }
        } catch (error) {
          console.log("Error loading stored credentials:", error);
        }
      };
  
      loadStoredCredentials();
    }, []);

    const validateForm = () => {
      let isValid = true;

      if (!email) {
        setEmailError("Email is required*");
        isValid = false;
      } else {
        setEmailError("");
      }
  
      if (!password) {
        setPasswordError("Password is required*");
        isValid = false;
      } else {
        setPasswordError("");
      }
  
      return isValid;
    };

    const LoginButton = async () => {

      if (!validateForm()) {
        return;
      }
        setIsLoading(true);
        try {

          const auth = getAuth(app);
          const userCredential = await signInWithEmailAndPassword(auth, email, password);

          const user = userCredential.user;

          if (rememberMe) {
            await AsyncStorage.setItem("email", email);
            await AsyncStorage.setItem("password", password);
          } else {
            
            await AsyncStorage.removeItem("email");
            await AsyncStorage.removeItem("password");
          }

          navigation.navigate('Home');
          ToastAndroid.show('Login Successful', ToastAndroid.SHORT);

        } catch (error) {
          console.error('Login Error:', error.message);
          ToastAndroid.show('User not found. Please enter the correct email and password.', ToastAndroid.SHORT);
        } finally {
          setIsLoading(false);
        }
    }
    const ForgotButton = () => {
        navigation.navigate('ForgotPassword')
    }
    const DontHaveButton = () => {
        navigation.navigate('Register');
    }

    return (
        <View style={styles.container}>
          <View style={styles.loginContainer}>
          <Text style={styles.title}>Login Account</Text>

        <TextInput
        placeholder="Email"
        style={[
          styles.input,
          { borderColor: emailError ? 'red' : '#19162fff' }, 
        ]}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setEmailError(""); 
        }}
      />
      {emailError ? (
        <Text style={styles.errorText}>{emailError}</Text>
      ) : null} 

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={[
          styles.input,
          { borderColor: passwordError ? 'red' : '#19162fff' }, 
        ]}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setPasswordError(""); 
        }}
      />
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}

            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
              <TouchableOpacity onPress={toggleCheckbox} style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center', marginLeft: 20}}>
              <Ionicons
                  name={rememberMe ? 'checkbox-outline' : 'square-outline'}
                  size={24}
                  color={rememberMe ? 'black' : 'black'}
                />
                <Text style={[styles.text, {color: 'black', }]}> Remember Me</Text>
            </TouchableOpacity>
            
            <View style={{marginRight: 20}}>
                <Text style={styles.forgotText} onPress={ForgotButton}>Forgot Password?</Text>
            </View>
            </View>
          {isLoading ? (
            <ActivityIndicator size="small" color="#FAAC33" style={{marginTop: 20}}/>
            ) : (
          <> 
          <CustomButton text="Login" onPress={LoginButton}/>
          </>
          )}
          <CustomButton text="Dont have an account? Register" onPress={DontHaveButton} type="SECONDARY"/>
        </View>

      </View> 
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      justifyContent: 'center'
    },
    image: {
      marginBottom: 20,
      width: 200, 
      height: 200,
      borderRadius: 50,
    },
    title: {
      marginTop: 20,
        fontSize: 30,
        marginBottom: 20,
        color: '#FAAC33',
        fontFamily: 'Open-Sans-Bold',
    },
    textContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        width: "100%",
        paddingRight: 20,
        marginTop: 10,
    },
    forgotText: {
        marginTop: 10,
        textAlign: 'right',
        color: 'black',
        fontFamily: 'Open-Sans',
    },
    loginContainer: {
      backgroundColor: 'white',
      alignItems: 'center',
      borderRadius: 30,
      marginHorizontal: 20,
      elevation: 2,
    },
    input: {
        width: '90%',
        borderRadius: 10,
        paddingHorizontal: 10,
        padding: 5,
        marginVertical: 5,
        borderColor: '#19162fff',
        backgroundColor: 'white',
        borderWidth: 1,
        fontFamily: 'Open-Sans',
    },
    errorText: {
      alignSelf: 'stretch',
      color: 'orange',
      fontSize: 12,
      marginLeft: 20,
      fontFamily: 'Open-Sans'
    },
    text: {
      fontFamily: 'Open-Sans',
    },
    textBold: {
      fontFamily: 'Open-Sans-Bold',
    }
  });


export default LoginScreen;