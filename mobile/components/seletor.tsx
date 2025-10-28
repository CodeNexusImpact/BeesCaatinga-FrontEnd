import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import styles from '@/styles/input.styles';
import cores from '@/constants/cores';
import Icon from './icon';

interface Option {
    label: string;
    value: string;
}

interface SelectorProps {
    label?: string;
    options: Option[];
    onSelect: (value: string) => void;
    placeholder?: string;
    iconName?: string;
}

const Selector: React.FC<SelectorProps> = ({
    options,
    onSelect,
    placeholder = "Selecione uma opção",
    iconName,
}) => {
    const [selected, setSelected] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (value: string) => {
        setSelected(value.replace(/^\w/, (c) => c.toUpperCase()));
        onSelect(value);
        setIsOpen(false);
    };

    return (        
        <View style={[styles.container, { zIndex: isOpen ? 10 : 1 }]}> 
            {iconName && <View style={styles.icon}>
                <Icon name={iconName}></Icon>
            </View>}
            
            <View style={styles.input}>
                <TouchableOpacity style={{height:'100%', justifyContent:'center'}} onPress={() => setIsOpen(!isOpen)}>
                    <Text style={[styles.label,{color: selected? cores.texto : cores.placeholder}]}>{selected ? selected : placeholder}</Text>
                </TouchableOpacity>
            </View>
            
            {isOpen && (
                
                <View style={stylesSelector.dropdown}>
                    <FlatList
                        data={options}
                        keyExtractor={(item) => item.value}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={stylesSelector.option} onPress={() => handleSelect(item.label)}>
                                <Text style={stylesSelector.optionText}>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </View>
    );
};

const stylesSelector = StyleSheet.create({
    container: {
        width: '100%',
        position: 'relative',
        zIndex: 10,
    },
    selector: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 16,
        color: '#333',
    },
    dropdown: {
        marginTop: 0,
        position: 'absolute', 
        top: '100%',         
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        maxHeight: 150,
    },
    option: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
});

export default Selector;