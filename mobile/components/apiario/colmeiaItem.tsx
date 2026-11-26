import React from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { cores, temaCores } from '@/constants/cores';
import { ColmeiaRetornoEmApiarioDTO, StatusColmeia } from '@/types/apiario/colmeia';

const statusVisual = (status: StatusColmeia | string): { cor: string; texto: string } => {
    switch (status) {
        case 'SAUDAVEL':
            return { cor: temaCores.sucesso, texto: 'Saudável' };
        case 'TRATAMENTO_NECESSARIO':
            return { cor: temaCores.alerta, texto: 'Tratamento' };
        case 'MANUTENCAO_NECESSARIA':
            return { cor: temaCores.alerta, texto: 'Manutenção' };
        case 'PERIGO_CLIMATICO':
            return { cor: temaCores.perigo, texto: 'Perigo Climático' };
        case 'INATIVO':
            return { cor: cores.base[60], texto: 'Inativa' };
        default:
            return { cor: 'gray', texto: String(status ?? '') };
    }
};

const ColmeiaItem: React.FC<ColmeiaRetornoEmApiarioDTO & { apiarioId?: number }> = ({ id, identificador, statusColmeia, apiarioId }) => {
    const router = useRouter();
    const { cor, texto: statusTexto } = statusVisual(statusColmeia);

    function openColmeiaDetails() {
        router.push({
            pathname: '/apiario/colmeia/editar',
            params: apiarioId ? { id: String(id), apiarioId: String(apiarioId) } : { id: String(id) },
        });
    }

    return (
        <TouchableOpacity style={styles.subItem} onPress={() => openColmeiaDetails()}>
            <Text style={styles.subItemText}>{identificador}</Text>
            <Text style={styles.subItemDescription}>{statusTexto}</Text>
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
    subItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: cores.base[10],
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