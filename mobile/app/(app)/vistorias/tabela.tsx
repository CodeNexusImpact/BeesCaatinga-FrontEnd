import React, { useState, useMemo, useCallback } from 'react';
import { exportarCsv } from '@/utils/csv';
import BotaoExportarPdf from '@/components/botaoExportarPdf';
import { opcoesDeAno } from '@/components/graficos';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';
import Selector from '@/components/formulario/selector';
import Botao from '@/components/formulario/botao';
import Tabela, { TabelaColuna } from '@/components/tabela';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { Stack, useFocusEffect } from 'expo-router';
import { getVistorias, Vistoria } from '@/services/vistoriaService';
import { useAuth } from '@/hooks/useAuth';
import { alerta } from '@/utils/alerta';

const colunasDoRelatorio: TabelaColuna<any>[] = [
    { label: 'Data', dataKey: 'data', sortable: true, flex: 2 },
    { label: 'Apiário', dataKey: 'apiarioId', sortable: true, flex: 2 },
    { label: 'Colmeia', dataKey: 'colmeiaId', sortable: true, flex: 2 },
    { label: 'Condição', dataKey: 'condicao', sortable: true, flex: 3 },
    { label: 'Pragas', dataKey: 'pragasTexto', sortable: true, flex: 3 },
    { label: 'Perdas', dataKey: 'perdasTexto', sortable: true, flex: 3 },
    { label: 'Obs.', dataKey: 'observacoes', sortable: false, flex: 4 },
];

const statusOptions = [
    { label: 'Todos os Status', value: '' },
    { label: 'Saudável', value: 'SAUDAVEL' },
    { label: 'Manutenção Necessária', value: 'MANUTENCAO_NECESSARIA' },
    { label: 'Agendar Colheita', value: 'AGENDAR_COLHEITA' },
];

export default function RelatorioVistoriaTabela() {
    const { user } = useAuth();
    const produtorId = user?.id;

    const [vistorias, setVistorias] = useState<Vistoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [anoSelecionado, setAnoSelecionado] = useState('');
    const [statusSelecionado, setStatusSelecionado] = useState('');
    const anoOptions = useMemo(() => opcoesDeAno(vistorias, (v) => v.dataVistoria), [vistorias]);

    const carregarVistorias = useCallback(async () => {
        if (!produtorId) return;
        try {
            setLoading(true);
            const dados = await getVistorias(produtorId);
            setVistorias(dados);
        } catch (error) {
            console.error('Erro ao carregar vistorias para tabela:', error);
        } finally {
            setLoading(false);
        }
    }, [produtorId]);

    useFocusEffect(
        useCallback(() => {
            carregarVistorias();
        }, [carregarVistorias])
    );

    const dadosFiltrados = useMemo(() => {
        return vistorias.filter(item => {
            const filtroAno = anoSelecionado === '' ? true : item.dataVistoria.includes(anoSelecionado);
            const filtroStatus = statusSelecionado === '' ? true : item.condicao?.toLowerCase() === statusSelecionado.toLowerCase();
            return filtroAno && filtroStatus;
        }).map(item => ({
            ...item,
            pragasTexto: item.pragasIdentificadas?.length ? item.pragasIdentificadas.join(', ') : 'Nenhuma',
            perdasTexto: item.perdasIdentificadas?.length ? item.perdasIdentificadas.join(', ') : 'Nenhuma',
        }));
    }, [vistorias, anoSelecionado, statusSelecionado]);

    const handleExportar = async () => {
        if (!dadosFiltrados?.length) {
            alerta('Aviso', 'Não há dados para exportar.');
            return;
        }
        try {
            await exportarCsv('relatorio-vistorias.csv', colunasDoRelatorio as any, dadosFiltrados);
        } catch {
            alerta('Erro', 'Não foi possível exportar a planilha.');
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Stack.Screen options={{ title: 'Relatório de Vistorias' }} />
            <BotaoExportarPdf tipo="vistorias" filtro={{ ano: anoSelecionado ? Number(anoSelecionado) : null }} />
            <Subtexto style={styles.subtexto}>Vistorias Detalhadas</Subtexto>

            <View style={styles.filtroWrapper}>
                <View style={styles.filtrosRow}>
                    <Selector 
                        label="Ano"
                        options={anoOptions} 
                        onSelect={setAnoSelecionado} 
                        placeholder="Todos"
                        style={styles.seletor}
                        value={anoSelecionado}
                    />
                    <Selector 
                        label="Status"
                        options={statusOptions}
                        onSelect={setStatusSelecionado}
                        placeholder="Todos"
                        style={styles.seletor}
                        value={statusSelecionado}
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
                            <View style={{ minWidth: 1200 }}>
                                <Tabela
                                    colunas={colunasDoRelatorio}
                                    data={dadosFiltrados}
                                />
                            </View>
                        </ScrollView>
                    </View>
                    <Text style={styles.dicaScroll}>Deslize para ver as observações completas</Text>

                    <Botao
                        title="Exportar planilha (CSV)"
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