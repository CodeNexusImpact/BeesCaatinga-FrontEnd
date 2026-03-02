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

// --- Interface e Dados (Baseados no seu cadastro de colmeia) ---
interface DadosColmeia {
    id: string;
    identificador: string;
    apiario: string;
    tipo: string;
    status: 'Ativo' | 'Inativo';
}

// Dados de exemplo (Mock)
const MOCK_COLMEIAS: DadosColmeia[] = [
    { id: '1', identificador: 'COL-01', apiario: 'Rosa do Sertão', tipo: 'Madeira', status: 'Ativo' },
    { id: '2', identificador: 'COL-02', apiario: 'Rosa do Sertão', tipo: 'Concreto', status: 'Ativo' },
    { id: '3', identificador: 'COL-03', apiario: 'Vale das Abelhas', tipo: 'Poliestireno', status: 'Inativo' },
    { id: '4', identificador: 'COL-04', apiario: 'Vale das Abelhas', tipo: 'Madeira', status: 'Ativo' },
    { id: '5', identificador: 'COL-05', apiario: 'Bees Caatinga', tipo: 'Concreto', status: 'Ativo' },
];

// --- Configuração das Colunas ---
const colunasColmeia: TabelaColuna<DadosColmeia>[] = [
    { label: 'Identificador', dataKey: 'identificador', sortable: true, flex: 2 },
    { label: 'Apiário', dataKey: 'apiario', sortable: true, flex: 3 },
    { label: 'Tipo', dataKey: 'tipo', sortable: true, flex: 2 },
    { label: 'Status', dataKey: 'status', sortable: true, flex: 2 },
];

// --- Opções de Filtro ---
const apiarioFiltroOptions = [
    { label: 'Todos os Apiários', value: '' },
    { label: 'Rosa do Sertão', value: 'Rosa do Sertão' },
    { label: 'Vale das Abelhas', value: 'Vale das Abelhas' },
    { label: 'Bees Caatinga', value: 'Bees Caatinga' },
];

export default function TabelaColmeias() {
    const [filtroApiario, setFiltroApiario] = useState('');

    // --- LÓGICA: Filtra as colmeias por apiário ---
    const dadosFiltrados = useMemo(() => {
        return MOCK_COLMEIAS.filter(item => {
            return filtroApiario === '' ? true : item.apiario === filtroApiario;
        });
    }, [filtroApiario]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Stack.Screen options={{ title: 'Lista de Colmeias' }} />

            <Subtexto style={styles.subtexto}>Colmeias Cadastradas</Subtexto>

            {/* Filtros */}
            <View style={styles.filtroContainer}>
                <Selector 
                    label="Filtrar por Apiário" 
                    options={apiarioFiltroOptions} 
                    onSelect={setFiltroApiario} 
                    placeholder="Todos os Apiários" 
                    iconName="home"
                />
            </View>

            <Text style={styles.contagemTexto}>
                {dadosFiltrados.length} colmeias encontradas
            </Text>

            {/* --- TABELA COM SCROLL HORIZONTAL --- */}
            <View style={styles.tabelaContainer}>
                <ScrollView 
                    horizontal={true} 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContentTabela}
                >
                    {/* minWidth garante que colunas não fiquem espremidas em telas pequenas */}
                    <View style={{ minWidth: 600 }}>
                        <TabelaGenerica
                            colunas={colunasColmeia}
                            data={dadosFiltrados}
                        />
                    </View>
                </ScrollView>
            </View>
            
            <Text style={styles.dicaScroll}>Deslize para o lado para ver mais detalhes</Text>

            <Botao
                title="Novo Cadastro"
                cor="primaria"
                onPress={() => { /* router.push('/colmeias/cadastrar') */ }}
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
        zIndex: 10, // Garante que o dropdown sobreponha a tabela
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