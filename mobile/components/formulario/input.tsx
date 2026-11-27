import cores from '@/constants/cores';
import layout from '@/constants/layout';
import React, { useImperativeHandle, useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import Icon from '../icon';
import { Typography } from '@/styles/fonts.styles';
import ImagemPicker from '@/components/formulario/imagemPicker'; // Import ImagemPicker

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
    /** Foto já salva, exibida no seletor de imagem. */
    imagemInicial?: string | null;
    /** Dica curta exibida abaixo do campo (ex.: "Ex.: 15/03/2026"). */
    dica?: string;
    /** Mensagem de erro exibida junto ao campo. */
    erro?: string | null;
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
    imagemInicial,
    dica,
    erro,
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

    const textoRotulo = label ? label.replace(/:\s*$/, "") : undefined;
    return (
        <View style={styles.campo}>
            {textoRotulo && <Text style={[styles.label, Typography.Negrito]}>{textoRotulo}</Text>}
            <View style={[styles.container, style, isMultiline && styles.multilineContainer, !!erro && styles.containerErro]}>
                {iconName && !useImagePicker && (
                    <View style={{ marginRight: layout.espacamento.texto }} accessibilityElementsHidden importantForAccessibility="no">
                        <Icon name={iconName} color={cores.secundaria}/>
                    </View>
                )}

                {useImagePicker ? (
                    <View style={styles.imagePickerWrapper}>
                        <ImagemPicker onImagePicked={onImagePicked || (() => {})} valorInicial={imagemInicial} />
                    </View>
                ) : (
                    <TextInput
                        accessibilityLabel={textoRotulo || placeholder}
                        accessibilityHint={dica}
                        {...textInputProps}
                        style={[styles.input, Typography.Texto, isMultiline && styles.multilineInput, textInputProps.editable === false && styles.somenteLeitura]}
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
                    <TouchableOpacity
                        onPress={viewPassword}
                        style={styles.iconRight}
                        accessibilityRole="button"
                        accessibilityLabel={isSecret ? 'Mostrar senha' : 'Esconder senha'}
                    >
                        <Icon name={isSecret ? "olho" : "olhoFechado"}></Icon>
                    </TouchableOpacity>
                )}

                {!useImagePicker && !secureTextEntry && iconRightName && (
                    <View style={styles.iconRight}>
                        <Icon name={iconRightName} size={20} color={cores.primaria}></Icon>
                    </View>
                )}
            </View>
            {!!erro && <Text style={styles.erro} accessibilityLiveRegion="polite">{erro}</Text>}
            {!erro && !!dica && <Text style={styles.dica}>{dica}</Text>}
        </View>
    );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
    campo: {
        width: '100%',
        gap: 4,
    },
    containerErro: {
        borderColor: cores.perigo,
        borderWidth: 2,
    },
    erro: {
        color: cores.perigo,
        fontSize: 15,
        fontWeight: '600',
    },
    dica: {
        color: cores.textoSecundario,
        fontSize: 14,
    },
    somenteLeitura: {
        color: cores.textoSecundario,
    },
    container: {
        width: '100%',
        minHeight: layout.toqueMinimo,
        paddingHorizontal: layout.espacamento.amigavel,
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: layout.borderRadius.r25,
        paddingVertical: layout.espacamento.texto,
        backgroundColor: cores.branco,
        borderColor: cores.borda,
    },
    multilineContainer: {
        flexDirection: 'column',
        width: '100%',
        minHeight: 100, 
        alignItems: 'flex-start',
        paddingVertical: layout.espacamento.amigavel, 
    },
    label: {
        fontSize: 16,
        color: cores.texto,
    },
    input: {
        height: 'auto',
        borderColor: '#ccc',
        flexShrink: 1,
        flexGrow: 1,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 17,
        color: cores.texto,
        minHeight: 40,
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