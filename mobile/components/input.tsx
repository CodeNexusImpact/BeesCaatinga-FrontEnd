import cores from '@/constants/cores';
import layout from '@/constants/layout';
import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import styles from '@/styles/input.styles';
import Icon from './icon';

interface InputProps extends TextInputProps {
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
    ...textInputProps
}) => {
    const [isSecret, setIsSecret] = React.useState(secureTextEntry);
    function viewPassword() {
        setIsSecret(!isSecret);
    }
    return (
        <View style={[styles.container, style]}>
            {iconName && <View style={{ marginRight: layout.espacamento.texto }}>
                <Icon name={iconName}></Icon>
            </View>}
            {label && <Text style={styles.label}>{label}:</Text>}
            <TextInput
                {...textInputProps}
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={cores.placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={isSecret}
            />
            {secureTextEntry && <TouchableOpacity onPress={viewPassword} style={{ position: 'absolute', right: layout.espacamento.amigavel }}>
                <View style={{ marginRight: layout.espacamento.texto }}>
                    <Icon name={isSecret? "olho": "olhoFechado"}></Icon>
                </View>
            </TouchableOpacity>}
        </View>
    );
};

export default Input;