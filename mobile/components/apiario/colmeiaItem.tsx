import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '../icon';
import cores from '@/constants/cores';

interface Colmeia {
    id: number;
    nome: string;
    condicao: string;
    cor: string;
}

function opemColmeiaDetails(id: number) {
    // Lógica para abrir os detalhes da colmeia
    console.log("Abrir detalhes da colmeia com ID:", id);
}

const ColmeiaItem: React.FC<Colmeia> = ({ id, nome, condicao, cor }) => {
    return (
        <TouchableOpacity style={styles.subItem} onPress={() => opemColmeiaDetails(id)}>
            <Text style={styles.subItemText}>{nome}</Text>
            <Text style={styles.subItemDescription}>{condicao}</Text>
            <View style={[styles.circle, { backgroundColor: cor }]} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        overflow: 'hidden',
    },    
    numberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto',
        backgroundColor: cores.cores.base[10],
        borderRadius: 18,
    },
    values: {
        fontSize: 16,
        marginHorizontal: 5,
    },
    subItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: cores.cores.base[10],
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        justifyContent: 'space-between',
    },
    circle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 10,
    },
    subItemText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: 5,
    },
    subItemDescription: {
        fontSize: 12,
        color: '#666',
    },
    
});

export default ColmeiaItem;