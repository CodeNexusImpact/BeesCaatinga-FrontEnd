import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit'; 
import Selector from '@/components/formulario/selector';
import Botao from '@/components/formulario/botao';
import GraficoCard, { KpiData } from '@/components/graficoCard';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { Stack } from 'expo-router';

// --- DADOS MOCKADOS (Base de Dados Local) ---
// Simulando uma resposta de API com vários registros
const MASTER_DATA = [
    { id: 1, ano: '2025', mes: 'Jan', mesIndex: 0, tipo: 'nativas', apiario: 'apiario_a', volume: 50 },
    { id: 2, ano: '2025', mes: 'Fev', mesIndex: 1, tipo: 'nativas', apiario: 'apiario_a', volume: 60 },
    { id: 3, ano: '2025', mes: 'Mar', mesIndex: 2, tipo: 'africanizadas', apiario: 'apiario_b', volume: 120 },
    { id: 4, ano: '2025', mes: 'Abr', mesIndex: 3, tipo: 'italianas', apiario: 'apiario_a', volume: 80 },
    { id: 5, ano: '2025', mes: 'Jan', mesIndex: 0, tipo: 'africanizadas', apiario: 'apiario_b', volume: 100 },
    { id: 6, ano: '2025', mes: 'Fev', mesIndex: 1, tipo: 'italianas', apiario: 'apiario_b', volume: 90 },
    
    { id: 7, ano: '2024', mes: 'Jan', mesIndex: 0, tipo: 'nativas', apiario: 'apiario_a', volume: 40 },
    { id: 8, ano: '2024', mes: 'Fev', mesIndex: 1, tipo: 'nativas', apiario: 'apiario_b', volume: 45 },
    { id: 9, ano: '2024', mes: 'Mar', mesIndex: 2, tipo: 'africanizadas', apiario: 'apiario_a', volume: 150 },
    { id: 10, ano: '2024', mes: 'Abr', mesIndex: 3, tipo: 'italianas', apiario: 'apiario_b', volume: 70 },
];

// --- Opções de Filtro ---
const anoOptions = [
    { label: 'Todos os Anos', value: '' }, 
    { label: '2025', value: '2025' }, 
    { label: '2024', value: '2024' },
];

const tipoAbelhasOptions = [
    { label: 'Todas as Espécies', value: '' }, // Valor vazio = Todos
    { label: 'Nativas', value: 'nativas' },
    { label: 'Africanizadas', value: 'africanizadas' },
    { label: 'Italianas', value: 'italianas' },
];
const apiarioOptions = [
    { label: 'Todos os Apiários', value: '' },
    { label: 'Apiário A', value: 'apiario_a' },
    { label: 'Apiário B', value: 'apiario_b' },
];

const screenWidth = Dimensions.get('window').width;

