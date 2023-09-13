import React, {useState} from "react";
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { useForm } from 'react-hook-form';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/

const ForgotPasswordScreen = () => {

    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);

    const { control, handleSubmit , formState: {errors}} = useForm();
    const auth = getAuth();

    const [email, setEmail] = useState("");
    const [resetStatus, setResetStatus] = useState(null);

    const ConfirmButton = async (data) => {
      setIsLoading(true);
      const { email } = data;
      try {
        await sendPasswordResetEmail(auth, email);

        setResetStatus("Password reset email sent successfully. Please check your email.");
      } catch (error) {
        console.log("Error sending password reset email:", error);
        setResetStatus("⚠ Please enter the correct email and try again.");
      } finally {
        setIsLoading(false);
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
        {resetStatus && <Text style={{color: 'red', textAlign: 'center'}}>{resetStatus}</Text>}
        </View>

        <CustomInput name="email" placeholder="Email" value={email} control={control} rules={{required: 'Email is required*', pattern: {value: EMAIL_REGEX, message: 'Please enter a valid email address.'}}}/>
        
        {isLoading ? (
          <ActivityIndicator size="small" color="#FAAC33" style={{marginTop: 20}}/>
          ) : (
        <> 
        <CustomButton text="Confirm" onPress={handleSubmit(ConfirmButton)}/>
        </>
        )}

        <CustomButton text="Back to login" onPress={BackButton} type="SECONDARY"/>
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
    },
    title: {
      marginTop: 20,
      color: '#FAAC33',
        fontSize: 30,
        marginBottom: 20,
        fontFamily: 'Open-Sans-Bold'
        
    },
    registerContainer: {
      backgroundColor: 'white',
      elevation: 2,
      alignItems: 'center',
      borderRadius: 30,
      marginHorizontal: 20,
    },
  });


export default ForgotPasswordScreen;