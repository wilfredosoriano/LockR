import React, { useState } from "react";
import { View, Text, Image, StyleSheet, ToastAndroid, ActivityIndicator} from 'react-native';
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { useForm } from 'react-hook-form';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { FIREBASE_FIRESTORE } from "../../../Firebaseconfig";
import { doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from '../../../Firebaseconfig'

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/

const RegisterScreen = () => {

    const auth = getAuth(app);

    const navigation = useNavigation();
    const { control, handleSubmit , formState: {errors}} = useForm();
    const [isLoading, setIsLoading] = useState(false);

    const RegisterButton = async (data) => {
      setIsLoading(true);
      try {
        const { email, password, firstname, lastname } = data;
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        const userDocRef = doc(FIREBASE_FIRESTORE, 'users', userCredential.user.uid);
        await setDoc(userDocRef, {
          email: userCredential.user.email,
          firstname,
          lastname,
        });
        setIsLoading(false);
        ToastAndroid.show('Registration Successful', ToastAndroid.SHORT);
        navigation.navigate('Login');
      } catch (error) {
        console.error('Registration Error:', error.message);
      }
    }
    const AlreadyHaveButton = () => {
        navigation.navigate('Login');
    }

    return (
        <View style={styles.container}>
        <View style={styles.registerContainer}>
        <Text style={styles.title}>Create an Account</Text>

        <CustomInput name="firstname" placeholder="Firstname" control={control} rules={{required: 'Firstname is required*'}}/>
        <CustomInput name="lastname" placeholder="Lastname" control={control} rules={{required: 'Lastname is required*'}}/>

        <CustomInput name="email" placeholder="Email" control={control} rules={{required: 'Email is required*', pattern: {value: EMAIL_REGEX, message: 'Please enter a valid email address.'}}}/>
        <CustomInput name="password" placeholder="Password" control={control} rules={{required: 'Password is required*', 
        minLength: {
          value: 8, 
          message: 'Password should be at least 8 charaters long.'}}} secureTextEntry/>
        <CustomInput name="confirm_password" placeholder="ConfirmPassword" control={control} rules={{required: 'Confirm password is required*', 
        minLength: {
          value: 8, 
          message: 'Password should be at least 8 charaters long.'}}} secureTextEntry/>

        {isLoading ? (
          <ActivityIndicator size="small" color="white" style={{marginTop: 20}}/>
          ) : (
        <> 
        <CustomButton text="Register" onPress={handleSubmit(RegisterButton)}/>
        </>
        )}

        <CustomButton text="Already have an account? Login" onPress={AlreadyHaveButton} type="SECONDARY"/>
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
    registerContainer: {
      backgroundColor: '#695BEE',
      alignItems: 'center',
      borderRadius: 30,
      marginHorizontal: 20,
    },
  });

export default RegisterScreen;

