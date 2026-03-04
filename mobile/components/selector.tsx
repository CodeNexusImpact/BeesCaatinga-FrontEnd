import cores from '@/constants/cores';
import styles from '@/styles/input.styles';
import React, { useState, useEffect } from 'react'; 
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
    style?: any;
    value?: string; 
}

const Selector: React.FC<SelectorProps> = ({
    options,
    onSelect,
    placeholder = "Selecione uma opção",
    iconName,
    style,
    value, 
}) => {
    const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (value) {
            const selectedOption = options.find(opt => opt.value === value);
            setSelectedLabel(selectedOption ? selectedOption.label : null);
        } else {
            setSelectedLabel(null);
        }
    }, [value, options]); 

   
    const handleSelect = (selectedValue: string) => {
        const selectedOption = options.find(opt => opt.value === selectedValue);

        if (selectedOption) {
            setSelectedLabel(selectedOption.label); // Define o rótulo interno
            onSelect(selectedOption.value);       // Envia o valor para o pai (ex: 'jandaira')
        }
        setIsOpen(false);
    };

    return (
        <View style={[styles.container, { zIndex: isOpen ? 1000 : 1 }, style]}>
            {iconName && <View style={styles.icon}>
                <Icon name={iconName}></Icon>
            </View>}

            <View style={styles.input}>
                <TouchableOpacity style={{ height: '100%', justifyContent: 'center' }} onPress={() => setIsOpen(!isOpen)}>
                    {/* ✅ 6. Usar o 'selectedLabel' para exibição */}
                    <Text style={[styles.label, { color: selectedLabel ? cores.texto : cores.placeholder }]}>
                        {selectedLabel ? selectedLabel : placeholder}
                    </Text>
                </TouchableOpacity>
            </View>

            {isOpen && (
                <View style={stylesSelector.dropdown}>
                    <FlatList
                        data={options}
                        keyExtractor={(item) => item.value}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={stylesSelector.option} onPress={() => handleSelect(item.value)}>
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
        zIndex: 9999,
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