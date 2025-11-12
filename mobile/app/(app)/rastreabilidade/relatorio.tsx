import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Selector from '@/components/selector';
import Botao from '@/components/botao';
import TabelaGenerica, { TabelaColuna } from '@/components/tabelaGenerica';
import GraficoCard, { KpiData } from '@/components/graficoCard';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import Subtexto from '@/components/subTexto';

// Interface para os dados da tabela de RASTREABILIDADE
interface DadosRastreabilidade {
    id: string;
    dataProducao: string;
    quantidadeProduzida: string;
    tratamento: string;
    localidade: string;
    tipoAbelhas: string;
}

// Dados mockados para a tabela de RASTREABILIDADE
const dadosRelatorio: DadosRastreabilidade[] = [
    { id: 'A001', dataProducao: '15/08/2025', quantidadeProduzida: '15 kg', tratamento: 'Excaliburno', localidade: 'Sitio das Abelhas', tipoAbelhas: 'natva' },
    { id: 'A002', dataProducao: '15/08/2025', quantidadeProduzida: '15 kg', tratamento: 'Excaliburno', localidade: 'Sitio das Abelhas', tipoAbelhas: 'natva' },
    { id: 'A003', dataProducao: '15/08/2025', quantidadeProduzida: '15 kg', tratamento: 'Excaliburno', localidade: 'Sitio das Abelhas', tipoAbelhas: 'natva' },
    { id: 'A004', dataProducao: '15/08/2025', quantidadeProduzida: '15 kg', tratamento: 'Excaliburno', localidade: 'Sitio das Abelhas', tipoAbelhas: 'natva' },
    { id: 'A005', dataProducao: '15/08/2025', quantidadeProduzida: '15 kg', tratamento: 'Excaliburno', localidade: 'Sitio das Abelhas', tipoAbelhas: 'natva' },
];

// Colunas para a TabelaGenerica de RASTREABILIDADE
const colunasDoRelatorio: TabelaColuna<DadosRastreabilidade>[] = [
    { label: 'ID', dataKey: 'id', sortable: true, flex: 1 },
    { label: 'Data de Produção', dataKey: 'dataProducao', sortable: true, flex: 2 },
    { label: 'Quantidade Produzida', dataKey: 'quantidadeProduzida', sortable: true, flex: 2 },
    { label: 'Tratamento', dataKey: 'tratamento', sortable: true, flex: 2 },
    { label: 'Localidade', dataKey: 'localidade', sortable: true, flex: 2 },
    { label: 'Tipo de Abelhas', dataKey: 'tipoAbelhas', sortable: true, flex: 2 },
];

// KPIs para o GráficoCard de RASTREABILIDADE
const kpisRastreabilidade: KpiData[] = [
    { label: 'Pri: Escalar', value: '60 Lotes' },
    { label: 'Barretear (kg)', value: '900 kg' },
    { label: 'Minim Vendônia (%)', value: '95%' },
];

// --- Opções dos Filtros para RASTREABILIDADE ---
const anoOptions = [
    { label: '2025', value: '2025' },
    { label: '2024', value: '2024' },
    { label: '2023', value: '2023' },
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

const tipoAbelhasOptions = [
    { label: 'Nativas', value: 'nativas' },
    { label: 'Africanizadas', value: 'africanizadas' },
    { label: 'Italianas', value: 'italianas' },
];

const apiarioOptions = [
    { label: 'Apiário A', value: 'apiario_a' },
    { label: 'Apiário B', value: 'apiario_b' },
    { label: 'Apiário C', value: 'apiario_c' },
];

export default function RelatorioRastreabilidade() {
    const [modo, setModo] = useState<'filtros' | 'grafico' | 'tabela'>('filtros');
    const [ano, setAno] = useState('');
    const [mes, setMes] = useState('');
    const [tipoAbelhas, setTipoAbelhas] = useState('');
    const [apiario, setApiario] = useState('');

    const handleGerarRelatorio = () => {
        console.log('Gerando relatório (Tabela)...', { ano, mes, tipoAbelhas, apiario });
        setModo('tabela');
    };
    const handleGerarGrafico = () => {
        console.log('Gerando gráfico...', { ano, mes, tipoAbelhas, apiario });
        setModo('grafico');
    };
    const handleVoltarParaFiltros = () => {
        setModo('filtros');
    };

    // --- (MODO GRÁFICO) ---
    if (modo === 'grafico') {
        return (
            <GraficoCard
                subtexto="Estatísticas detalhadas sobre a origem, qualidade e destino dos lotes de mel."
                kpis={kpisRastreabilidade}
                tituloBotao="Gerar relatório"
                onBotaoPress={handleGerarRelatorio}
                showSideBar={true}
            >
                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Produção de Lotes por Tipo de Abelhas</Text>
                    <View style={styles.chartPlaceholder}>
                        <Text style={styles.placeholderText}>
                            [Simulação de Gráfico de Produção]
                        </Text>
                    </View>
                    <View style={styles.legendContainer}>
                        <Text style={styles.legend}>■ Abelhas Nativas</Text>
                        <Text style={styles.legend}>■ Abelhas Africanizadas</Text>
                        <Text style={styles.legend}>■ Abelhas Italianas</Text>
                    </View>
                </View>

                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Distribuição por Apiário</Text>
                    <View style={styles.chartPlaceholder}>
                        <Text style={styles.placeholderText}>
                            [Simulação de Gráfico de Distribuição]
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

                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>Tempo Mês: 60 Lotes (data)</Text>
                </View>

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
                    label="Tipo de Abelhas"
                    options={tipoAbelhasOptions}
                    onSelect={setTipoAbelhas}
                    placeholder="Tipo de Abelhas"
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
    botaoExportar: {
        marginTop: layout.espacamento.amigavel,
    },
    infoContainer: {
        backgroundColor: cores.branco,
        padding: layout.espacamento.amigavel,
        borderRadius: 8,
        marginBottom: layout.espacamento.texto,
        borderWidth: 1,
        borderColor: cores.borda,
    },
    infoText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: cores.texto,
        textAlign: 'center',
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