import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '../icon';
import {cores, temaCores} from '@/constants/cores';
import { ColmeiaItemProps } from '@/types/Colmeias';


function opemColmeiaDetails(id: number) {
    // Lógica para abrir os detalhes da colmeia
    console.log("Abrir detalhes da colmeia com ID:", id);
}

const ColmeiaItem: React.FC<ColmeiaItemProps> = ({ id, nome, condicao}) => {
    const [cor, setCorStatus] = useState(temaCores.sucesso);
    useEffect(() => {
        switch (condicao) {
            case 'Saudavel':
                // Estado positivo: Verde
                setCorStatus(temaCores.sucesso); 
                break;
            
            case 'Pronto para Coleta':
                // Estado de Ação/Sucesso: Pode ser um verde diferente ou um amarelo/laranja de notificação
                setCorStatus(temaCores.sucesso); 
                break;
            
            case 'Manutenção Necessária':
                // Estado de Alerta/Aviso: Amarelo
                setCorStatus(temaCores.alerta); 
                break;

            case 'Tratamento Necessário':
                // Estado de Urgência Média/Atenção: Laranja
                setCorStatus(temaCores.alerta);
                break;
                
            case 'Perigo Climático':
                // Estado Crítico/Perigo: Vermelho
                setCorStatus(temaCores.perigo); 
                break;
                
            case 'Inativa':
                // Estado Neutro/Desativado: Cinza (como você já especificou)
                setCorStatus(cores.base[60]); 
                break;

            default:
                // Caso o valor seja indefinido ou inesperado
                setCorStatus('gray'); 
        }
    }, [condicao]);
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
        backgroundColor: cores.base[10],
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