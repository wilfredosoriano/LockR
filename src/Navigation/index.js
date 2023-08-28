import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import RegisterScreen from "../screens/RegisterScreen/RegisterScreen";
import LoginScreen from "../screens/LoginScreen/LoginScreen";
import ConfirmEmailScreen from "../screens/ConfirmEmailScreen/ConfirmEmailScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen/ForgotPasswordScreen";
import NewPasswordScreen from "../screens/NewPasswordScreen/NewPasswordScreen";
import HomeScreen from "../screens/HomeScreen";
import ViewAccountScreen from "../screens/ViewAccountScreen/ViewAccountScreen";
import FlashMessage from "react-native-flash-message";
import AddAccountScreen from "../screens/AddAccountScreen/AddAccountScreen";
const Stack = createStackNavigator(); 

const Navigation = () => {
    return (
        <NavigationContainer independent={true} theme={{ colors: { background: 'white' } }}>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Login" component={LoginScreen}/>
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
                <Stack.Screen name="Home" component={HomeScreen}/>
                <Stack.Screen name="ViewAccount" component={ViewAccountScreen} />
                <Stack.Screen name="AddAccount" component={AddAccountScreen} />
            </Stack.Navigator>
            <FlashMessage position="bottom"/>
        </NavigationContainer>
    );
};


export default Navigation;
