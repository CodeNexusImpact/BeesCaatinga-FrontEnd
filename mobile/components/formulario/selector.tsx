import cores from '@/constants/cores';
import layout from '@/constants/layout';
import React, { useState } from 'react';
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
    const [isOpen, setIsOpen] = useState(false);

    // Controlado quando `value` é passado; caso contrário mantém o rótulo internamente.
    const [labelInterno, setLabelInterno] = useState<string | null>(null);
    const selectedLabel = value !== undefined
        ? (options.find(opt => opt.value === value)?.label ?? null)
        : labelInterno;

   
    const handleSelect = (selectedValue: string) => {
        const selectedOption = options.find(opt => opt.value === selectedValue);

        if (selectedOption) {
            setLabelInterno(selectedOption.label);
            onSelect(selectedOption.value);       
        }
        setIsOpen(false);
    };

    const textoRotulo = label ? label.replace(/:\s*$/, "") : undefined;
    return (
        <View style={[styles.campo, { zIndex: isOpen ? 1000 : 1 }]}>
            {textoRotulo && <Text style={[styles.label, Typography.Negrito]}>{textoRotulo}</Text>}
            <View style={[styles.container, style]}>
                {iconName && (
                    <View style={{ marginRight: layout.espacamento.texto }}>
                        <Icon name={iconName} color={cores.secundaria}/>
                    </View>
                )}
                <View style={styles.inputWrapper}>
                    <TouchableOpacity
                        style={styles.touchable}
                        onPress={() => setIsOpen(!isOpen)}
                        accessibilityRole="button"
                        accessibilityLabel={`${textoRotulo ?? placeholder}: ${selectedLabel ?? 'nada selecionado'}`}
                        accessibilityState={{ expanded: isOpen }}
                    >
                        <Text style={[styles.inputText, Typography.Texto, { color: selectedLabel ? cores.texto : cores.placeholder }]}>
                            {selectedLabel ? selectedLabel : placeholder}
                        </Text>
                        <Icon name={isOpen ? "setaCima" : "setaBaixo"} size={22} />
                    </TouchableOpacity>
                </View>

                {isOpen && (
                    <View style={styles.dropdown}>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.option, item.label === selectedLabel && styles.optionAtiva]}
                                    onPress={() => handleSelect(item.value)}
                                    accessibilityRole="menuitem"
                                    accessibilityLabel={item.label}
                                >
                                    <Text style={styles.optionText}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={<Text style={[styles.optionText, { padding: 12, color: cores.textoSecundario }]}>Nenhuma opção disponível</Text>}
                            style={{ maxHeight: 264 }}
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    campo: {
        width: '100%',
        gap: 4,
        position: 'relative',
    },
    container: {
        width: '100%',
        minHeight: layout.toqueMinimo,
        paddingHorizontal: layout.espacamento.amigavel,
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: layout.borderRadius.r25,
        paddingVertical: layout.espacamento.texto,
        backgroundColor: cores.branco,
        borderColor: cores.borda,
        position: 'relative',
    },
    label: {
        fontSize: 16,
        color: cores.texto,
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
        minHeight: 44,
        paddingHorizontal: 10,
    },
    inputText: {
        fontSize: 17,
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
    optionAtiva: {
        backgroundColor: cores.cores.primaria[10],
    },
    option: {
        minHeight: 48,
        justifyContent: 'center',
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    optionText: {
        fontSize: 17,
        color: cores.texto,
    },
});

export default Selector;