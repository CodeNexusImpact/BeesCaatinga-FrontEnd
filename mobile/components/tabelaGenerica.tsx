import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import Icon from './icon'; 

export interface TabelaColuna<T extends object> {
    label: string;
    dataKey: keyof T;
    sortable?: boolean;
    render?: (item: T) => React.ReactNode;
    flex?: number;
}

type DirecaoSorteio = 'asc' | 'desc';

// Define as props que o componente TabelaGenerica aceita
interface TabelaGenericaProps<T extends object> {
    colunas: TabelaColuna<T>[];
    data: T[];
}

export default function TabelaGenerica<T extends object>({
    colunas,
    data,
}: TabelaGenericaProps<T>) {

    // --- Lógica de Ordenação ---
    const [sortConfig, setSortConfig] = useState<{
        key: keyof T;
        direction: DirecaoSorteio;
    } | null>(null);

    // Hook para memorizar os dados ordenados
    const sortedData = useMemo(() => {
        let sortableItems = [...data];
        if (sortConfig !== null) {
            const { key, direction } = sortConfig;
            sortableItems.sort((a, b) => {
                // Lógica de ordenação simples (funciona para strings e números)
                if (a[key] === null || a[key] === undefined) return 1;
                if (b[key] === null || b[key] === undefined) return -1;

                if (a[key] < b[key]) {
                    return direction === 'asc' ? -1 : 1;
                }
                if (a[key] > b[key]) {
                    return direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [data, sortConfig]);

    // Função chamada ao clicar no cabeçalho
    const requestSort = (key: keyof T, sortable?: boolean) => {
        if (!sortable) return; 
        let direction: DirecaoSorteio = 'asc';
        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === 'asc'
        ) {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Helper para pegar o ícone de ordenação correto
    const getSortIcon = (key: keyof T, sortable?: boolean) => {
        if (!sortable) return null; // Sem ícone
        if (!sortConfig || sortConfig.key !== key) {
            return 'swap-vertical'; // Ícone neutro
        }
        return sortConfig.direction === 'asc' ? 'arrow-up' : 'arrow-down';
    };

    // --- Renderização ---
    return (
        <View style={styles.container}>
            {/* Cabeçalho (renderizado a partir das 'colunas') */}
            <View style={[styles.linha, styles.cabecalho]}>
                {colunas.map((coluna) => (
                    <TouchableOpacity
                        key={String(coluna.dataKey)}
                        style={[styles.celulaCabecalho, { flex: coluna.flex ?? 1 }]}
                        onPress={() => requestSort(coluna.dataKey, coluna.sortable)}
                        disabled={!coluna.sortable}
                    >
                        <Text style={styles.textoCabecalho}>{coluna.label}</Text>
                        {getSortIcon(coluna.dataKey, coluna.sortable) && (
                            <Icon
                                name={getSortIcon(coluna.dataKey, coluna.sortable)!}
                                size={16}
                                color={cores.preto}
                            />
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            {/* Linhas de Dados (renderizadas a partir dos 'dados') */}
            {sortedData.map((item, rowIndex) => (
                <View key={rowIndex} style={[styles.linha, styles.linhaDados]}>
                    {colunas.map((coluna) => {
                        // Decide o que renderizar:
                        const content = coluna.render
                            ? coluna.render(item) 
                            : (item[coluna.dataKey] as React.ReactNode); // 2: O dado bruto

                        return (
                            <View
                                key={String(coluna.dataKey)}
                                style={[styles.celulaDadoView, { flex: coluna.flex ?? 1 }]}
                            >
                                {/* Se for texto/número, envolve em <Text>, senão, renderiza direto */}
                                {typeof content === 'string' || typeof content === 'number' ? (
                                    <Text style={styles.celulaDadoTexto}>{content}</Text>
                                ) : (
                                    content
                                )}
                            </View>
                        );
                    })}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: cores.branco,
        borderRadius: layout.borderRadius.r25,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: cores.primaria[100],
    },
    linha: {
        flexDirection: 'row',
        width: '100%',
    },
    cabecalho: {
        backgroundColor: cores.primaria[80],
        borderBottomWidth: 2,
        borderBottomColor: cores.primaria[100],
    },
    celulaCabecalho: {
        padding: layout.espacamento.texto,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: cores.primaria[100],
    },
    textoCabecalho: {
        fontWeight: 'bold',
        color: cores.preto,
        fontSize: 14,
        flexShrink: 1,
    },
    linhaDados: {
        backgroundColor: cores.primaria[40],
        borderBottomWidth: 1,
        borderBottomColor: cores.primaria[60],
    },
    celulaDadoView: {
        padding: layout.espacamento.texto,
        borderRightWidth: 1,
        borderRightColor: cores.primaria[60],
        justifyContent: 'center', 
    },
    celulaDadoTexto: {
        color: cores.texto,
        fontSize: 14,
    },
});