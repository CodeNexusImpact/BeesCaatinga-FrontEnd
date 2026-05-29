import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import Selector from '@/components/selector';
import GraficoCard from '@/components/graficoCard';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { useAuth } from '@/hooks/useAuth';
import { listarColmeiasPorProdutor } from '@/services/colmeiaService';
import { getKpisVistorias } from '@/services/vistoriaService';

const screenWidth = Dimensions.get('window').width;

export default function DashboardColmeias() {
    const { user } = useAuth();
    const [ano, setAno] = useState('');
    const [colmeias, setColmeias] = useState<any[]>([]);
    const [vistoriasKpis, setVistoriasKpis] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDados = async () => {
            if (!user?.id) return;
            try {
                setLoading(true);
                const [dataColmeias, dataKpis] = await Promise.all([
                    listarColmeiasPorProdutor(user.id),
                    getKpisVistorias(user.id)
                ]);
                setColmeias(dataColmeias);
                setVistoriasKpis(dataKpis);
            } catch (error) {
                console.error('Erro ao buscar dados para dashboard de colmeias:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDados();
    }, [user?.id]);

    const filtradas = useMemo(() => {
        return colmeias.filter(c => {
            const anoCriacao = c.dataCriacao ? new Date(c.dataCriacao).getFullYear().toString() : '';
            return ano === '' || anoCriacao === ano;
        });
    }, [colmeias, ano]);

    const anoOptions = useMemo(() => {
        const anos = Array.from(new Set(colmeias.map(c => c.dataCriacao ? new Date(c.dataCriacao).getFullYear().toString() : '').filter(a => a !== ''))).sort().reverse();
        return [{ label: 'Todos os Anos', value: '' }, ...anos.map(a => ({ label: a, value: a }))];
    }, [colmeias]);

    // Configuração base para os gráficos
    const chartConfig = {
        backgroundGradientFrom: cores.branco,
        backgroundGradientTo: cores.branco,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, 
        labelColor: (opacity = 1) => cores.texto,
        barPercentage: 0.7,
        propsForBackgroundLines: {
            strokeDasharray: "", 
            strokeWidth: 1,
            stroke: "#e3e3e3"
        }
    };

    const dataBarra = useMemo(() => {
        // Mapeando KPIs de vistorias para o gráfico
        const saudaveis = Number(vistoriasKpis.find(k => k.label === 'Colmeias Saudáveis')?.value || 0);
        const criticas = Number(vistoriasKpis.find(k => k.label === 'Situação Crítica')?.value || 0);
        const total = Number(vistoriasKpis.find(k => k.label === 'Vistorias Realizadas')?.value || 0);
        const atencao = Math.max(0, total - saudaveis - criticas);

        return {
            labels: ["Saudável", "Atenção", "Crítica"],
            datasets: [
                {
                    data: [saudaveis, atencao, criticas],
                    colors: [
                        (opacity = 1) => `#2ecc71`, 
                        (opacity = 1) => `#f1c40f`, 
                        (opacity = 1) => `#e74c3c`, 
                    ]
                }
            ]
        };
    }, [vistoriasKpis]);

    const dataPizza = useMemo(() => {
        const tipos = filtradas.reduce((acc: any, curr) => {
            acc[curr.tipoColmeia] = (acc[curr.tipoColmeia] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(tipos).map((t, i) => ({
            name: t,
            population: tipos[t],
            color: ['#8d6e63', '#90a4ae', '#4fc3f7', '#aed581'][i % 4],
            legendFontColor: cores.texto,
            legendFontSize: 12
        }));
    }, [filtradas]);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={cores.primaria[100]} />
                <Text>Carregando Dashboard...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={{ zIndex: 100 }}>
                <Selector
                    label="Filtrar por Ano"
                    options={anoOptions}
                    onSelect={setAno}
                    value={ano}
                />
            </View>

            <GraficoCard
                subtexto={`Análise: Todos os Apiários (${ano || 'Todos os Anos'})`}
                kpis={[
                    { label: 'Total Colmeias', value: filtradas.length.toString() },
                    { label: 'Colmeias Ativas', value: filtradas.filter(c => c.ativa).length.toString() }
                ]}
                showSideBar={true}
            >
                {filtradas.length === 0 ? (
                    <Text style={styles.emptyText}>Nenhuma colmeia encontrada.</Text>
                ) : (
                    <>
                        <View style={styles.chartContainer}>
                            <Text style={styles.chartTitle}>Saúde Geral das Colmeias</Text>
                            <BarChart
                                data={dataBarra as any}
                                width={screenWidth - 60}
                                height={220}
                                yAxisLabel=""
                                yAxisSuffix=""
                                chartConfig={chartConfig}
                                style={{
                                    borderRadius: 16,
                                    marginVertical: 8,
                                }}
                                fromZero
                                showValuesOnTopOfBars
                                withCustomBarColorFromData={true}
                                flatColor={true}
                            />
                        </View>

                        <View style={styles.chartContainer}>
                            <Text style={styles.chartTitle}>Distribuição por Material</Text>
                            <PieChart
                                data={dataPizza}
                                width={screenWidth - 60}
                                height={200}
                                chartConfig={chartConfig}
                                accessor={"population"}
                                backgroundColor={"transparent"}
                                paddingLeft={"15"}
                                absolute
                            />
                        </View>
                    </>
                )}
            </GraficoCard>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.fundo },
    contentContainer: { padding: layout.espacamento.amigavel, gap: 20 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    chartContainer: {
        marginTop: 20,
        alignItems: 'center',
        backgroundColor: cores.branco,
        borderRadius: 16,
        padding: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
    },
    chartTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: cores.texto },
    emptyText: { textAlign: 'center', padding: 20, color: '#888' }
});