import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import DeveloperProfile from "./DeveloperProfile";

const AboutDeveloper = () => {

    const navigation = useNavigation();
    const handleBack = () => {
        navigation.navigate('Home');
    }
    const openLink = async (url) => {
        try {
          const supported = await Linking.canOpenURL(url);
      
          if (supported) {
            await Linking.openURL(url);
          } else {
            console.error(`Cannot open URL: ${url}`);
          }
        } catch (error) {
          console.error('An error occurred while opening the URL:', error);
        }
      };          

      const sendEmail = () => {
        const email = 'wilfredosoriano.bsit.ucu@gmail.com'; // Replace with your email address
        const subject = 'Feedback'; // Replace with your desired email subject
        const body = 'Hello, I wanted to provide feedback on your app...'; // Replace with your desired email body
        const mailtoURL = `mailto:${email}?subject=${subject}&body=${body}`;

        Linking.openURL(mailtoURL)
            .catch((err) => console.error('An error occurred: ', err));
    };
      

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={handleBack}>
                        <Ionicons name="arrow-back-circle-outline" size={30}/>
                    </TouchableOpacity>
                    <Text style={styles.passwordDetail}>About Developer/App</Text>
                </View>
            </View>
            <View style={styles.mainContent}>
            <View style={{alignItems: 'center', marginTop: 20}}>
                <DeveloperProfile/>
            </View>
                <View style={styles.content}>
                    <Text style={{textAlign: 'justify'}}>
                        Hello, I'm<Text style={{fontWeight: 'bold'}}> Wilfredo Soriano Jr</Text>, an aspiring React Native developer. 
                        This is my first app developed using the React Native framework. 
                        It's a password manager that helps you securely store your passwords. 
                        You can save different accounts from your favorite social media platforms, making it easy to access and view your password details. 
                        It also features biometric authentication to enhance the security of your password details. 
                        Your password is encrypted, and only you can see it.
                    </Text>
                    <Text style={{textAlign: 'justify'}}>
                        I'm developing apps that aim to simplify tasks for people. 
                        I hope you can support me by providing feedback about your experience with this app. 
                        Please feel free to send me a message by clicking this "link." Whether your feedback is positive or negative, 
                        I welcome it so that I can improve my skills.
                    </Text>
                </View>
                    <View style={styles.socialContainer}>
                        <Text style={{fontWeight: 'bold', fontSize: 16, marginBottom: 20,}}>Follow and message me here: </Text>
                        <TouchableOpacity onPress={() => openLink('https://www.facebook.com/soriano.wilfredojr')} style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Ionicons name="logo-facebook" size={30}/>
                        <Text> facebook</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openLink('https://www.instagram.com/wilfredosorianojr')} style={{flexDirection: 'row', alignItems: 'center', marginTop: 5,}}>
                        <Ionicons name="logo-instagram" size={30}/>
                        <Text> instagram</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openLink('https://www.youtube.com/c/wilfredojr.7626')} style={{flexDirection: 'row', alignItems: 'center' , marginTop: 5, }}>
                        <Ionicons name="logo-youtube" size={30}/>
                        <Text> youtube</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={sendEmail} style={{flexDirection: 'row', alignItems: 'center' , marginTop: 5,}}>
                        <Ionicons name="mail" size={30}/>
                        <Text> wilfredosoriano.bsit.ucu@gmail.com</Text>
                        </TouchableOpacity>
                    </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#09055D',
    },
    header: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        padding: 10,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        justifyContent: 'space-between'
    },
    headerLeft: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    passwordDetail: {
        fontSize: 20,
        marginHorizontal: 10,
        fontWeight: 'bold'
    },
    image: {
    width: 50,
    height: 50,
    marginTop: 20,
    borderRadius: 50,
    },
    mainContent: {
        backgroundColor: 'white',
        flex: 1,
        marginTop: 10,
        marginBottom: 20,
        marginHorizontal: 20,
        borderRadius: 20,
    },
    content: {
        backgroundColor: 'white',
        marginHorizontal: 10,
        marginVertical: 20,
        padding: 20,
    },
    socialContainer: {
        backgroundColor: 'white',
        marginHorizontal: 10,
        marginVertical: 20,
        padding: 20,
    }
});

export default AboutDeveloper;