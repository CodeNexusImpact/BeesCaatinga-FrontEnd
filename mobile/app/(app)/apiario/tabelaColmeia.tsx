import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Stack } from 'expo-router';

// Componentes e Constantes Padronizados
import Selector from '@/components/selector';
import Botao from '@/components/botao';
import TabelaGenerica, { TabelaColuna } from '@/components/tabelaGenerica';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import layout from '@/constants/layout';

// --- Interface Atualizada ---
interface DadosColmeia {
    id: string;
    identificador: string;
    apiario: string;
    tipo: string;
    status: 'Ativo' | 'Inativo';
    dataCriacao: string; // Ex: "15/01/2025"
    ano: string;         // Campo auxiliar para o filtro
}

// --- Dados de Exemplo (Mock) com Datas ---
const MOCK_COLMEIAS: DadosColmeia[] = [
    { id: '1', identificador: 'COL-01', apiario: 'Rosa do Sertão', tipo: 'Madeira', status: 'Ativo', dataCriacao: '10/01/2025', ano: '2025' },
    { id: '2', identificador: 'COL-02', apiario: 'Rosa do Sertão', tipo: 'Concreto', status: 'Ativo', dataCriacao: '15/02/2025', ano: '2025' },
    { id: '3', identificador: 'COL-03', apiario: 'Vale das Abelhas', tipo: 'Poliestireno', status: 'Inativo', dataCriacao: '20/11/2024', ano: '2024' },
    { id: '4', identificador: 'COL-04', apiario: 'Vale das Abelhas', tipo: 'Madeira', status: 'Ativo', dataCriacao: '05/12/2024', ano: '2024' },
    { id: '5', identificador: 'COL-05', apiario: 'Bees Caatinga', tipo: 'Concreto', status: 'Ativo', dataCriacao: '12/08/2023', ano: '2023' },
];

// --- Configuração das Colunas (Data Adicionada) ---
const colunasColmeia: TabelaColuna<DadosColmeia>[] = [
    { label: 'Identificador', dataKey: 'identificador', sortable: true, flex: 2 },
    { label: 'Criação', dataKey: 'dataCriacao', sortable: true, flex: 2.5 }, // Nova Coluna
    { label: 'Apiário', dataKey: 'apiario', sortable: true, flex: 3 },
    { label: 'Tipo', dataKey: 'tipo', sortable: true, flex: 2 },
    { label: 'Status', dataKey: 'status', sortable: true, flex: 2 },
];

// --- Opções de Filtro por Ano ---
const anoOptions = [
    { label: 'Todos os Anos', value: '' },
    { label: '2025', value: '2025' },
    { label: '2024', value: '2024' },
    { label: '2023', value: '2023' },
];

export default function TabelaColmeias() {
    const [filtroAno, setFiltroAno] = useState('');

    // --- LÓGICA: Filtra as colmeias pelo ano selecionado ---
    const dadosFiltrados = useMemo(() => {
        return MOCK_COLMEIAS.filter(item => {
            return filtroAno === '' ? true : item.ano === filtroAno;
        });
    }, [filtroAno]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Stack.Screen options={{ title: 'Relatório de Colmeias' }} />

            <Subtexto style={styles.subtexto}>Relatório Detalhado</Subtexto>

            {/* Filtro por Ano */}
            <View style={styles.filtroContainer}>
                <Selector 
                    label="Filtrar por Ano" 
                    options={anoOptions} 
                    onSelect={setFiltroAno} 
                    placeholder="Selecione o ano" 
                    iconName="calendar" // Ícone de calendário condizente com data
                />
            </View>

            <Text style={styles.contagemTexto}>
                {dadosFiltrados.length} colmeias encontradas no período
            </Text>

            {/* --- TABELA COM SCROLL HORIZONTAL --- */}
            <View style={styles.tabelaContainer}>
                <ScrollView 
                    horizontal={true} 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContentTabela}
                >
                    {/* minWidth aumentado para comportar a nova coluna de data sem espremer */}
                    <View style={{ minWidth: 750 }}>
                        <TabelaGenerica
                            colunas={colunasColmeia}
                            data={dadosFiltrados}
                        />
                    </View>
                </ScrollView>
            </View>
            
            <Text style={styles.dicaScroll}>Deslize lateralmente para ver todos os dados</Text>

            <Botao
                title="Exportar Relatório"
                cor="primaria"
                onPress={() => alert('Exportando dados para CSV...')}
                style={styles.botaoAcao}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: cores.fundo 
    },
    contentContainer: { 
        padding: layout.espacamento.amigavel, 
        gap: layout.espacamento.colega 
    },
    subtexto: { 
        width: '100%', 
        textAlign: 'center', 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: cores.texto, 
        marginBottom: layout.espacamento.texto 
    },
    filtroContainer: { 
        zIndex: 10, 
        marginBottom: layout.espacamento.texto 
    },
    contagemTexto: {
        textAlign: 'center', 
        fontSize: 12, 
        color: '#888', 
        marginBottom: 5
    },
    tabelaContainer: { 
        marginTop: layout.espacamento.texto,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        overflow: 'hidden'
    },
    scrollContentTabela: {
        paddingRight: 10
    },
    dicaScroll: {
        textAlign: 'center',
        fontSize: 10,
        color: '#999',
        fontStyle: 'italic',
        marginTop: 4
    },
    botaoAcao: { 
        marginTop: layout.espacamento.amigavel 
    },
});