import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit'; 
import Selector from '@/components/selector';
import GraficoCard, { KpiData } from '@/components/graficoCard';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { Stack, useFocusEffect } from 'expo-router';
import { getKpisVistorias, getGraficosVistorias } from '@/services/vistoriaService';
import { useAuth } from '@/hooks/useAuth';

const screenWidth = Dimensions.get('window').width;

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

export default function DashboardVistoria() {
    const { session } = useAuth();
    const produtorId = session || 1;

    const [anoSelecionado, setAnoSelecionado] = useState('');
    const [statusSelecionado, setStatusSelecionado] = useState('');
    const [loading, setLoading] = useState(true);
    const [kpis, setKpis] = useState<KpiData[]>([]);
    const [pizzaData, setPizzaData] = useState<any[]>([]);
    const [lineData, setLineData] = useState<any>(null);

    const carregarDados = useCallback(async () => {
        try {
            setLoading(true);
            
            const [novosKpis, novosGraficos] = await Promise.all([
                getKpisVistorias(produtorId, anoSelecionado, statusSelecionado),
                getGraficosVistorias(produtorId, anoSelecionado, statusSelecionado)
            ]);

            setKpis(novosKpis);
            setPizzaData(novosGraficos.pizzaData);
            setLineData(novosGraficos.lineData);
        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
        } finally {
            setLoading(false);
        }
    }, [produtorId, anoSelecionado, statusSelecionado]);

    useFocusEffect(
        useCallback(() => {
            carregarDados();
        }, [carregarDados])
    );

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
            <Subtexto style={styles.subtexto}>Dashboard de Vistorias</Subtexto>

            <View style={styles.filtroContainer}>
                 <View style={styles.linhaFiltro}>
                    <Selector 
                        label="Ano" 
                        options={anoOptions} 
                        onSelect={setAnoSelecionado} 
                        placeholder="Todos" 
                        style={styles.filtroPequeno} 
                        value={anoSelecionado}
                    />
                    <Selector 
                        label="Status" 
                        options={statusOptions} 
                        onSelect={setStatusSelecionado} 
                        placeholder="Todos" 
                        style={styles.filtroPequeno} 
                        value={statusSelecionado}
                    />
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={cores.primaria} />
            ) : (
                <GraficoCard
                    subtexto={`Análise de ${anoSelecionado === '' ? 'Todos os Anos' : anoSelecionado}`}
                    kpis={kpis}
                    showSideBar={true}
                >
                    <View style={styles.chartContainer}>
                        <Text style={styles.chartTitle}>Diagnóstico das Colmeias</Text>
                        {pizzaData.length > 0 ? (
                            <PieChart
                                data={pizzaData}
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

                    <View style={styles.chartContainer}>
                        <Text style={styles.chartTitle}>Evolução das Vistorias</Text>
                        {lineData && lineData.datasets[0].data.length > 0 && lineData.labels[0] !== 'Sem dados' ? (
                            <LineChart
                                data={lineData}
                                width={screenWidth - 60}
                                height={220}
                                chartConfig={chartConfig}
                                bezier
                                style={styles.chartStyle}
                            />
                        ) : (
                            <Text style={{textAlign: 'center', marginTop: 20, color: '#999'}}>Sem dados suficientes.</Text>
                        )}
                    </View>
                </GraficoCard>
            )}
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