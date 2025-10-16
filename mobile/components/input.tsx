import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import Icon from './icon';

interface InputProps {
    label?: string;
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    secureTextEntry?: boolean;
    style?: object;
    iconName?: string; // Nome do ícone a ser exibido
}

const Input: React.FC<InputProps> = ({
    label,
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    style,
    iconName,
}) => {
    return (        
        <View style={[styles.container, style]}>
            {iconName && <Icon name={iconName}></Icon>}
            {label && <Text style={styles.label}>{label}:</Text>}
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={'#999'}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 10,
        flexDirection: 'row',
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
    },
});

export default Input;