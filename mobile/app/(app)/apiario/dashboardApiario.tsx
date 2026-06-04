import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  useWindowDimensions, // Essencial para responsividade Web/Mobile
  Platform,
  ActivityIndicator
} from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit'; 
import Selector from '@/components/formulario/selector';
import GraficoCard from '@/components/graficoCard';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import Subtexto from '@/components/subTexto';
import { Stack } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { listarApiariosPorProdutor } from '@/services/apiarioService';

export default function DashboardApiario() {
    const { user } = useAuth();
    const [ano, setAno] = useState('');
    const [apiarios, setApiarios] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { width } = useWindowDimensions(); 

    // Ajuste dinâmico de largura para ser responsivo
    const chartWidth = width > 600 ? width * 0.4 : width - 60;

    useEffect(() => {
        const fetchApiarios = async () => {
            if (!user?.id) return;
            try {
                setLoading(true);
                const data = await listarApiariosPorProdutor(user.id);
                const processados = data.map(a => ({
                    nome: a.nome,
                    cidade: a.cidade,
                    colmeias: a.colmeias ? a.colmeias.length : 0,
                    ano: a.dataDeCriacao ? new Date(a.dataDeCriacao).getFullYear().toString() : ''
                }));
                setApiarios(processados);
            } catch (error) {
                console.error('Erro ao buscar dados para dashboard de apiários:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchApiarios();
    }, [user?.id]);

    const filtrados = useMemo(() => {
        return apiarios.filter(d => ano === '' || d.ano === ano);
    }, [apiarios, ano]);

    const anoOptions = useMemo(() => {
        const anos = Array.from(new Set(apiarios.map(a => a.ano).filter(a => a !== ''))).sort().reverse();
        return [{ label: 'Todos', value: '' }, ...anos.map(a => ({ label: a, value: a }))];
    }, [apiarios]);

    const dataCidade = useMemo(() => {
        const cidades = filtrados.reduce((acc: any, curr) => {
            acc[curr.cidade] = (acc[curr.cidade] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(cidades).map((c, i) => ({
            name: c,
            population: cidades[c],
            color: ['#2ecc71', '#f1c40f', '#3498db', '#e67e22', '#9b59b6'][i % 5],
            legendFontColor: cores.texto,
            legendFontSize: width > 600 ? 14 : 11, 
        }));
    }, [filtrados, width]);

    const chartConfig = {
        backgroundGradientFrom: cores.branco,
        backgroundGradientTo: cores.branco,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: () => cores.texto,
        propsForLabels: {
            fontSize: width > 600 ? 12 : 10,
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={cores.primaria[100]} />
                <Text>Carregando Dashboard...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Stack.Screen options={{ title: 'Dashboard' }} />
            
            <Text style={[styles.mainTitle, { fontSize: width > 600 ? 24 : 18 }]}>
                Dashboard de Apiários
            </Text>

            <View style={styles.filterContainer}>
                <Selector 
                    label="Ano de Referência" 
                    options={anoOptions} 
                    onSelect={setAno} 
                    value={ano}
                />
            </View>

            <GraficoCard
                subtexto={`Visualizando: ${ano || 'Histórico Completo'}`}
                kpis={[
                    { label: 'Total Apiários', value: filtrados.length.toString() },
                    { label: 'Total Colmeias', value: filtrados.reduce((a,b) => a + b.colmeias, 0).toString() }
                ]}
                showSideBar={width > 600} 
            >
                {filtrados.length === 0 ? (
                    <Text style={styles.emptyText}>Nenhum dado encontrado para o período.</Text>
                ) : (
                    <View style={[styles.chartsWrapper, { flexDirection: width > 800 ? 'row' : 'column' }]}>
                        
                        <View style={styles.chartBox}>
                            <Text style={styles.chartTitle}>Distribuição por Cidade</Text>
                            <PieChart
                                data={dataCidade}
                                width={chartWidth}
                                height={200}
                                accessor={"population"}
                                backgroundColor={"transparent"}
                                paddingLeft={"15"}
                                absolute
                                chartConfig={chartConfig}
                            />
                        </View>

                        <View style={styles.chartBox}>
                            <Text style={styles.chartTitle}>Capacidade por Apiário</Text>
                            <BarChart
                                data={{
                                    labels: filtrados.map(a => a.nome.substring(0, 6)), 
                                    datasets: [{ data: filtrados.map(a => a.colmeias) }]
                                }}
                                width={chartWidth}
                                height={220}
                                yAxisLabel=""
                                yAxisSuffix=""
                                fromZero
                                chartConfig={chartConfig}
                                style={styles.chartStyle}
                                showValuesOnTopOfBars
                            />
                        </View>
                    </View>
                )}
            </GraficoCard>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.fundo },
    content: { padding: '4%', gap: 15 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    mainTitle: { fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: cores.texto },
    filterContainer: { zIndex: 100, marginBottom: 10 },
    chartsWrapper: { justifyContent: 'space-around', alignItems: 'center', gap: 20 },
    chartBox: { 
        alignItems: 'center', 
        backgroundColor: cores.branco, 
        borderRadius: 12, 
        padding: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        width: Platform.OS === 'web' ? '45%' : '100%' 
    },
    chartTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: cores.texto },
    chartStyle: { borderRadius: 12 },
    emptyText: { textAlign: 'center', padding: 20, color: '#888' }
});