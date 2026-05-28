import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import ColmeiaItem from './colmeiaItem';
import Icon from '../icon';
import cores from '@/constants/cores';
import LinhaDivisoria from '../linhaDivisoria';

import { ApiarioRetornoDTO } from '@/types/apiario';


const ApiarioList: React.FC<{ apiario: ApiarioRetornoDTO }> = ({ apiario }) => {
    const { id, nome, colmeias } = apiario;
    const [isExpanded, setIsExpanded] = useState(false);

    const colmeiasTotal = colmeias.length;
    const colmeiasAtivas = colmeias.filter(c => c.statusColmeia !== 'INATIVO').length;

    function openApiarioDetails() {
        console.log('Apiário Selecionado', `Você selecionou o apiário: ${id}`);
    }


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.header} onPress={openApiarioDetails}>
                    <Text style={styles.number}>{id}</Text>
                    <Text style={styles.text}>{nome}</Text>
                </TouchableOpacity>
                {/* <Icon name={icon} size={24} color="black" /> */}
                <TouchableOpacity style={styles.header} onPress={() => setIsExpanded(!isExpanded)}>
                    <View style={styles.numberContainer} >
                        <Text style={styles.values}>{colmeiasAtivas}/{colmeiasTotal}</Text>
                    </View>

                    <Icon name={isExpanded ? 'chevronUp' : 'chevronDown'} size={24} color="black" />
                </TouchableOpacity>
            </View>
            {isExpanded && (
                <View>
                    <LinhaDivisoria />
                    <FlatList
                        data={colmeias}
                        keyExtractor={(item, index) => item?.id ? String(item.id) : String(index)}
                        style={{ backgroundColor: cores.cores.base[10] }}
                        renderItem={({ item }) => (
                            <ColmeiaItem id={item.id} identificador={item.identificador} statusColmeia={item.statusColmeia} />
                        )}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        overflow: 'hidden',
        color: '#888',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: cores.cores.base[0],
        justifyContent: 'space-between',
    },
    number: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
    },
    text: {
        fontSize: 16,
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
});

export default ApiarioList;