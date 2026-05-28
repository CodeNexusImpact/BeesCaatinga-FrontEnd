import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit'; 
import GraficoCard, { KpiData } from '@/components/graficoCard';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { Stack, useFocusEffect } from 'expo-router';
import { getKpisInsumos, getGraficosInsumos } from '@/services/insumoService';
import { useAuth } from '@/hooks/useAuth';

const screenWidth = Dimensions.get('window').width;

export default function DashboardInsumos() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [kpis, setKpis] = useState<KpiData[]>([]);
    const [graficos, setGraficos] = useState<{ porTipo: any[], porStatus: any[] } | null>(null);

    /**
     * Carregamento dinâmico via Service Nomeado
     */
    const carregarDados = useCallback(async () => {
        if (!user?.id) return;
        
        try {
            setIsLoading(true);
            
            const [kpiData, chartData] = await Promise.all([
                getKpisInsumos(user.id),
                getGraficosInsumos(user.id)
            ]);

            setKpis([
                { label: 'Total Registros', value: kpiData.totalItens.toString() },
                { label: 'Estoque Baixo', value: kpiData.estoqueBaixo.toString() },
                { label: 'Em Uso', value: kpiData.emUso.toString() },
                { label: 'Disponíveis', value: (kpiData.totalItens - kpiData.emUso).toString() },
            ]);

            setGraficos(chartData);
        } catch (error) {
            console.error('❌ [DASHBOARD INSUMOS] Erro:', error);
            Alert.alert('Erro', 'Não foi possível carregar as estatísticas.');
        } finally {
            setIsLoading(false);
        }
    }, [user?.id]);

    useFocusEffect(
        useCallback(() => {
            carregarDados();
        }, [carregarDados])
    );

    const chartConfig = {
        backgroundGradientFrom: cores.branco,
        backgroundGradientTo: cores.branco,
        color: (opacity = 1) => `rgba(155, 89, 182, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.6,
        decimalPlaces: 0,
        labelColor: (opacity = 1) => cores.texto,
        fillShadowGradient: `rgba(155, 89, 182, 1)`,
        fillShadowGradientOpacity: 1,
    };

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={cores.primaria[100]} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Stack.Screen options={{ title: 'Estatísticas de Insumos' }} />
            <Subtexto style={styles.subtexto}>Estatísticas de Insumos</Subtexto>

            <GraficoCard
                subtexto="Visão Geral do Almoxarifado"
                kpis={kpis}
                showSideBar={true}
            >
                {/* Gráfico de Pizza (Categorias) */}
                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Categorias</Text>
                    {graficos?.porTipo && graficos.porTipo.length > 0 ? (
                        <PieChart
                            data={graficos.porTipo.map((t, index) => ({
                                name: t.name,
                                population: t.value,
                                color: ['#3498db', '#e67e22', '#2ecc71', '#95a5a6', '#f1c40f'][index % 5],
                                legendFontColor: '#7F7F7F',
                                legendFontSize: 12
                            }))}
                            width={screenWidth - 40}
                            height={220}
                            chartConfig={chartConfig}
                            accessor={"population"}
                            backgroundColor={"transparent"}
                            paddingLeft={"15"}
                            center={[10, 0]}
                            absolute
                            style={styles.chartStyle}
                        />
                    ) : (
                        <Text style={styles.emptyText}>Sem dados categorizados.</Text>
                    )}
                </View>

                {/* Gráfico de Barras (Status) */}
                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Situação por Status</Text>
                    {graficos?.porStatus && graficos.porStatus.length > 0 ? (
                        <BarChart
                            data={{
                                labels: graficos.porStatus.map(s => s.name),
                                datasets: [{ data: graficos.porStatus.map(s => s.value) }]
                            }}
                            width={screenWidth - 80}
                            height={220}
                            yAxisLabel=""
                            yAxisSuffix=""
                            chartConfig={chartConfig}
                            style={styles.chartStyle}
                            showValuesOnTopOfBars
                            fromZero
                        />
                    ) : (
                        <Text style={styles.emptyText}>Nenhum status para exibir.</Text>
                    )}
                </View>
            </GraficoCard>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.fundo },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    contentContainer: { padding: layout.espacamento.amigavel, gap: layout.espacamento.colega, paddingBottom: 50 },
    subtexto: { width: '100%', textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: cores.texto },
    chartContainer: { marginTop: layout.espacamento.amigavel, alignItems: 'center' },
    chartTitle: { fontSize: 16, fontWeight: 'bold', color: cores.texto, marginBottom: 10 },
    chartStyle: { borderRadius: 16 },
    emptyText: { textAlign: 'center', marginTop: 20, color: '#999', fontStyle: 'italic' },
});
