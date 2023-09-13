import React from "react";
import { View, Text, StyleSheet, Pressable } from 'react-native';

const CustomButton = ({ onPress, text, type =  "PRIMARY" }) => {
    return(
        <Pressable onPress={onPress} style={[styles.container, styles[`container_${type}`]]}>
            <Text style={[styles.text, styles[`text_${type}`]]}>{text}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        padding: 15,
        marginVertical: 5,
        marginTop: 20,
        marginBottom: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    container_PRIMARY: {
        backgroundColor: '#FAAC33'
    },
    container_SECONDARY: {
         
    },
    text: {
        color: 'white',
        fontFamily: 'Open-Sans',
    },
    text_SECONDARY: {
        color: 'black',
        fontFamily: 'Open-Sans'
    }

});

export default CustomButton;