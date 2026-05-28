import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator, Alert } from 'react-native';
import Selector from '@/components/selector';
import Botao from '@/components/botao';
import TabelaGenerica, { TabelaColuna } from '@/components/tabelaGenerica';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { Stack, useFocusEffect } from 'expo-router';
import { getVistorias, Vistoria } from '@/services/vistoriaService';
import { useAuth } from '@/hooks/useAuth';

const colunasDoRelatorio: TabelaColuna<any>[] = [
    { label: 'Data', dataKey: 'data', sortable: true, flex: 2 },
    { label: 'Apiário', dataKey: 'apiarioId', sortable: true, flex: 2 },
    { label: 'Colmeia', dataKey: 'colmeiaId', sortable: true, flex: 2 },
    { label: 'Condição', dataKey: 'condicaoVistoria', sortable: true, flex: 3 },
    { label: 'Pragas', dataKey: 'pragasTexto', sortable: true, flex: 3 },
    { label: 'Perdas', dataKey: 'perdasTexto', sortable: true, flex: 3 },
    { label: 'Obs.', dataKey: 'observacoes', sortable: false, flex: 4 },
];

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
    const { session } = useAuth();
    const produtorId = session || 1;

    const [vistorias, setVistorias] = useState<Vistoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [anoSelecionado, setAnoSelecionado] = useState('');
    const [statusSelecionado, setStatusSelecionado] = useState('');

    const carregarVistorias = useCallback(async () => {
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
            const filtroAno = anoSelecionado === '' ? true : item.data.includes(anoSelecionado);
            const filtroStatus = statusSelecionado === '' ? true : item.condicaoVistoria?.toLowerCase() === statusSelecionado.toLowerCase();
            return filtroAno && filtroStatus;
        }).map(item => ({
            ...item,
            pragasTexto: item.pragas?.length ? item.pragas.join(', ') : 'Nenhuma',
            perdasTexto: item.perdas?.length ? item.perdas.join(', ') : 'Nenhuma',
        }));
    }, [vistorias, anoSelecionado, statusSelecionado]);

    const handleExportar = () => {
        if (dadosFiltrados.length === 0) {
            Alert.alert('Aviso', 'Não há dados para exportar.');
            return;
        }

        // Geração do CSV
        const cabecalho = 'Data,Apiario,Colmeia,Condicao,Pragas,Perdas,Observacoes\n';
        const linhas = dadosFiltrados.map(v => 
            `${v.data},${v.apiarioId},${v.colmeiaId},${v.condicaoVistoria},"${v.pragasTexto}","${v.perdasTexto}","${v.observacoes.replace(/"/g, '""')}"`
        ).join('\n');
        
        const csvContent = cabecalho + linhas;

        console.log('--- EXPORTAÇÃO CSV (VISTORIAS) ---');
        console.log(csvContent);
        console.log('----------------------------------');

        Alert.alert(
            'Sucesso',
            `O relatório com ${dadosFiltrados.length} registros foi gerado no console com sucesso!`,
            [{ text: 'OK' }]
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Stack.Screen options={{ title: 'Tabela' }} />
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
                                <TabelaGenerica
                                    colunas={colunasDoRelatorio}
                                    data={dadosFiltrados}
                                />
                            </View>
                        </ScrollView>
                    </View>
                    <Text style={styles.dicaScroll}>Deslize para ver as observações completas</Text>

                    <Botao
                        title="Exportar Relatório (CSV)"
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