import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import cores from '@/constants/cores';
import layout from '@/constants/layout';

interface CardNotificacaoProps {
    titulo: string;
    mensagem: string;
    data?: string;
    naoLida?: boolean;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
}

export default function CardNotificacao({
    titulo,
    mensagem,
    data,
    naoLida = true,
    onPress,
    style
}: CardNotificacaoProps) {
    return (
        <TouchableOpacity 
            style={[styles.cardContainer, style]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {naoLida && (
                <View style={styles.sideBorder} />
            )}

            {/* Conteúdo do card */}
            <View style={[
                styles.contentCard,
                !naoLida && styles.contentCardNoBar
            ]}>
                <Text style={styles.titulo} numberOfLines={1}>{titulo}</Text>
                <Text style={styles.mensagem} numberOfLines={2}>{mensagem}</Text>
                {data && <Text style={styles.data}>{data}</Text>}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        width: '100%',
        minHeight: 80,
        backgroundColor: cores.branco, 
        borderRadius: layout.borderRadius.r25, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        overflow: 'hidden', 
    },
    sideBorder: {
        width: 6, 
        height: '100%',
        backgroundColor: cores.primaria, 
    },
    contentCard: {
        flex: 1,
        paddingHorizontal: layout.espacamento.amigavel,
        paddingVertical: layout.espacamento.texto,
        justifyContent: 'center',
    },
    contentCardNoBar: {
        paddingLeft: layout.espacamento.amigavel, 
    },
    titulo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: cores.texto,
        textAlign: 'left',
        marginBottom: 4,
    },
    mensagem: {
        fontSize: 14,
        fontWeight: '400',
        color: cores.texto,
        textAlign: 'left',
        lineHeight: 18,
    },
    data: {
        fontSize: 12,
        fontWeight: '300',
        color: '#666',
        textAlign: 'left',
        marginTop: 4,
    },
});