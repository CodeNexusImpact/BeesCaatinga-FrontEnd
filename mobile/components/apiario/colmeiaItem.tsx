import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { cores, temaCores } from '@/constants/cores';
import { ColmeiaRetornoEmApiarioDTO, StatusColmeia } from '@/types/apiario/colmeia';

const ColmeiaItem: React.FC<ColmeiaRetornoEmApiarioDTO> = ({ id, identificador, statusColmeia }) => {
    const [cor, setCorStatus] = useState(temaCores.sucesso);
    const [statusTexto, setStatusTexto] = useState('');
    

    useEffect(() => {
        // Mapeamento visual para o Enum
        switch (statusColmeia) {
            case 'SAUDAVEL':
                setCorStatus(temaCores.sucesso);
                setStatusTexto('Saudável');
                break;

            case 'TRATAMENTO_NECESSARIO': // Antigo "Tratamento Necessário"
                setCorStatus(temaCores.alerta);
                setStatusTexto('Tratamento');
                break;

            case 'MANUTENCAO_NECESSARIA':
                setCorStatus(temaCores.alerta);
                setStatusTexto('Manutenção');
                break;

            case 'PERIGO_CLIMATICO':
                setCorStatus(temaCores.perigo);
                setStatusTexto('Perigo Climático');
                break;

            case 'INATIVO':
                setCorStatus(cores.base[60]);
                setStatusTexto('Inativa');
                break;

            default:
                setCorStatus('gray');
                setStatusTexto(statusColmeia);
        }
    }, [statusColmeia]);

    function openColmeiaDetails() {
        console.log("Abrir detalhes da colmeia:", id);
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