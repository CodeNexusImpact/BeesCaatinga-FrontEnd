import React from 'react';
import { TextInput, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from './icon';
import cores from '@/constants/cores';
import layout from '@/constants/layout';

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

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: layout.espacamento.amigavel,
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: layout.borderRadius.r25,
        paddingVertical: layout.espacamento.texto,
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        flexShrink: 1,
        flexGrow: 1,
        paddingHorizontal: 10,
        fontSize: 16,
    },
});

export default Input;