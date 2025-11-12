import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Selector from '@/components/selector';
import Botao from '@/components/botao';
import TabelaGenerica, { TabelaColuna } from '@/components/tabelaGenerica';
import GraficoCard, { KpiData } from '@/components/graficoCard';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import Subtexto from '@/components/subTexto';

// Interface para os dados da tabela de INSUMOS
interface DadosInsumo {
    dataEntrada: string;
    nomeInsumo: string;
    tipoInsumo: string;
    quantidade: string;
    unidadeMedida: string;
    status: string;
}

// Dados mockados para a tabela de INSUMOS
const dadosRelatorio: DadosInsumo[] = [
    { dataEntrada: '15/01/2025', nomeInsumo: 'Cera de abelha', tipoInsumo: 'Equipamento', quantidade: '5', unidadeMedida: 'kg', status: 'Disponível' },
    { dataEntrada: '15/01/2025', nomeInsumo: 'Avis MultiFlex', tipoInsumo: 'Outro', quantidade: '100', unidadeMedida: 'Unidade', status: 'Em uso' },
    { dataEntrada: '15/01/2025', nomeInsumo: 'Caixa de Eucalipto', tipoInsumo: 'Equipamento', quantidade: '2', unidadeMedida: 'Unidade', status: 'Disponível' },
    { dataEntrada: '15/01/2025', nomeInsumo: 'Xarope Invertido', tipoInsumo: 'Alimentação', quantidade: '10', unidadeMedida: 'Litros', status: 'Estoque baixo' },
    { dataEntrada: '15/01/2025', nomeInsumo: 'Cera de abelha', tipoInsumo: 'Equipamento', quantidade: '5', unidadeMedida: 'kg', status: 'Estoque baixo' },
    { dataEntrada: '15/01/2025', nomeInsumo: 'Cera de abelha', tipoInsumo: 'Equipamento', quantidade: '5', unidadeMedida: 'kg', status: 'Estoque baixo' },
];

// Colunas para a TabelaGenerica de INSUMOS
const colunasDoRelatorio: TabelaColuna<DadosInsumo>[] = [
    { label: 'Data de Entrada', dataKey: 'dataEntrada', sortable: true, flex: 3 },
    { label: 'Nome do Insumo', dataKey: 'nomeInsumo', sortable: true, flex: 3 },
    { label: 'Tipo de Insumo', dataKey: 'tipoInsumo', sortable: true, flex: 3 },
    { label: 'Quantidade', dataKey: 'quantidade', sortable: true, flex: 2 },
    { label: 'Unidade de Medida', dataKey: 'unidadeMedida', sortable: true, flex: 3 },
    { label: 'Status', dataKey: 'status', sortable: true, flex: 2 },
];

// KPIs para o GráficoCard de INSUMOS
const kpisDeInsumos: KpiData[] = [
    { label: 'Total de Insumos', value: '180' },
    { label: 'Estoque Baixo', value: '70' },
    { label: 'Consumo Mensal', value: '70' },
];

// --- Opções dos Filtros para INSUMOS ---
const anoOptions = [
    { label: '2025', value: '2025' },
    { label: '2024', value: '2024' },
    { label: '2023', value: '2023' },
];

const mesOptions = [
    { label: 'Janeiro', value: '1' },
    { label: 'Fevereiro', value: '2' },
    { label: 'Março', value: '3' },
];

const tipoInsumoOptions = [
    { label: 'Equipamento', value: 'equipamento' },
    { label: 'Alimentação', value: 'alimentacao' },
    { label: 'EPI', value: 'epi' },
    { label: 'Outro', value: 'outro' },
];

const statusOptions = [
    { label: 'Disponível', value: 'disponivel' },
    { label: 'Em uso', value: 'em_uso' },
    { label: 'Estoque baixo', value: 'estoque_baixo' },
    { label: 'Vencido', value: 'vencido' },
];

export default function RelatorioInsumos() {
    const [modo, setModo] = useState<'filtros' | 'grafico' | 'tabela'>('filtros');
    const [ano, setAno] = useState('');
    const [mes, setMes] = useState('');
    const [tipoInsumo, setTipoInsumo] = useState('');
    const [status, setStatus] = useState('');

    const handleGerarRelatorio = () => {
        console.log('Gerando relatório (Tabela)...', { ano, mes, tipoInsumo, status });
        setModo('tabela');
    };
    const handleGerarGrafico = () => {
        console.log('Gerando gráfico...', { ano, mes, tipoInsumo, status });
        setModo('grafico');
    };
    const handleVoltarParaFiltros = () => {
        setModo('filtros');
    };

    // --- (MODO GRÁFICO) ---
    if (modo === 'grafico') {
        return (
            <GraficoCard
                subtexto="Gestão de estoque e consumo de materiais."
                kpis={kpisDeInsumos}
                tituloBotao="Gerar relatório"
                onBotaoPress={handleGerarRelatorio}
                showSideBar={true}
            >
                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Consumo de Insumos por Tipo</Text>
                    <View style={styles.chartPlaceholder}>
                        <Text style={styles.placeholderText}>
                            [Simulação de Gráfico de Consumo]
                        </Text>
                    </View>
                    <View style={styles.legendContainer}>
                        <Text style={styles.legend}>■ Equipamento</Text>
                        <Text style={styles.legend}>■ Alimentação</Text>
                        <Text style={styles.legend}>■ EPI</Text>
                    </View>
                </View>

                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Validade dos Insumos</Text>
                    <View style={styles.chartPlaceholder}>
                        <Text style={styles.placeholderText}>
                            [Simulação de Gráfico de Validade]
                        </Text>
                    </View>
                </View>
            </GraficoCard>
        );
    }

    // --- (MODO TABELA) ---
    if (modo === 'tabela') {
        return (
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
            >
                <Subtexto style={styles.subtexto}>Relatório Gerado</Subtexto>

                <ScrollView horizontal={true} contentContainerStyle={{ width: '150%' }}>
                    <TabelaGenerica
                        colunas={colunasDoRelatorio}
                        data={dadosRelatorio}
                    />
                </ScrollView>

                <Botao
                    title="Exportar"
                    cor="primaria"
                    onPress={() => { /* Lógica de exportar */ }}
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

    // --- (MODO FILTROS) ---
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
                    label="Mês"
                    options={mesOptions}
                    onSelect={setMes}
                    placeholder="Mês"
                    style={styles.filtroPequeno}
                />
                <Selector
                    label="Tipo de Insumo"
                    options={tipoInsumoOptions}
                    onSelect={setTipoInsumo}
                    placeholder="Tipo de Insumo"
                    style={styles.filtroPequeno}
                />
            </View>
            <View style={[styles.linhaFiltro, { zIndex: 9 }]}>
                <Selector
                    label="Status"
                    options={statusOptions}
                    onSelect={setStatus}
                    placeholder="Status"
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
        borderColor: cores.cores.base[10],
        justifyContent: 'center',
        alignItems: 'center',
        padding: layout.espacamento.amigavel,
    },
    placeholderText: {
        color: cores.placeholder,
        fontSize: 16,
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: layout.espacamento.amigavel,
    },
    legend: {
        fontSize: 14,
        color: cores.primaria,
        marginTop: layout.espacamento.texto,
        textAlign: 'center',
    },
});