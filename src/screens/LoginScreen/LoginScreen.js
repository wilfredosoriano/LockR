import React, { useEffect, useState} from "react";
import { View, Text, Image, StyleSheet, ToastAndroid, ActivityIndicator, TouchableOpacity, TextInput} from 'react-native';
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
    const { control, handleSubmit} = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false); // State for Remember Me checkbox
    const [email, setEmail] = useState(""); // State to store the email
    const [password, setPassword] = useState(""); 
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const toggleCheckbox = () => {
      setRememberMe((prev) => !prev);
    };

    /*const checkForExistingSession = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          // User data found, navigate to the home screen
          //ToastAndroid.show('User found', ToastAndroid.SHORT);
          navigation.navigate('Home');
        } else{
          ToastAndroid.show('User data not found. Please log in.', ToastAndroid.SHORT);
        }
      } catch (error) {
        console.log('Error checking existing session:', error);
      }
    };
  
    useEffect(() => {
      checkForExistingSession();
    }, []);*/

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
        setEmailError(""); // Clear the error message
      }
  
      if (!password) {
        setPasswordError("Password is required*");
        isValid = false;
      } else {
        setPasswordError(""); // Clear the error message
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
          //const { email, password } = data;
          const userCredential = await signInWithEmailAndPassword(auth, email, password);

          const user = userCredential.user;

          if (rememberMe) {
            await AsyncStorage.setItem("email", email);
            await AsyncStorage.setItem("password", password);
          } else {
            // If Remember Me is not checked, clear the stored credentials
            await AsyncStorage.removeItem("email");
            await AsyncStorage.removeItem("password");
          }

          // Save user data to AsyncStorage
          //await AsyncStorage.setItem('user', JSON.stringify(user));
          setIsLoading(false);
          navigation.navigate('Home');
          ToastAndroid.show('Login Successful', ToastAndroid.SHORT);

        } catch (error) {
          console.error('Login Error:', error.message);
          ToastAndroid.show('User not found. Please enter the correct email and password.', ToastAndroid.SHORT);
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

          {/*<CustomInput name="email" placeholder="Email" control={control} rules={{required: 'Email is required*'}} 
          style={styles.input} value={email}/>*/}

          {/*<CustomInput
          name="password" 
          placeholder="Password" 
          secureTextEntry 
          control={control} 
          rules={{required: 'Password is required*', 
          minLength: {
            value: 8, 
          message: 'Password should be at least 8 charaters long.'}}} style={styles.input} value={password} /> */}

            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
              <TouchableOpacity onPress={toggleCheckbox} style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center', marginLeft: 20}}>
              <Ionicons
                  name={rememberMe ? 'checkbox-outline' : 'square-outline'}
                  size={24}
                  color={rememberMe ? 'white' : 'white'}
                />
                <Text style={{color: 'white'}}> Remember Me</Text>
            </TouchableOpacity>
            
            <View style={{marginRight: 20}}>
                <Text style={styles.forgotText} onPress={ForgotButton}>Forgot Password?</Text>
            </View>
            </View>
          {isLoading ? (
            <ActivityIndicator size="small" color="white" style={{marginTop: 20}}/>
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
      backgroundColor: '#09055D',
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
        color: 'white'
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
        color: 'white'
    },
    loginContainer: {
      backgroundColor: '#695BEE',
      alignItems: 'center',
      borderRadius: 30,
      marginHorizontal: 20,
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
    },
    errorText: {
      alignSelf: 'stretch',
      color: 'orange',
      fontSize: 12,
      marginLeft: 20,
    },
  });


export default LoginScreen;