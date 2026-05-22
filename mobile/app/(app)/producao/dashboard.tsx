import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit'; 
import Selector from '@/components/selector';
import GraficoCard, { KpiData } from '@/components/graficoCard';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { Stack, useFocusEffect } from 'expo-router';
import { getProducao } from '@/services/producaoService';
import { useAuth } from '@/hooks/useAuth';
import type { ProducaoRetornoDTO } from '@/types/producao';

const screenWidth = Dimensions.get('window').width;

const anoOptions = [
    { label: 'Todos os Anos', value: '' }, 
    { label: '2025', value: '2025' },
    { label: '2024', value: '2024' },
    { label: '2026', value: '2026' },
];

const estacaoOptions = [
    { label: 'Todas as Estações', value: '' },
    { label: 'Verão', value: 'verao' },
    { label: 'Outono', value: 'outono' },
    { label: 'Inverno', value: 'inverno' },
    { label: 'Primavera', value: 'primavera' },
];

// Auxiliar para determinar a estação do ano no Brasil
const getEstacao = (dataStr: string) => {
    const data = new Date(dataStr + 'T00:00:00');
    const mes = data.getMonth() + 1;
    const dia = data.getDate();

    if ((mes === 12 && dia >= 21) || mes === 1 || mes === 2 || (mes === 3 && dia < 20)) return 'verao';
    if ((mes === 3 && dia >= 20) || mes === 4 || mes === 5 || (mes === 6 && dia < 21)) return 'outono';
    if ((mes === 6 && dia >= 21) || mes === 7 || mes === 8 || (mes === 9 && dia < 22)) return 'inverno';
    return 'primavera';
};

export default function Dashboard() {
    const { session } = useAuth();
    const [ano, setAno] = useState(''); 
    const [estacao, setEstacao] = useState('');
    const [producoes, setProducoes] = useState<ProducaoRetornoDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const carregarDados = useCallback(async () => {
        setIsLoading(true);
        try {
            const produtorId = session || '1';
            const data = await getProducao({ userId: produtorId, ano: ano || undefined });
            setProducoes(data);
        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
        } finally {
            setIsLoading(false);
        }
    }, [session, ano]);

    useFocusEffect(
        useCallback(() => {
            carregarDados();
        }, [carregarDados])
    );

    const dadosFiltrados = useMemo(() => {
        return producoes.filter(item => {
            const filtroEstacao = estacao === '' ? true : getEstacao(item.dataColeta) === estacao;
            return filtroEstacao;
        });
    }, [producoes, estacao]);

    const kpisCalculados: KpiData[] = useMemo(() => {
        const totalVolume = dadosFiltrados.reduce((acc, curr) => acc + curr.quantidade, 0);
        const qtdRegistros = dadosFiltrados.length;
        const media = qtdRegistros > 0 ? totalVolume / qtdRegistros : 0;

        return [
            { label: 'Produção Total (kg)', value: totalVolume.toFixed(1) },
            { label: 'Média Mensal (kg)', value: media.toFixed(1) },
            { label: 'Registros', value: qtdRegistros.toString() },
            { label: 'Status', value: qtdRegistros > 0 ? 'Ativo' : 'Sem dados' },
        ];
    }, [dadosFiltrados]);

    const dataLinha = useMemo(() => {
        const mesesLabels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        const volumes = new Array(12).fill(0);
        
        dadosFiltrados.forEach(item => {
            const data = new Date(item.dataColeta + 'T00:00:00');
            const mesIndex = data.getMonth();
            volumes[mesIndex] += item.quantidade;
        });

        return {
            labels: mesesLabels,
            datasets: [{ data: volumes }]
        };
    }, [dadosFiltrados]);

    const dataBarra = useMemo(() => {
        const aprovado = dadosFiltrados.filter(d => d.statusQualidade === 'APROVADO').length;
        const naoAvaliado = dadosFiltrados.filter(d => d.statusQualidade === 'NAO_AVALIADO').length;

        return {
            labels: ["Aprovado", "Não Avaliado"],
            datasets: [{ data: [aprovado, naoAvaliado] }]
        };
    }, [dadosFiltrados]);

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
        propsForLabels: {
            fontSize: 10
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Stack.Screen options={{ title: 'Dashboard' }} />
            <Subtexto style={styles.subtexto}>Dashboard de Produção</Subtexto>

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

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={cores.primaria} />
                </View>
            ) : (
                <GraficoCard
                    subtexto={`Dados visualizados: ${ano === '' ? 'Todos os Anos' : ano} ${estacao ? '- ' + estacao : ''}`}
                    kpis={kpisCalculados}
                    showSideBar={true}
                >
                    <View style={styles.chartContainer}>
                        <Text style={styles.chartTitle}>Produção Mensal (kg)</Text>
                        <LineChart
                            data={dataLinha}
                            width={screenWidth - 60}
                            height={220}
                            chartConfig={chartConfig}
                            bezier
                            style={styles.chartStyle}
                            formatXLabel={(label) => label}
                        />
                    </View>

                    <View style={styles.chartContainer}>
                        <Text style={styles.chartTitle}>Qualidade da Produção</Text>
                        <BarChart
                            data={dataBarra}
                            width={screenWidth - 60}
                            height={220}
                            yAxisLabel=""
                            yAxisSuffix=""
                            chartConfig={{
                                ...chartConfig,
                                color: (opacity = 1) => `rgba(241, 196, 15, ${opacity})`,
                                fillShadowGradient: `rgba(241, 196, 15, 1)`,
                            }}
                            style={styles.chartStyle}
                            showValuesOnTopOfBars
                            fromZero
                        />
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
    
    loadingContainer: { height: 300, justifyContent: 'center', alignItems: 'center' },
    chartContainer: { marginTop: layout.espacamento.amigavel, alignItems: 'center', zIndex: -1 },
    chartTitle: { fontSize: 16, fontWeight: 'bold', color: cores.texto, marginBottom: 10 },
    chartStyle: { borderRadius: 16 },
});