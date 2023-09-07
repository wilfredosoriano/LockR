import React, {useState} from "react";
import { View, Text, Image, StyleSheet } from 'react-native';
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { useForm } from 'react-hook-form';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/

const ForgotPasswordScreen = () => {

    const navigation = useNavigation();
    const { control, handleSubmit , formState: {errors}} = useForm();
    const auth = getAuth();

    const [email, setEmail] = useState("");
    const [resetStatus, setResetStatus] = useState(null);

    const ConfirmButton = async (data) => {
      const { email } = data;
      try {
        await sendPasswordResetEmail(auth, email);
        setResetStatus("Password reset email sent successfully. Please check your email.");
      } catch (error) {
        console.log("Error sending password reset email:", error);
        setResetStatus("Please enter the correct email and try again.");
      }
    }

    const BackButton = () => {
        navigation.navigate('Login');
      }

    return (
        <View style={styles.container}>

        <View style={styles.registerContainer}>
        <Text style={styles.title}>Forgot Password</Text>
        <View style={{marginVertical: 10, flexDirection: 'row', marginHorizontal: 50}}>
        {resetStatus && <Ionicons name="alert-circle" color="orange" size={25}/> && <Text style={{color: 'white', textAlign: 'center'}}>{resetStatus}</Text>}
        </View>

        <CustomInput name="email" placeholder="Email" value={email} control={control} rules={{required: 'Email is required*', pattern: {value: EMAIL_REGEX, message: 'Please enter a valid email address.'}}}/>
        
        <CustomButton text="Confirm" onPress={handleSubmit(ConfirmButton)}/>

        <CustomButton text="Back to login" onPress={BackButton} type="SECONDARY"/>
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
    },
    title: {
      marginTop: 20,
      color: 'white',
        fontSize: 30,
        marginBottom: 20,
    },
    registerContainer: {
      backgroundColor: '#695BEE',
      alignItems: 'center',
      borderRadius: 30,
      marginHorizontal: 20,
    },
  });


export default ForgotPasswordScreen;