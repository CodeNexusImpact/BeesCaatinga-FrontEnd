import cores from '@/constants/cores';
import layout from '@/constants/layout';
import React, { useState, useEffect } from 'react'; 
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import Icon from '@/components/icon';
import { Typography } from '@/styles/fonts.styles';

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
    label,
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
            setSelectedLabel(selectedOption.label); 
            onSelect(selectedOption.value);       
        }
        setIsOpen(false);
    };

    return (
        <View style={[styles.container, { zIndex: isOpen ? 1000 : 1 }, style]}>
            {iconName && (
                <View style={{ marginRight: layout.espacamento.texto }}>
                    <Icon name={iconName}/>
                </View>
            )}
            
            {label && <Text style={[styles.label, Typography.Negrito]}>{label}:</Text>}

            <View style={styles.inputWrapper}>
                <TouchableOpacity 
                    style={styles.touchable} 
                    onPress={() => setIsOpen(!isOpen)}
                >
                    <Text style={[styles.inputText, Typography.Texto, { color: selectedLabel ? cores.texto : cores.placeholder }]}>
                        {selectedLabel ? selectedLabel : placeholder}
                    </Text>
                    <Icon name={isOpen ? "setaCima" : "setaBaixo"} size={20} />
                </TouchableOpacity>
            </View>

            {isOpen && (
                <View style={styles.dropdown}>
                    <FlatList
                        data={options}
                        keyExtractor={(item) => item.value}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.option} onPress={() => handleSelect(item.value)}>
                                <Text style={styles.optionText}>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                        style={{ maxHeight: 200 }}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 'auto',
        paddingHorizontal: layout.espacamento.amigavel,
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: layout.borderRadius.r25,
        paddingVertical: layout.espacamento.texto,
        backgroundColor: cores.cores.base[5], 
        borderColor: cores.borda,
        position: 'relative',
        ...Platform.select({
            ios: {
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', 
            },
            android: {
                elevation: 2,                 
            },
            web: {
                boxShadow: `2px 2px 4px ${cores.secundaria}80`, 
            },
        }), 
    },
    label: {        
        marginRight: layout.espacamento.texto,
        minWidth: 96,
        marginBottom: layout.espacamento.texto,
    },
    inputWrapper: {
        flex: 1,
        justifyContent: 'center',
    },
    touchable: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
    },
    inputText: {
        fontSize: 16,
        flex: 1,
    },
    dropdown: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        marginTop: 5,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: layout.borderRadius.r25,
        backgroundColor: cores.branco,
        zIndex: 9999,
        ...Platform.select({
            ios: {
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
            },
            android: {
                elevation: 5,
            },
            web: {
                boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
            },
        }),
    },
    option: {
        padding: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    optionText: {
        fontSize: 16,
        color: cores.texto,
    },
});

export default Selector;