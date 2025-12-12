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
interface DadosVistoria {
    id: string;
    ano: string; // Usado para filtro
    dataInspeção: string;
    pragas: string;
    perdas: string;
    observacoes: string;
    statusColmeia: string;
}

const MASTER_TABLE_DATA: DadosVistoria[] = [
    { id: '1', ano: '2025', dataInspeção: '20/08/2025', pragas: 'Varroa', perdas: 'Nenhuma', observacoes: 'Tratamento iniciado com fitas.', statusColmeia: 'Ativa' },
    { id: '2', ano: '2025', dataInspeção: '20/08/2025', pragas: 'Formigas', perdas: 'Rainha fraca', observacoes: 'Necessário substituir rainha.', statusColmeia: 'Ativa' },
    { id: '3', ano: '2025', dataInspeção: '22/08/2025', pragas: 'Ácaros', perdas: 'Baixa', observacoes: 'Enxame fraco, unificar.', statusColmeia: 'Ativa' },
    { id: '4', ano: '2025', dataInspeção: '25/08/2025', pragas: 'Nenhuma', perdas: 'Nenhuma', observacoes: 'Colmeia muito forte, adicionar melgueira.', statusColmeia: 'Ativa' },
    
    { id: '5', ano: '2024', dataInspeção: '15/08/2024', pragas: 'Traça', perdas: 'Total', observacoes: 'Colmeia abandonada.', statusColmeia: 'Inativa' },
    { id: '6', ano: '2024', dataInspeção: '20/09/2024', pragas: 'Nenhuma', perdas: 'Clima', observacoes: 'Produção baixa devido seca.', statusColmeia: 'Ativa' },
];

const colunasDoRelatorio: TabelaColuna<DadosVistoria>[] = [
    { label: 'Data', dataKey: 'dataInspeção', sortable: true, flex: 2 },
    { label: 'Pragas', dataKey: 'pragas', sortable: true, flex: 2 },
    { label: 'Perdas', dataKey: 'perdas', sortable: true, flex: 2 },
    { label: 'Obs.', dataKey: 'observacoes', sortable: false, flex: 4 }, // Coluna maior
    { label: 'Status', dataKey: 'statusColmeia', sortable: true, flex: 2 },
];

// --- Opções de Filtro ---
const anoOptions = [
    { label: 'Todos os Anos', value: '' },
    { label: '2025', value: '2025' },
    { label: '2024', value: '2024' },
];

export default function RelatorioVistoriaTabela() {
    const [ano, setAno] = useState('');
    const [status, setStatus] = useState(''); // ✅ Novo estado

    const handleExportar = () => {
        alert(`Exportando ${dadosFiltrados.length} vistorias...`);
    };

    // ✅ Opções de status (extraídas dos dados ou fixas)
    const statusOptions = [
        { label: 'Todos os Status', value: '' },
        { label: 'Ativa', value: 'Ativa' },
        { label: 'Inativa', value: 'Inativa' },
    ];

    // ✅ Filtragem por ano E status
    const dadosFiltrados = useMemo(() => {
        return MASTER_TABLE_DATA.filter(item => {
            const filtroAno = ano === '' ? true : item.ano === ano;
            const filtroStatus = status === '' ? true : item.statusColmeia === status;
            return filtroAno && filtroStatus;
        });
    }, [ano, status]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Stack.Screen options={{ title: 'Tabela' }} />
            <Subtexto style={styles.subtexto}>Vistorias Detalhadas</Subtexto>

            {/* 👇 Filtros em linha */}
            <View style={styles.filtroWrapper}>
                <View style={styles.filtrosRow}>
                    <Selector 
                        label="Ano"
                        options={anoOptions} 
                        onSelect={setAno} 
                        placeholder="Todos"
                        style={styles.seletor}
                    />
                    <Selector 
                        label="Status"
                        options={statusOptions}
                        onSelect={setStatus}
                        placeholder="Todos"
                        style={styles.seletor}
                    />
                </View>
            </View>

            <Text style={styles.resultadosTexto}>
                {dadosFiltrados.length} registros encontrados
            </Text>

            {/* --- TABELA COM SCROLL HORIZONTAL --- */}
            <View style={styles.tabelaContainer}>
                <ScrollView 
                    horizontal={true} 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContentTabela}
                >
                    <View style={{ minWidth: 900 }}>
                        <TabelaGenerica
                            colunas={colunasDoRelatorio}
                            data={dadosFiltrados}
                        />
                    </View>
                </ScrollView>
            </View>
            <Text style={styles.dicaScroll}>Deslize para ver as observações completas</Text>

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
    contentContainer: { 
        padding: layout.espacamento.amigavel, 
        gap: layout.espacamento.colega,
        overflow: 'visible',
    },
    subtexto: { 
        width: '100%', 
        textAlign: 'center', 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: cores.texto, 
        marginBottom: layout.espacamento.texto 
    },

    // ✅ Wrapper com zIndex alto
    filtroWrapper: {
        position: 'relative',
        zIndex: 999,
        marginBottom: layout.espacamento.texto,
    },
    filtrosRow: {
        flexDirection: 'row',
        gap: layout.espacamento.texto,
        flexWrap: 'wrap', // permite quebrar em telas pequenas
    },
    seletor: {
        flex: 1,
        minWidth: 130, // ajustado para caber 2 em linha (ex: 360px → 130+130+gap)
    },

    resultadosTexto: {
        textAlign: 'center',
        fontSize: 12,
        color: '#888',
        marginBottom: 5,
    },

    tabelaContainer: { 
        marginTop: layout.espacamento.texto,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    
    scrollContentTabela: {
        paddingRight: 20,
    },

    dicaScroll: {
        textAlign: 'center',
        fontSize: 10,
        color: '#999',
        marginTop: 4,
    },

    botaoExportar: { 
        marginTop: layout.espacamento.amigavel 
    },
});