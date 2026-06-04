import cores from '@/constants/cores';
import layout from '@/constants/layout';
import React, { useImperativeHandle, useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import Icon from '../icon';
import { Typography } from '@/styles/fonts.styles';
import ImagemPicker from '../imagemPicker'; // Import ImagemPicker

interface InputProps extends TextInputProps {
    label?: string;
    placeholder?: string; // Made optional
    secureTextEntry?: boolean;
    style?: object;
    iconName?: string; 
    iconRightName?: string;
    value?: string; // Made optional
    onChangeText?: (text: string) => void; // Made optional
    multiline?: boolean;
    useImagePicker?: boolean; // New prop to enable image picker mode
    onImagePicked?: (uri: string | null) => void; // Callback for the picked image
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
    useImagePicker = false, // Default to false
    onImagePicked,
    ...textInputProps
}, ref) => {
    
    const [isSecret, setIsSecret] = useState(secureTextEntry);
    
    // Force multiline when useImagePicker is true
    const isMultiline = multiline || useImagePicker;

    function viewPassword() {
        setIsSecret(!isSecret);
    }

    useImperativeHandle(ref, () => ({
        // getValue is not relevant for image picker mode, but we keep it for consistency
        getValue: () => value || '', 
    }));

    return (
        <View style={[styles.container, style, isMultiline && styles.multilineContainer]}>
            {iconName && !useImagePicker && (
                <View style={{ marginRight: layout.espacamento.texto }}>
                    <Icon name={iconName}/>
                </View>
            )}
            {label && <Text style={[styles.label, Typography.Negrito]}>{label}:</Text>}

            {useImagePicker ? (
                <View style={styles.imagePickerWrapper}>
                    <ImagemPicker 
                        onImagePicked={onImagePicked || (() => {})}                         
                    />
                </View>
            ) : (
                <TextInput
                    {...textInputProps}
                    style={[styles.input, Typography.Texto, isMultiline && styles.multilineInput]}
                    placeholder={placeholder}
                    placeholderTextColor={cores.placeholder}   
                    value={value} 
                    onChangeText={onChangeText}             
                    secureTextEntry={isSecret}
                    textAlignVertical={isMultiline ? 'top' : 'center'}
                    multiline={isMultiline}
                />
            )}
            
            {!useImagePicker && secureTextEntry && (
                <TouchableOpacity onPress={viewPassword} style={styles.iconRight}>
                    <Icon name={isSecret ? "olho" : "olhoFechado"}></Icon>
                </TouchableOpacity>
            )}

            {!useImagePicker && !secureTextEntry && iconRightName && (
                <View style={styles.iconRight}>
                    <Icon name={iconRightName} size={20} color={cores.primaria}></Icon>
                </View>
            )}
        </View>
    );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        flexDirection: 'column',
        width: '100%',
        minHeight: 100, 
        alignItems: 'flex-start',
        paddingVertical: layout.espacamento.amigavel, 
    },
    label: {        
        marginRight: layout.espacamento.texto,
        minWidth: 96,
        marginBottom: layout.espacamento.texto, // Add some margin below the label in all cases
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
        minHeight: 80, 
        height: 'auto',
        alignSelf: 'stretch', // Make sure it stretches
        paddingVertical: layout.espacamento.texto,
    },
    iconRight: {
        position: 'absolute',
        right: layout.espacamento.amigavel,
        // Adjust vertical alignment for non-multiline inputs
        top: '50%',
        transform: [{ translateY: -12 }], // Center the icon
    },
    imagePickerWrapper: {
        width: '100%',
        alignItems: 'center', // Center the image picker
        justifyContent: 'center',
        paddingVertical: layout.espacamento.amigavel,
    },
});

export default Input;