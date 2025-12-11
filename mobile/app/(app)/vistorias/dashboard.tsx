import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit'; 
import Selector from '@/components/selector';
import GraficoCard, { KpiData } from '@/components/graficoCard';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import layout from '@/constants/layout';

// --- DADOS MOCKADOS (Base de Dados Local) ---
// Simulando vistorias com datas e diagnósticos
const MASTER_DATA = [
    { ano: '2025', mes: 'Ago', mesIndex: 7, status: 'Saudável', apiario: 'Apiário A' },
    { ano: '2025', mes: 'Ago', mesIndex: 7, status: 'Atenção', apiario: 'Apiário A' },
    { ano: '2025', mes: 'Set', mesIndex: 8, status: 'Saudável', apiario: 'Apiário B' },
    { ano: '2025', mes: 'Set', mesIndex: 8, status: 'Crítica', apiario: 'Apiário A' },
    { ano: '2025', mes: 'Out', mesIndex: 9, status: 'Saudável', apiario: 'Apiário B' },
    { ano: '2025', mes: 'Out', mesIndex: 9, status: 'Saudável', apiario: 'Apiário A' },
    
    { ano: '2024', mes: 'Ago', mesIndex: 7, status: 'Atenção', apiario: 'Apiário B' },
    { ano: '2024', mes: 'Set', mesIndex: 8, status: 'Crítica', apiario: 'Apiário A' },
    { ano: '2024', mes: 'Out', mesIndex: 9, status: 'Saudável', apiario: 'Apiário B' },
];

const screenWidth = Dimensions.get('window').width;

// --- Opções de Filtro ---
const anoOptions = [
    { label: 'Todos os Anos', value: '' },
    { label: '2025', value: '2025' },
    { label: '2024', value: '2024' },
];

const statusOptions = [
    { label: 'Todos os Status', value: '' },
    { label: 'Saudável', value: 'Saudável' },
    { label: 'Atenção', value: 'Atenção' },
    { label: 'Crítica', value: 'Crítica' },
];

export default function DashboardVistoria() {
    const [ano, setAno] = useState(''); // '' = Todos
    const [statusFiltro, setStatusFiltro] = useState('');

    // --- 1. Lógica de Filtragem ---
    const dadosFiltrados = useMemo(() => {
        return MASTER_DATA.filter(item => {
            const filtroAno = ano === '' ? true : item.ano === ano;
            const filtroStatus = statusFiltro === '' ? true : item.status === statusFiltro;
            return filtroAno && filtroStatus;
        });
    }, [ano, statusFiltro]);

    // --- 2. Cálculo dos KPIs ---
    const kpisCalculados: KpiData[] = useMemo(() => {
        const total = dadosFiltrados.length;
        const saudaveis = dadosFiltrados.filter(d => d.status === 'Saudável').length;
        const criticas = dadosFiltrados.filter(d => d.status === 'Crítica').length;
        // Simulação de taxa de ocupação
        const taxaOcupacao = total > 0 ? ((saudaveis / total) * 100).toFixed(0) : '0';

        return [
            { label: 'Vistorias Realizadas', value: total.toString() },
            { label: 'Colmeias Saudáveis', value: saudaveis.toString() },
            { label: 'Situação Crítica', value: criticas.toString() },
            { label: 'Saúde Geral (%)', value: `${taxaOcupacao}%` },
        ];
    }, [dadosFiltrados]);

    // --- 3. Gráfico de Pizza (Status) ---
    const dataPizza = useMemo(() => {
        const countStatus = (st: string) => dadosFiltrados.filter(d => d.status === st).length;
        
        const dados = [
            { name: 'Saudável', population: countStatus('Saudável'), color: '#2ecc71', legendFontColor: '#7F7F7F', legendFontSize: 12 },
            { name: 'Atenção', population: countStatus('Atenção'), color: '#f1c40f', legendFontColor: '#7F7F7F', legendFontSize: 12 },
            { name: 'Crítica', population: countStatus('Crítica'), color: '#e74c3c', legendFontColor: '#7F7F7F', legendFontSize: 12 },
        ];
        
        // Filtra para não mostrar fatias com 0
        return dados.filter(d => d.population > 0);
    }, [dadosFiltrados]);

    // --- 4. Gráfico de Linha (Vistorias por mês - recorte Ago/Set/Out) ---
    const dataLinha = useMemo(() => {
        const vistoriasPorMes = [0, 0, 0]; // Índices correspondentes a Ago, Set, Out na nossa lógica simplificada
        
        dadosFiltrados.forEach(item => {
            // Mapeando mesIndex 7, 8, 9 para array 0, 1, 2
            if (item.mesIndex >= 7 && item.mesIndex <= 9) {
                vistoriasPorMes[item.mesIndex - 7] += 1;
            }
        });

        return {
            labels: ["Ago", "Set", "Out"],
            datasets: [{ data: vistoriasPorMes }]
        };
    }, [dadosFiltrados]);

    const chartConfig = {
        backgroundGradientFrom: cores.branco,
        backgroundGradientTo: cores.branco,
        color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`, // Azul
        strokeWidth: 2,
        barPercentage: 0.5,
        decimalPlaces: 0,
        labelColor: (opacity = 1) => cores.texto,
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Subtexto style={styles.subtexto}>Dashboard de Vistorias</Subtexto>

            {/* --- Filtros --- */}
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
                        label="Status" 
                        options={statusOptions} 
                        onSelect={setStatusFiltro} 
                        placeholder="Todos os Status" 
                        style={styles.filtroPequeno} 
                    />
                </View>
            </View>

            {/* --- KPIs e Gráficos --- */}
            <GraficoCard
                subtexto={`Análise de ${ano === '' ? 'Todos os Anos' : ano}`}
                kpis={kpisCalculados}
                showSideBar={true}
            >
                {/* Gráfico de Pizza */}
                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Diagnóstico das Colmeias</Text>
                    {dataPizza.length > 0 ? (
                        <PieChart
                            data={dataPizza}
                            width={screenWidth - 20}
                            height={220}
                            chartConfig={chartConfig}
                            accessor={"population"}
                            backgroundColor={"transparent"}
                            paddingLeft={"15"}
                            center={[10, 0]}
                            absolute
                        />
                    ) : (
                        <Text style={{textAlign: 'center', marginTop: 20, color: '#999'}}>Sem dados para este filtro.</Text>
                    )}
                </View>

                {/* Gráfico de Linha */}
                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Evolução das Vistorias (Ago-Out)</Text>
                    <LineChart
                        data={dataLinha}
                        width={screenWidth - 60}
                        height={220}
                        chartConfig={chartConfig}
                        bezier
                        style={styles.chartStyle}
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