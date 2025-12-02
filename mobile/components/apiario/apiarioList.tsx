import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import ColmeiaItem from './colmeiaItem';
import Icon from '../icon';
import cores from '@/constants/cores';
import LinhaDivisoria from '../linhaDivisoria';

import { ApiarioListProps } from '@/types/Apiarios';


const ApiarioList: React.FC<ApiarioListProps> = ({ id, nome, colmeiasAtivas, colmeiasTotal, colmeias }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.header} onPress={() => (Alert.alert('Apiário Selecionado', `Você selecionou o apiário: ${nome}`))}>
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
                        keyExtractor={(item) => item.id.toString()}
                        style={{ backgroundColor: cores.cores.base[10] }}
                        renderItem={({ item }) => (

                            <View>
                                <ColmeiaItem id={item.id} nome={item.nome} condicao={item.condicao} />
                            </View>
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