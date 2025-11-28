import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import ColmeiaItem from './colmeiaItem';
import Icon from '../icon';
import cores from '@/constants/cores';
import LinhaDivisoria from '../linhaDivisoria';

interface Colmeia {
    id: number;
    nome: string;
    condicao: string;
    color: string;
}

interface ApiarioListProps {
    number: number;
    text: string;
    icon: string;
    colmeiasAtivas: number;
    colmeiasTotal: number;
    colmeias: Colmeia[];
}

const ApiarioList: React.FC<ApiarioListProps> = ({ number, text, icon, colmeiasAtivas, colmeiasTotal, colmeias }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.header} onPress={() => setIsExpanded(!isExpanded)}>
                <Text style={styles.number}>{number}</Text>
                <Text style={styles.text}>{text}</Text>
                <Icon name={icon} size={24} color="black" />
                <View style={styles.numberContainer} >
                    <Text style={styles.values}>{colmeiasAtivas}/{colmeiasTotal}</Text>
                </View>
                <Icon name={isExpanded ? 'chevronUp' : 'chevronDown'} size={24} color="black" />
            </TouchableOpacity>
            {isExpanded && (
                <View>
                    <LinhaDivisoria />                             
                <FlatList
                    data={colmeias}
                    keyExtractor={(item) => item.id.toString()}
                    style={{ backgroundColor: cores.cores.base[10] }}
                    renderItem={({ item }) => (

                        <View>
                            <ColmeiaItem id={item.id} nome={item.nome} condicao={item.condicao} cor={item.color} />
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