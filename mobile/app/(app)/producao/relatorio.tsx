import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Selector from '@/components/selector';
import Botao from '@/components/botao';
import TabelaGenerica, { TabelaColuna } from '@/components/tabelaGenerica';
import GraficoCard, { KpiData } from '@/components/graficoCard';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import Subtexto from '@/components/subTexto';

interface DadosDoRelatorio {
    loteId: string;
    dataExtracao: string;
    pesoLitro: string;
}
const dadosRelatorio: DadosDoRelatorio[] = [
    { loteId: 'ID - 03', dataExtracao: '15/08/2025', pesoLitro: '2,0 Kg' },
    { loteId: 'ID - 02', dataExtracao: '04/07/2025', pesoLitro: '1,7 Kg' },
    { loteId: 'ID - 01', dataExtracao: '20/06/2025', pesoLitro: '1,3 Kg' },
    { loteId: 'ID - 04', dataExtracao: '03/06/2024', pesoLitro: '4,6 kg ' },
];
const colunasDoRelatorio: TabelaColuna<DadosDoRelatorio>[] = [
    { label: 'Lote de Mel', dataKey: 'loteId', sortable: true, flex: 2 },
    { label: 'Data de Extração', dataKey: 'dataExtracao', sortable: true, flex: 3 },
    { label: 'Peso/Litro', dataKey: 'pesoLitro', sortable: true, flex: 2 },

];
const anoOptions = [
    { label: '2025', value: '2025' },
    { label: '2024', value: '2024' },
    { label: '2023', value: '2023' },
    { label: '2022', value: '2022' },
    { label: '2021', value: '2021' },
];
const estacaoOptions = [
    { label: 'Verão', value: 'verao' },
    { label: 'Outono', value: 'outono' },
    { label: 'Inverno', value: 'inverno' },
    { label: 'Primavera', value: 'primavera' },
];
const mesOptions = [
    { label: 'Janeiro', value: '1' },
    { label: 'Fevereiro', value: '2' },
    { label: 'Março', value: '3' },
    { label: 'Abril', value: '4' },
    { label: 'Maio', value: '5' },
    { label: 'Junho', value: '6' },
    { label: 'Julho', value: '7' },
    { label: 'Agosto', value: '8' },
    { label: 'Setembro', value: '9' },
    { label: 'Outubro', value: '10' },
    { label: 'Novembro', value: '11' },
    { label: 'Dezembro', value: '12' },
];
const apiarioOptions = [
    { label: 'Rosa do Sertão', value: 'rosa_sertao' },
    { label: 'Vale das Abelhas', value: 'vale_abelhas' },
    { label: 'Serra do Mel', value: 'serra_mel' },
    { label: 'Apiário Central', value: 'central' },
];
const colmeiaOptions = [
    { label: 'Colmeia 1', value: 'c1' },
    { label: 'Colmeia 2', value: 'c2' },
    { label: 'Colmeia 3', value: 'c3' },
    { label: 'Colmeia 4', value: 'c4' },
    { label: 'Colmeia 5', value: 'c5' },
];

const kpisDeProducao: KpiData[] = [
    {
        label: 'Produção Total (kg)',
        value: '3000',
    },
    {
        label: 'Prod. Média (kg/colmeia)',
        value: '5',
    },
    {
        label: 'Média por Apiário (kg)',
        value: '70',
    },
    {
        label: 'Vistorias Totais',
        value: '10',
    },
];

