import React from "react";
import { Controller } from "react-hook-form";
import { View, Text, StyleSheet} from 'react-native';
import { TextInput } from "react-native-gesture-handler";

const CustomInput = ({control, name, rules = {}, placeholder, secureTextEntry}) => {
    return (
        
            <Controller control={control}
            name={name}
            rules={rules}
            render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (

                <>
                    <View style={[styles.container, {borderColor: error ? 'red' : '#19162fff' }]}>
                    <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    style={styles.input}
                    secureTextEntry={secureTextEntry}
                    />
                    </View>
                    {error && (
                        <Text style={{color: 'orange', alignSelf: 'stretch', fontSize: 10, marginLeft: 20, marginBottom: 10}}>{error.message || 'Error'}</Text>
                    )}
                </>
            )}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        borderRadius: 10,
        paddingHorizontal: 10,
        padding: 5,
        marginVertical: 5,
        borderColor: '#19162fff',
        backgroundColor: 'white'
    },
    input:{},
});

export default CustomInput;