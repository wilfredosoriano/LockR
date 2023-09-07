import React, {useState, useEffect} from "react";
import { View, Text, Image, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { sendEmailVerification } from "firebase/auth";
import { getDoc, doc, getFirestore } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const ConfirmEmailScreen = () => {

    const navigation = useNavigation();
    const { control, handleSubmit , formState: {errors}} = useForm();

    const firestore = getFirestore(); // Initialize Firestore

    useEffect(() => {
      // Retrieve the verification code from Firestore using the passed email
      const email = route.params.email; // Assuming you've passed the email in the route params
      const docRef = doc(firestore, 'verificationCodes', email);
      getDoc(docRef).then((doc) => {
        if (doc.exists()) {
          setVerificationCode(doc.data().code);
        } else {
          console.error("Verification code not found for the provided email");
        }
      }).catch((error) => {
        console.error("Error retrieving verification code:", error.message);
      });
    }, []);


    const ConfirmButton = async ({ code }) => {
      if (code === verificationCode) {
        try {
          // Mark the email as verified in Firestore or perform other relevant actions
          console.log("Email verified successfully");
          // Redirect the user to the login screen or the main app
          navigation.navigate('Login');
          naviga
        } catch (error) {
          setVerificationError('An error occurred while verifying the email');
          console.error("Verification Error:", error.message);
        }
      } else {
        setVerificationError('Invalid verification code');
      }
    };

    const ResendButton = async () => {

    };

    return (
        <View style={styles.container}>

        <Text style={styles.title}>Confirm Code</Text>

        <CustomInput name="code" placeholder="Code" control={control}/>

        <View style={styles.textContainer}>
            <Text style={styles.resendCodeText} onPress={ResendButton}>Resend Code</Text>
        </View>
        
        <CustomButton text="Confirm" onPress={handleSubmit(ConfirmButton)}/>

      </View> 
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent:'center'
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
    textContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        width: "100%",
        paddingLeft: 20,
        marginTop: 10,
    },
    resendCodeText: {
        marginTop: 10,
        textAlign: 'left',
    }
  });


export default ConfirmEmailScreen;