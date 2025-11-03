import cores from '@/constants/cores';
import layout from '@/constants/layout';
import React, { useImperativeHandle, useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import Icon from './icon';

interface InputProps extends TextInputProps {
    label?: string;
    placeholder: string;
    secureTextEntry?: boolean;
    style?: object;
    iconName?: string; 
    iconRightName?: string;
    value: string; 
    onChangeText: (text: string) => void;
}

export interface InputRef {
    getValue: () => string;
}

const Input = React.forwardRef<InputRef, InputProps>(({
    label,
    placeholder,
    secureTextEntry,
    style,
    iconName,
    iconRightName,
    value,
    onChangeText,
    ...textInputProps
}, ref) => {
    
    const [isSecret, setIsSecret] = useState(secureTextEntry);

    function viewPassword() {
        setIsSecret(!isSecret);
    }

    useImperativeHandle(ref, () => ({
        // Usamos textInputProps.value, que é o valor passado pelo pai
        getValue: () => value, 
    }));

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
            {secureTextEntry && (
                <TouchableOpacity onPress={viewPassword} style={styles.iconRight}>
                    <Icon name={isSecret ? "olho" : "olhoFechado"}></Icon>
                </TouchableOpacity>
            )}

            {/* Se não for senha E tiver um iconRightName, mostra ele */}
            {!secureTextEntry && iconRightName && (
                <View style={styles.iconRight}>
                    <Icon name={iconRightName} size={20} color={cores.primaria}></Icon>
                </View>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: layout.espacamento.amigavel,
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: layout.borderRadius.r25,
        paddingVertical: layout.espacamento.texto,
        backgroundColor: cores.branco, 
        borderColor: cores.borda,
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginRight: layout.espacamento.texto
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        flexShrink: 1,
        flexGrow: 1,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    iconRight: {
        position: 'absolute',
        right: layout.espacamento.amigavel,
    }
});

export default Input;