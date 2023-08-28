import React, {useState} from "react";
import { View, Text, Image, StyleSheet } from 'react-native';
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { useForm } from 'react-hook-form';
//import { FIREBASE_AUTH } from "../../../Firebaseconfig";
import { getAuth } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = () => {

    const navigation = useNavigation();
    const { control, handleSubmit, formState: {errors} } = useForm();

    const LoginButton = async (data) => {
        try {
          const auth = getAuth();
          const { email, password } = data;
          await signInWithEmailAndPassword(auth, email, password);

          navigation.navigate('Home');

        } catch (error) {
          console.error('Login Error:', error.message);
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
        <Image
          source={require('../../images/security.jpg')}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>Login Account</Text>

        <CustomInput name="email" placeholder="Email" control={control} rules={{required: 'Email is required*'}} />

        <CustomInput 
        name="password" 
        placeholder="Password" 
        secureTextEntry 
        control={control} 
        rules={{required: 'Password is required*', 
        minLength: {
          value: 8, 
          message: 'Password should be at least 8 charaters long.'}}}/>
        
        <View style={styles.textContainer}>
            <Text style={styles.forgotText} onPress={ForgotButton}>Forgot Password?</Text>
        </View>
        
        <CustomButton text="Login" onPress={handleSubmit(LoginButton)}/>

        <CustomButton text="Dont have an account? Register" onPress={DontHaveButton} type="SECONDARY"/>
      </View> 
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#09055D'
    },
    image: {
        marginBottom: 20,
      width: 200, 
      height: 200,
      borderRadius: 50,
    },
    title: {
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
    }
  });


export default LoginScreen;