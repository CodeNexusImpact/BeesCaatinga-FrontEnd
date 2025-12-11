import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit'; 
import Selector from '@/components/selector';
import GraficoCard, { KpiData } from '@/components/graficoCard';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import layout from '@/constants/layout';

// --- DADOS MOCKADOS (Base de Dados Local) ---
const MASTER_DATA = [
    { ano: '2025', estacao: 'verao', mes: 'Jan', mesIndex: 0, volume: 150, status: 'Saudável' },
    { ano: '2025', estacao: 'verao', mes: 'Fev', mesIndex: 1, volume: 200, status: 'Atenção' },
    { ano: '2025', estacao: 'outono', mes: 'Mar', mesIndex: 2, volume: 180, status: 'Saudável' },
    { ano: '2025', estacao: 'outono', mes: 'Abr', mesIndex: 3, volume: 220, status: 'Saudável' },
    { ano: '2025', estacao: 'inverno', mes: 'Mai', mesIndex: 4, volume: 100, status: 'Crítica' },
    { ano: '2025', estacao: 'inverno', mes: 'Jun', mesIndex: 5, volume: 90, status: 'Crítica' },

    { ano: '2024', estacao: 'verao', mes: 'Jan', mesIndex: 0, volume: 120, status: 'Saudável' },
    { ano: '2024', estacao: 'verao', mes: 'Fev', mesIndex: 1, volume: 130, status: 'Atenção' },
    { ano: '2024', estacao: 'outono', mes: 'Mar', mesIndex: 2, volume: 160, status: 'Saudável' },
    { ano: '2024', estacao: 'outono', mes: 'Abr', mesIndex: 3, volume: 170, status: 'Atenção' },
    { ano: '2024', estacao: 'inverno', mes: 'Mai', mesIndex: 4, volume: 80, status: 'Crítica' },
];

const screenWidth = Dimensions.get('window').width;

// --- Opções de Filtro Atualizadas ---
const anoOptions = [
    { label: 'Todos os Anos', value: '' }, // Opção para ver tudo
    { label: '2025', value: '2025' },
    { label: '2024', value: '2024' },
];

const estacaoOptions = [
    { label: 'Todas as Estações', value: '' },
    { label: 'Verão', value: 'verao' },
    { label: 'Outono', value: 'outono' },
    { label: 'Inverno', value: 'inverno' },
    { label: 'Primavera', value: 'primavera' },
];

export default function Dashboard() {
    // Estado inicial vazio ('') significa "Todos"
    const [ano, setAno] = useState(''); 
    const [estacao, setEstacao] = useState('');

    // --- 1. Lógica de Filtragem ---
    const dadosFiltrados = useMemo(() => {
        return MASTER_DATA.filter(item => {
            // Se ano for vazio, retorna true (ignora filtro). Senão, compara strings.
            const filtroAno = ano === '' ? true : item.ano === ano;
            const filtroEstacao = estacao === '' ? true : item.estacao === estacao;
            return filtroAno && filtroEstacao;
        });
    }, [ano, estacao]);

    // --- 2. Cálculo dos KPIs (Cards) ---
    const kpisCalculados: KpiData[] = useMemo(() => {
        const totalVolume = dadosFiltrados.reduce((acc, curr) => acc + curr.volume, 0);
        const qtdRegistros = dadosFiltrados.length;
        const media = qtdRegistros > 0 ? Math.round(totalVolume / qtdRegistros) : 0;

        return [
            { label: 'Produção Total (kg)', value: totalVolume.toString() },
            { label: 'Média Mensal (kg)', value: media.toString() },
            { label: 'Registros', value: qtdRegistros.toString() },
            { label: 'Vistorias Totais', value: (qtdRegistros * 2).toString() },
        ];
    }, [dadosFiltrados]);

    // --- 3. Dados para Gráfico de Linha ---
    const dataLinha = useMemo(() => {
        const volumes = [0, 0, 0, 0, 0, 0];
        
        dadosFiltrados.forEach(item => {
            if (item.mesIndex < 6) {
                volumes[item.mesIndex] += item.volume;
            }
        });

        return {
            labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].slice(0, 6),
            datasets: [{ data: volumes }]
        };
    }, [dadosFiltrados]);

    // --- 4. Dados para Gráfico de Barras ---
    const dataBarra = useMemo(() => {
        const saudavel = dadosFiltrados.filter(d => d.status === 'Saudável').length;
        const atencao = dadosFiltrados.filter(d => d.status === 'Atenção').length;
        const critica = dadosFiltrados.filter(d => d.status === 'Crítica').length;

        return {
            labels: ["Saudável", "Atenção", "Crítica"],
            datasets: [{ data: [saudavel, atencao, critica] }]
        };
    }, [dadosFiltrados]);

    // Configuração Visual dos Gráficos
    const chartConfig = {
        backgroundGradientFrom: cores.branco,
        backgroundGradientTo: cores.branco,
        color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.6,
        decimalPlaces: 0,
        labelColor: (opacity = 1) => cores.texto,
        fillShadowGradient: `rgba(46, 204, 113, 1)`,
        fillShadowGradientOpacity: 1,
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Subtexto style={styles.subtexto}>Dashboard de Produção</Subtexto>

            {/* --- Filtros (Botão removido) --- */}
            <View style={styles.filtroContainer}>
                 <View style={styles.linhaFiltro}>
                    <Selector 
                        label="Ano" 
                        options={anoOptions} 
                        onSelect={setAno} 
                        placeholder="Todos os Anos" 
                        style={styles.filtroPequeno} 
                    />
                    <Selector 
                        label="Estação" 
                        options={estacaoOptions} 
                        onSelect={setEstacao} 
                        placeholder="Todas" 
                        style={styles.filtroPequeno} 
                    />
                </View>
            </View>

            {/* --- Cards e Gráficos --- */}
            <GraficoCard
                subtexto={`Dados visualizados: ${ano === '' ? 'Todos os Anos' : ano} ${estacao ? '- ' + estacao : ''}`}
                kpis={kpisCalculados}
                showSideBar={true}
            >
                {/* Gráfico de Linha */}
                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Produção Mensal (kg)</Text>
                    <LineChart
                        data={dataLinha}
                        width={screenWidth - 60}
                        height={220}
                        chartConfig={chartConfig}
                        bezier
                        style={styles.chartStyle}
                    />
                </View>

                {/* Gráfico de Barras */}
                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Saúde das Colmeias</Text>
                    <BarChart
                        data={dataBarra}
                        width={screenWidth - 60}
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix=""
                        chartConfig={{
                            ...chartConfig,
                            color: (opacity = 1) => `rgba(241, 196, 15, ${opacity})`,
                        }}
                        style={styles.chartStyle}
                        showValuesOnTopOfBars
                        fromZero
                    />
                </View>
            </GraficoCard>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.fundo },
    contentContainer: { padding: layout.espacamento.amigavel, gap: layout.espacamento.colega, overflow: 'visible' },
    subtexto: { width: '100%', textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: cores.texto },
    
    filtroContainer: { marginBottom: layout.espacamento.amigavel, zIndex: 100, elevation: 10 },
    linhaFiltro: { flexDirection: 'row', justifyContent: 'space-between', gap: layout.espacamento.texto, zIndex: 200, elevation: 20 },
    filtroPequeno: { flex: 1, backgroundColor: cores.branco },
    
    chartContainer: { marginTop: layout.espacamento.amigavel, alignItems: 'center', zIndex: -1 },
    chartTitle: { fontSize: 16, fontWeight: 'bold', color: cores.texto, marginBottom: 10 },
    chartStyle: { borderRadius: 16 },
});