import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import Icon from './icon';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import fonts from '@/constants/fonts';

interface BotaoProps {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
    iconName?: string;
    iconPosition?: 'left' | 'right';
    style?: object;
    textStyle?: object;
    cor?: "primaria" | "secundaria" | "branca";
}

const Botao: React.FC<BotaoProps> = ({ title, onPress, style, textStyle, cor = "primaria", iconName, iconPosition = 'left' },) => {
    const corHex = cor === "primaria" ? cores.primaria 
        : cor === "secundaria" ? cores.secundaria 
        : cores.botaoBranco;
    const textColor = cor === "secundaria" ? '#FFF' : "#000";
    return (
        <TouchableOpacity style={[styles.button, style, { backgroundColor: corHex, flexDirection: iconPosition === "right" ? "row-reverse" : 'row' }]} onPress={onPress}>

            <Text style={[styles.text, textStyle, { color: textColor }]}>{title}</Text>

            {iconName && <Icon name={iconName} size= {35} color={textColor} />}
            
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        display: 'flex',
        width: '100%',
        padding: 10,
        borderRadius: layout.borderRadius.r25,
        alignItems: "center",
        justifyContent: 'center',
        borderColor: cores.borda,
        borderWidth: 1,
    },
    text: {
        fontSize: fonts.size.g,
        fontWeight: 'bold',
    },
});

export default Botao;