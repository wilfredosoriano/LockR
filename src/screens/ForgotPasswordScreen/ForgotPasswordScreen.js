import React, {useState} from "react";
import { View, Text, Image, StyleSheet } from 'react-native';
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { useForm } from 'react-hook-form';

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/

const ForgotPasswordScreen = () => {

    const navigation = useNavigation();
    const { control, handleSubmit , formState: {errors}} = useForm();

    const ConfirmButton = () => {
        console.warn("Sent successfully");
    }

    const BackButton = () => {
        navigation.navigate('Login');
      }

    return (
        <View style={styles.container}>
        <Image
          source={require('../../images/security.jpg')}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>Forgot Password</Text>

        <CustomInput name="email" placeholder="Email" control={control} rules={{required: 'Email is required*', pattern: {value: EMAIL_REGEX, message: 'Please enter a valid email address.'}}}/>
        
        <CustomButton text="Confirm" onPress={handleSubmit(ConfirmButton)}/>

        <CustomButton text="Back to login" onPress={BackButton} type="SECONDARY"/>

      </View> 
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      
    },
    image: {
        marginBottom: 20,
      width: 200, 
      height: 200,
    },
    title: {
        fontSize: 30,
        marginBottom: 20,
    },
  });


export default ForgotPasswordScreen;