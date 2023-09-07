import React, {useState} from "react";
import { View, Text, Image, StyleSheet } from 'react-native';
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { useForm } from 'react-hook-form';

const NewPasswordScreen = () => {

    const [Code, setCode] = useState('');
    const [NewPassword, setNewPassword] = useState('');
    const [ConfirmNewPassword, setConfirmNewPassword] = useState('');
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

        <Text style={styles.title}>New Password</Text>

        <CustomInput name="code" placeholder="Code" control={control} rules={{required: 'Code is required*'}}/>
        <CustomInput name="new_password" placeholder="New Password" control={control} rules={{required: 'Password is required*', 
        minLength: {
          value: 8, 
          message: 'Password should be at least 8 charaters long.'}}} secureTextEntry/>
        <CustomInput name="confirm_password" placeholder="Confirm Password" control={control} rules={{required: 'Password is required*', 
        minLength: {
          value: 8, 
          message: 'Password should be at least 8 charaters long.'}}} secureTextEntry/>

        <CustomButton text="Confirm" onPress={handleSubmit(ConfirmButton)}/>

        <CustomButton text="Back to login" onPress={BackButton} type="SECONDARY"/>

      </View> 
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
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


export default NewPasswordScreen;