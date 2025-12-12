import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import Selector from '@/components/selector';
import Botao from '@/components/botao';
import TabelaGenerica, { TabelaColuna } from '@/components/tabelaGenerica';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { Stack } from 'expo-router';

// --- Interfaces e Dados ---
interface DadosProducao {
    id: string;        
    loteId: string;
    ano: string;      
    dataExtracao: string;
    pesoLitro: string;
    qualidade: string; // Nova coluna
    status: string;
}

// --- DADOS DINÂMICOS (Base local) ---
const MASTER_TABLE_DATA: DadosProducao[] = [
    { id: '1', loteId: 'LT-25-01', ano: '2025', dataExtracao: '15/01/2025', pesoLitro: '22,0 Kg', qualidade: 'Premium', status: 'Aprovado' },
    { id: '2', loteId: 'LT-25-02', ano: '2025', dataExtracao: '20/02/2025', pesoLitro: '18,5 Kg', qualidade: 'Standard', status: 'Em Análise' },
    { id: '3', loteId: 'LT-25-03', ano: '2025', dataExtracao: '10/03/2025', pesoLitro: '25,0 Kg', qualidade: 'Premium', status: 'Aprovado' },
    { id: '4', loteId: 'LT-24-01', ano: '2024', dataExtracao: '05/11/2024', pesoLitro: '15,0 Kg', qualidade: 'Baixa', status: 'Reprovado' },
    { id: '5', loteId: 'LT-24-02', ano: '2024', dataExtracao: '12/12/2024', pesoLitro: '12,8 Kg', qualidade: 'Standard', status: 'Aprovado' },
    { id: '6', loteId: 'LT-24-03', ano: '2024', dataExtracao: '20/12/2024', pesoLitro: '30,0 Kg', qualidade: 'Premium', status: 'Aprovado' },
];

const colunasDoRelatorio: TabelaColuna<DadosProducao>[] = [
    { label: 'Lote', dataKey: 'loteId', sortable: true, flex: 2 },
    { label: 'Data', dataKey: 'dataExtracao', sortable: true, flex: 3 },
    { label: 'Peso', dataKey: 'pesoLitro', sortable: true, flex: 2 },
    { label: 'Qualidade', dataKey: 'qualidade', sortable: true, flex: 2 }, // Coluna extra pra testar o scroll
    { label: 'Status', dataKey: 'status', sortable: true, flex: 2 },
];

// --- Opções de Filtro ---
const anoOptions = [
    { label: 'Todos os Anos', value: '' }, 
    { label: '2025', value: '2025' }, 
    { label: '2024', value: '2024' },
];

export default function RelatorioProducaoTabela() {
    const [ano, setAno] = useState('');

    const handleExportar = () => {
        alert(`Exportando ${dadosFiltrados.length} registros...`);
    };

    // --- LÓGICA: Filtra os dados quando o state 'ano' muda ---
    const dadosFiltrados = useMemo(() => {
        return MASTER_TABLE_DATA.filter(item => {
            return ano === '' ? true : item.ano === ano;
        });
    }, [ano]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Stack.Screen options={{ title: 'Tabela' }} />

            <Subtexto style={styles.subtexto}>Relatório Detalhado</Subtexto>

            {/* Filtros */}
            <View style={styles.filtroContainer}>
                <Selector 
                    label="Filtrar por Ano" 
                    options={anoOptions} 
                    onSelect={setAno} 
                    placeholder="Todos os Anos" 
                />
            </View>

            <Text style={{textAlign:'center', fontSize: 12, color: '#888', marginBottom: 5}}>
                {dadosFiltrados.length} registros encontrados
            </Text>

            {/* --- TABELA COM SCROLL HORIZONTAL --- */}
            <View style={styles.tabelaContainer}>
                <ScrollView 
                    horizontal={true} 
                    showsHorizontalScrollIndicator={false} // Esconde a barra cinza
                    contentContainerStyle={styles.scrollContentTabela}
                >
                    {/* minWidth: Força a View interna a ser larga. 
                        Se a tela for menor que 900px, o scroll ativa. */}
                    <View style={{ minWidth: 900 }}>
                        <TabelaGenerica
                            colunas={colunasDoRelatorio}
                            data={dadosFiltrados}
                        />
                    </View>
                </ScrollView>
            </View>
            <Text style={styles.dicaScroll}>Deslize para o lado para ver mais detalhes</Text>

            <Botao
                title="Exportar Relatório"
                cor="primaria"
                onPress={handleExportar}
                style={styles.botaoExportar}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.fundo },
    contentContainer: { padding: layout.espacamento.amigavel, gap: layout.espacamento.colega, overflow: 'visible' },
    subtexto: { width: '100%', textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: cores.texto, marginBottom: layout.espacamento.texto },
    
    filtroContainer: { zIndex: 10, marginBottom: layout.espacamento.texto },
    
    tabelaContainer: { 
        marginTop: layout.espacamento.texto,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        overflow: 'hidden' // Garante que bordas arredondadas funcionem
    },
    
    scrollContentTabela: {
        paddingRight: 20 // Espaço para não cortar o último item
    },

    dicaScroll: {
        textAlign: 'center',
        fontSize: 10,
        color: '#999',
        fontStyle: 'italic',
        marginTop: 4
    },

    botaoExportar: { marginTop: layout.espacamento.amigavel },
});