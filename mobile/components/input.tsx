import cores from '@/constants/cores';
import layout from '@/constants/layout';
import React, { useImperativeHandle, useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import Icon from './icon';
import { Typography } from '@/styles/fonts.styles';

interface InputProps extends TextInputProps {
    label?: string;
    placeholder: string;
    secureTextEntry?: boolean;
    style?: object;
    iconName?: string; 
    iconRightName?: string;
    value: string; 
    onChangeText: (text: string) => void;
    multiline?: boolean;
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
    multiline = false,
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
        <View style={[styles.container, style, multiline && styles.multilineContainer]}>
            {iconName && <View style={{ marginRight: layout.espacamento.texto }}>
                <Icon name={iconName}/>
            </View>}
            {label && <Text style={[styles.label, Typography.Negrito]}>{label}:</Text>}
            <TextInput
                {...textInputProps}
                style={[styles.input, Typography.Texto, multiline && styles.multilineInput]}
                placeholder={placeholder}
                placeholderTextColor={cores.placeholder}   
                value={value} 
                onChangeText={onChangeText}             
                secureTextEntry={isSecret}
                textAlignVertical={multiline ? 'top' : 'center'}
                multiline={multiline}
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
        height: 'auto',
        paddingHorizontal: layout.espacamento.amigavel,
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: layout.borderRadius.r25,
        paddingVertical: layout.espacamento.texto,
        backgroundColor: cores.cores.base[5], 
        borderColor: cores.borda,
        // --- NOVO ESTILO: SHADOW ---
        ...Platform.select({
            ios: {
                shadowColor: cores.secundaria, 
                shadowOffset: { width: 1, height: 2 }, 
                shadowRadius: 2, 
                shadowOpacity: 0.4, 
            },
            android: {
                elevation: 2,                 
            },
            web: {
                boxShadow: `2px 2px 4px ${cores.secundaria}80`, 
            },
        }), 
    },
    multilineContainer: {
        // Estilo para o container de inputs multiline (altura maior)
        flexDirection: 'column',
        width: '100%',
        minHeight: 100, // Altura mínima para o campo de complemento
        alignItems: 'flex-start', // Alinha o conteúdo (label, textinput) no topo
        paddingVertical: layout.espacamento.amigavel, // Aumenta o padding para o texto não colar
    },
    label: {        
        marginRight: layout.espacamento.texto,
        minWidth: 96,
    },
    input: {
        height: 'auto',
        borderColor: '#ccc',
        flexShrink: 1,
        flexGrow: 1,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    multilineInput: {
        minHeight: 80, // Altura mínima para o TextInput em multiline
        height: 'auto', // Permite que a altura se ajuste com o conteúdo se necessário
        paddingVertical: layout.espacamento.texto, // Adiciona padding no topo/base do texto multiline
    },
    iconRight: {
        position: 'absolute',
        right: layout.espacamento.amigavel,
    },
    
});

export default Input;