export default function Relatorio() {
    const [modo, setModo] = useState<'filtros' | 'grafico' | 'tabela'>('filtros');
    const [ano, setAno] = useState('');
    const [estacao, setEstacao] = useState('');
    const [mes, setMes] = useState('');
    const [apiario, setApiario] = useState('');
    const [colmeia, setColmeia] = useState('');

    const handleGerarRelatorio = () => {
        console.log('Gerando relatório (Tabela)...', { ano, estacao, mes, apiario, colmeia });
        setModo('tabela');
    };
    const handleGerarGrafico = () => {
        console.log('Gerando gráfico...', { ano, estacao, mes, apiario, colmeia });
        setModo('grafico');
    };
    const handleVoltarParaFiltros = () => {
        setModo('filtros');
    };

    if (modo === 'grafico') {
        return (
            <GraficoCard
                subtexto="Visão geral e detalhada da produção com base nos filtros."
                kpis={kpisDeProducao}
                tituloBotao="Gerar relatório"
                onBotaoPress={handleGerarRelatorio}
                showSideBar={true}
            >

                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Produção de Mel Mensal (kg)</Text>
                    <View style={styles.chartPlaceholder}>
                        <Text style={styles.placeholderText}>
                            [Simulação de Gráfico de Linha]
                        </Text>
                    </View>
                </View>

                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Status das Colmeias</Text>
                    <View style={[styles.chartPlaceholder, styles.barChartContainer]}>
                        <View style={styles.barWrapper}>
                            <Text style={styles.barLabelValue}>12</Text>
                            <View style={[styles.bar, { height: 150, backgroundColor: '#2ECC71' }]} />
                            <Text style={styles.barLabel}>Saudável</Text>
                        </View>
                        {/* Barra de Atenção */}
                        <View style={styles.barWrapper}>
                            <Text style={styles.barLabelValue}>0</Text>
                            <View style={[styles.bar, { height: 10, backgroundColor: '#F1C40F' }]} />
                            <Text style={styles.barLabel}>Atenção</Text>
                        </View>
                        {/* Barra de Crítica */}
                        <View style={styles.barWrapper}>
                            <Text style={styles.barLabelValue}>0</Text>
                            <View style={[styles.bar, { height: 10, backgroundColor: '#E74C3C' }]} />
                            <Text style={styles.barLabel}>Crítica</Text>
                        </View>
                    </View>
                    <Text style={styles.legend}>■ Número de Colmeias</Text>
                </View>
            </GraficoCard>
        );
    }

    if (modo === 'tabela') {
        return (
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
            >
                <Subtexto style={styles.subtexto}>Relatório Gerado</Subtexto>
                <TabelaGenerica
                    colunas={colunasDoRelatorio}
                    data={dadosRelatorio}
                />
                <Botao
                    title="Exportar"
                    cor="primaria"
                    onPress={() => alert('Exportando...')}
                    style={styles.botaoExportar}
                />
                <Botao
                    title="Ver Gráfico"
                    cor="secundaria"
                    onPress={handleGerarGrafico}
                    style={styles.botao}
                />
            </ScrollView>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <Subtexto style={styles.subtexto}>Filtros</Subtexto>
            <View style={[styles.linhaFiltro, { zIndex: 10 }]}>
                <Selector
                    label="Ano"
                    options={anoOptions}
                    onSelect={setAno}
                    placeholder="Ano"
                    style={styles.filtroPequeno}
                />
                <Selector
                    label="Estação"
                    options={estacaoOptions}
                    onSelect={setEstacao}
                    placeholder="Estação"
                    style={styles.filtroPequeno}
                />
                <Selector
                    label="Mês"
                    options={mesOptions}
                    onSelect={setMes}
                    placeholder="Mês"
                    style={styles.filtroPequeno}
                />
            </View>
            <View style={[styles.linhaFiltro, { zIndex: 9 }]}>
                <Selector
                    label="Apiário"
                    options={apiarioOptions}
                    onSelect={setApiario}
                    placeholder="Apiário"
                    style={styles.filtroMetade}
                />
                <Selector
                    label="Colmeia"
                    options={colmeiaOptions}
                    onSelect={setColmeia}
                    placeholder="Colmeia"
                    style={styles.filtroMetade}
                />
            </View>
            <Botao
                title="Gerar Gráfico"
                cor="secundaria"
                onPress={handleGerarGrafico}
                style={styles.botao}
            />
            <Botao
                title="Gerar Relatório"
                cor="primaria"
                onPress={handleGerarRelatorio}
                style={styles.botao}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: cores.fundo,
    },
    contentContainer: {
        padding: layout.espacamento.amigavel,
        gap: layout.espacamento.colega,
    },
    subtexto: {
        width: '100%',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: cores.texto,
    },
    linhaFiltro: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: layout.espacamento.texto,
    },
    filtroPequeno: {
        flex: 1,
    },
    filtroMetade: {
        flex: 1,
    },
    botao: {
        marginTop: layout.espacamento.texto,
    },
    botaoVoltar: {
        alignSelf: 'flex-start',
        paddingHorizontal: 0,
        marginBottom: layout.espacamento.texto,
    },
    botaoExportar: {
        marginTop: layout.espacamento.amigavel,
    },

    chartContainer: {
        marginTop: layout.espacamento.amigavel,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: cores.texto,
        marginBottom: layout.espacamento.texto,
    },
    chartPlaceholder: {
        height: 200,
        backgroundColor: cores.branco,
        borderRadius: layout.borderRadius.r25,
        borderWidth: 1,
        borderColor: cores.borda[10],
        justifyContent: 'center',
        alignItems: 'center',
        padding: layout.espacamento.amigavel,
    },
    placeholderText: {
        color: cores.primaria,
        fontSize: 16,
    },
    barChartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 350,
    },
    barWrapper: {
        flex: 1,
        alignItems: 'center',
        gap: 5,
    },
    bar: {
        width: '50%',
        borderRadius: 5,
    },
    barLabelValue: {
        fontSize: 12,
        color: cores.texto,
    },
    barLabel: {
        fontSize: 12,
        color: cores.primaria,
    },
    legend: {
        fontSize: 14,
        color: cores.primaria,
        marginTop: layout.espacamento.texto,
        textAlign: 'center',
    },
});