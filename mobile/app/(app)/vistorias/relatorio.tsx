import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Selector from '@/components/selector';
import Botao from '@/components/botao';
import TabelaGenerica, { TabelaColuna } from '@/components/tabelaGenerica';
import GraficoCard, { KpiData } from '@/components/graficoCard';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import Subtexto from '@/components/subTexto';

// Interface para os dados da tabela
interface DadosVistoria {
    dataInspeção: string;
    pragas: string;
    perdas: string;
    observacoes: string;
    statusColmeia: string;
}

// Dados mockados para a tabela
const dadosRelatorio: DadosVistoria[] = [
    { dataInspeção: '20/08/2025', pragas: 'Varroa', perdas: 'Nenhuma', observacoes: 'Colmeia', statusColmeia: 'Ativa' },
    { dataInspeção: '20/08/2025', pragas: 'Formigas', perdas: 'Rainha fraca', observacoes: 'Substituir rainha em breve', statusColmeia: 'Ativa' },
    { dataInspeção: '22/08/2025', pragas: 'Ácaros', perdas: 'Nenhuma', observacoes: 'Precisa de mais espaço', statusColmeia: 'Ativa' },
    { dataInspeção: '25/08/2025', pragas: 'Nenhuma', perdas: 'Alimentação', observacoes: 'Precisa de mais espaço', statusColmeia: 'Ativa' },
    { dataInspeção: '27/08/2025', pragas: 'Nenhuma', perdas: 'Clima', observacoes: 'Produção baixa devido as chuvas', statusColmeia: 'Inativa' },
    { dataInspeção: '27/08/2025', pragas: 'Lagartixa', perdas: 'Clima', observacoes: 'Produção baixa devido as chuvas', statusColmeia: 'Ativa' },
    { dataInspeção: '28/08/2025', pragas: 'Nenhuma', perdas: 'Clima', observacoes: 'Produção baixa', statusColmeia: 'Inativa' },
];

// Colunas para a TabelaGenerica 
const colunasDoRelatorio: TabelaColuna<DadosVistoria>[] = [
    { label: 'Data Inspeção', dataKey: 'dataInspeção', sortable: true, flex: 3 },
    { label: 'Pragas/Doenças', dataKey: 'pragas', sortable: true, flex: 3 },
    { label: 'Perdas/Produção', dataKey: 'perdas', sortable: true, flex: 3 },
    { label: 'Observações', dataKey: 'observacoes', sortable: false, flex: 4 },
    { label: 'Status Colmeia', dataKey: 'statusColmeia', sortable: true, flex: 2 },
];

// KPIs para o GráficoCard 
const kpisDeVistoria: KpiData[] = [
    { label: 'Vistorias Totais', value: '10' },
    { label: 'Colmeias Saudáveis', value: '5' },
    { label: 'Colmeias em Atenção', value: '2' },
    { label: 'Colmeias Críticas', value: '1' }, 
];

// --- Opções dos Filtros  ---
const anoOptions = [
    { label: '2025', value: '2025' },
    { label: '2024', value: '2024' },
    { label: '2023', value: '2023' },
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

];
const apiarioOptions = [
    { label: 'Rosa do Sertão', value: 'rosa_sertao' },
    { label: 'Vale das Abelhas', value: 'vale_abelhas' },
];
const colmeiaOptions = [
    { label: 'Colmeia 1', value: 'c1' },
    { label: 'Colmeia 2', value: 'c2' },
];

export default function RelatorioVistoria() { // Nome do componente mudado
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

    // --- (MODO GRÁFICO) ---
    if (modo === 'grafico') {
        return (
            <GraficoCard
                subtexto="Estatísticas e análise detalhada das inspeções de colmeias."
                kpis={kpisDeVistoria} // [ALTERADO]
                tituloBotao="Gerar relatório"
                onBotaoPress={handleGerarRelatorio}
                showSideBar={true}
            >
                <View style={styles.chartContainer}>
                    {/*Título do gráfico */}
                    <Text style={styles.chartTitle}>Status de Saúde das Colmeias</Text>
                    {/* Simulação de Gráfico de Pizza (Mock) */}
                    <View style={styles.chartPlaceholder}>
                        <Text style={styles.placeholderText}>
                            [Simulação de Gráfico de Pizza]
                        </Text>
                    </View>
                    <View style={styles.legendContainer}>
                        <Text style={styles.legend}>■ Saudável</Text>
                        <Text style={styles.legend}>■ Atenção</Text>
                        <Text style={styles.legend}>■ Crítica</Text>
                    </View>
                </View>

                <View style={styles.chartContainer}>
                    {/* Título do gráfico */}
                    <Text style={styles.chartTitle}>Número de Vistorias Mensais</Text>
                    <View style={styles.chartPlaceholder}>
                        <Text style={styles.placeholderText}>
                            [Simulação de Gráfico de Linha]
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