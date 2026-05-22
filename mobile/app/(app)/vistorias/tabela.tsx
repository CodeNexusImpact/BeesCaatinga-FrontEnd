import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';
import Selector from '@/components/selector';
import Botao from '@/components/botao';
import TabelaGenerica, { TabelaColuna } from '@/components/tabelaGenerica';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { Stack, useFocusEffect } from 'expo-router';
import { getVistorias, Vistoria } from '@/services/vistoriaService';

const colunasDoRelatorio: TabelaColuna<Vistoria>[] = [
    { label: 'Data', dataKey: 'data', sortable: true, flex: 2 },
    { label: 'Apiário', dataKey: 'apiarioId', sortable: true, flex: 2 },
    { label: 'Colmeia', dataKey: 'colmeiaId', sortable: true, flex: 2 },
    { label: 'Condição', dataKey: 'condicaoVistoria', sortable: true, flex: 3 },
    { label: 'Obs.', dataKey: 'observacoes', sortable: false, flex: 4 },
];

// --- Opções de Filtro ---
const anoOptions = [
    { label: 'Todos os Anos', value: '' },
    { label: '2026', value: '2026' },
    { label: '2025', value: '2025' },
    { label: '2024', value: '2024' },
];

const statusOptions = [
    { label: 'Todos os Status', value: '' },
    { label: 'Saudável', value: 'saudavel' },
    { label: 'Excelente', value: 'excelente' },
    { label: 'Manutenção', value: 'manutencao' },
    { label: 'Em Risco', value: 'risco' },
    { label: 'Perdida', value: 'perdida' },
];

export default function RelatorioVistoriaTabela() {
    const [vistorias, setVistorias] = useState<Vistoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [ano, setAno] = useState('');
    const [status, setStatus] = useState('');

    const carregarVistorias = async () => {
        try {
            setLoading(true);
            const produtorId = 1; // Padrão mock-api
            const dados = await getVistorias(produtorId);
            setVistorias(dados);
        } catch (error) {
            console.error('Erro ao carregar vistorias para tabela:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            carregarVistorias();
        }, [])
    );

    const handleExportar = () => {
        alert(`Exportando ${dadosFiltrados.length} vistorias...`);
    };

    // Filtragem por ano E status
    const dadosFiltrados = useMemo(() => {
        return vistorias.filter(item => {
            const filtroAno = ano === '' ? true : item.data.includes(ano);
            const filtroStatus = status === '' ? true : item.condicaoVistoria?.toLowerCase() === status.toLowerCase();
            return filtroAno && filtroStatus;
        });
    }, [vistorias, ano, status]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Stack.Screen options={{ title: 'Tabela' }} />
            <Subtexto style={styles.subtexto}>Vistorias Detalhadas</Subtexto>

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

            {loading ? (
                <ActivityIndicator size="large" color={cores.primaria} />
            ) : (
                <>
                    <Text style={styles.resultadosTexto}>
                        {dadosFiltrados.length} registros encontrados
                    </Text>

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
                </>
            )}
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
    filtroWrapper: {
        position: 'relative',
        zIndex: 999,
        marginBottom: layout.espacamento.texto,
    },
    filtrosRow: {
        flexDirection: 'row',
        gap: layout.espacamento.texto,
        flexWrap: 'wrap',
    },
    seletor: {
        flex: 1,
        minWidth: 130,
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