export default function DashboardRastreabilidade() {
    const [ano, setAno] = useState('2025'); // Valor padrão
    const [tipoAbelha, setTipoAbelha] = useState('');
    const [apiario, setApiario] = useState('');

    // --- LÓGICA DE FILTRAGEM DINÂMICA ---
    // Recalcula os dados sempre que os filtros (states) mudarem
    const dadosFiltrados = useMemo(() => {
        return MASTER_DATA.filter(item => {
            const filtroAno = item.ano === ano;
            const filtroTipo = tipoAbelha === '' ? true : item.tipo === tipoAbelha;
            const filtroApiario = apiario === '' ? true : item.apiario === apiario;
            return filtroAno && filtroTipo && filtroApiario;
        });
    }, [ano, tipoAbelha, apiario]);

    // --- CÁLCULO DOS KPIs ---
    const kpisCalculados: KpiData[] = useMemo(() => {
        const totalVolume = dadosFiltrados.reduce((acc, curr) => acc + curr.volume, 0);
        const totalLotes = dadosFiltrados.length;
        // Simulando conformidade aleatória baseada no volume só pra variar
        const conformidade = totalLotes > 0 ? (95 + (totalLotes % 5)).toString() : '0'; 

        return [
            { label: 'Lotes Rastreados', value: totalLotes.toString() },
            { label: 'Volume Total (kg)', value: totalVolume.toString() },
            { label: 'Conformidade (%)', value: `${conformidade}%` },
            { label: 'Origens Distintas', value: apiario === '' ? '2' : '1' },
        ];
    }, [dadosFiltrados, apiario]);

    // --- PREPARAÇÃO DADOS GRÁFICO DE LINHA (Soma por mês) ---
    const dataLinha = useMemo(() => {
        // Inicializa array de 0 a 4 (Jan a Mai por exemplo)
        const volumesPorMes = [0, 0, 0, 0, 0]; 
        const labels = ["Jan", "Fev", "Mar", "Abr", "Mai"];

        dadosFiltrados.forEach(item => {
            if (item.mesIndex < 5) {
                volumesPorMes[item.mesIndex] += item.volume;
            }
        });

        return {
            labels: labels,
            datasets: [{ data: volumesPorMes }]
        };
    }, [dadosFiltrados]);

    // --- PREPARAÇÃO DADOS GRÁFICO DE PIZZA (Distribuição por Tipo) ---
    const dataPizza = useMemo(() => {
        const agrupaPorTipo = (tipo: string) => dadosFiltrados.filter(d => d.tipo === tipo).length;

        return [
            { name: 'Nativas', population: agrupaPorTipo('nativas'), color: '#F1C40F', legendFontColor: '#7F7F7F', legendFontSize: 12 },
            { name: 'African.', population: agrupaPorTipo('africanizadas'), color: '#E67E22', legendFontColor: '#7F7F7F', legendFontSize: 12 },
            { name: 'Italianas', population: agrupaPorTipo('italianas'), color: '#2ECC71', legendFontColor: '#7F7F7F', legendFontSize: 12 },
        ].filter(item => item.population > 0); // Remove fatias zeradas
    }, [dadosFiltrados]);


    // Configuração visual dos gráficos
    const chartConfig = {
        backgroundGradientFrom: cores.branco,
        backgroundGradientTo: cores.branco,
        color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.5,
        decimalPlaces: 0,
        labelColor: (opacity = 1) => cores.texto,
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Stack.Screen options={{ title: 'Dashboard' }} />

            <Subtexto style={styles.subtexto}>Rastreabilidade: Visão Geral</Subtexto>

            {/* --- Área de Filtros --- */}
            <View style={styles.filtroContainer}>
                 <View style={styles.linhaFiltro}>
                    <Selector label="Ano" options={anoOptions} onSelect={setAno} placeholder="2025" style={styles.filtroPequeno} />
                    <Selector label="Tipo" options={tipoAbelhasOptions} onSelect={setTipoAbelha} placeholder="Todos" style={styles.filtroPequeno} />
                </View>
                <View style={[styles.linhaFiltro, { marginTop: 10, zIndex: 90 }]}>
                    <Selector label="Apiário" options={apiarioOptions} onSelect={setApiario} placeholder="Todos" style={styles.filtroGrande} />
                </View>
            </View>

            {/* --- Cards de KPI e Gráficos --- */}
            <GraficoCard
                subtexto="Dados atualizados em tempo real conforme filtros."
                kpis={kpisCalculados}
                showSideBar={true}
            >
                {/* Gráfico de Linha */}
                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Volume Mensal (kg) - {ano}</Text>
                    <LineChart
                        data={dataLinha}
                        width={screenWidth - 60}
                        height={220}
                        chartConfig={chartConfig}
                        bezier
                        style={styles.chartStyle}
                    />
                </View>

                {/* Gráfico de Pizza */}
                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Distribuição das Espécies Selecionadas</Text>
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
                        <Text style={{marginTop: 20, color: '#999'}}>Nenhum dado para exibir com estes filtros.</Text>
                    )}
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
    filtroGrande: { flex: 1, backgroundColor: cores.branco },
    chartContainer: { marginTop: layout.espacamento.amigavel, alignItems: 'center', zIndex: -1 },
    chartTitle: { fontSize: 16, fontWeight: 'bold', color: cores.texto, marginBottom: 10 },
    chartStyle: { borderRadius: 16 },
});