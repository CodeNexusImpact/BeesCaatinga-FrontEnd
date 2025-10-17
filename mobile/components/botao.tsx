import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import Icon from './icon';
import cores from '@/constants/cores';

interface BotaoProps {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
    style?: object;
    textStyle?: object;
    cor?: "primary" | "secondary";
}

const Botao: React.FC<BotaoProps> = ({ title, onPress, style, textStyle, cor = "primary"}) => {
    const corHex = cor === "primary" ? cores.primaria : cor === "secondary" ? cores.secundaria : '#fff';
    return (
        <TouchableOpacity style={[styles.button, style,{backgroundColor: corHex}]} onPress={onPress}>
            <Text style={[styles.text, textStyle]}>{title}</Text>
            <Icon name="forward" size={20} color="#FFF" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        display: 'flex',
        backgroundColor: '#007BFF',
        width: '100%',
        flexDirection: 'row',
        padding: 10,
        borderRadius: 5,
        alignItems: 'baseline',
        justifyContent: 'center',
    },
    text: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Botao;