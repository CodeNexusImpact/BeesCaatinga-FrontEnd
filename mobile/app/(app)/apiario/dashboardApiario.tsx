import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  useWindowDimensions, // Essencial para responsividade Web/Mobile
  Platform 
} from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit'; 
import Selector from '@/components/selector';
import GraficoCard from '@/components/graficoCard';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import Subtexto from '@/components/subTexto';
import { Stack } from 'expo-router';

export default function DashboardApiario() {
    const [ano, setAno] = useState('');
    const { width } = useWindowDimensions(); // Detecta a largura da tela em tempo real

    // Ajuste dinâmico de largura para ser responsivo
    const chartWidth = width > 600 ? width * 0.4 : width - 60;

    // Dados baseados na sua interface
    const apiariosData = [
        { nome: 'Rosa do Sertão', cidade: 'Pombal', colmeias: 15, ano: '2025' },
        { nome: 'Vale das Abelhas', cidade: 'Sousa', colmeias: 22, ano: '2024' },
        { nome: 'Bees Caatinga', cidade: 'Pombal', colmeias: 10, ano: '2025' },
    ];

    const filtrados = useMemo(() => {
        return apiariosData.filter(d => ano === '' || d.ano === ano);
    }, [ano]);

    const dataCidade = useMemo(() => {
        const cidades = filtrados.reduce((acc: any, curr) => {
            acc[curr.cidade] = (acc[curr.cidade] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(cidades).map((c, i) => ({
            name: c,
            population: cidades[c],
            color: ['#2ecc71', '#f1c40f', '#3498db'][i % 3],
            legendFontColor: cores.texto,
            legendFontSize: width > 600 ? 14 : 11, // Fonte menor no mobile
        }));
    }, [filtrados, width]);

    const chartConfig = {
        backgroundGradientFrom: cores.branco,
        backgroundGradientTo: cores.branco,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: () => cores.texto,
        // Reduz o tamanho da fonte das etiquetas para mobile
        propsForLabels: {
            fontSize: width > 600 ? 12 : 10,
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Stack.Screen options={{ title: 'Dashboard' }} />
            
            {/* Título com tamanho adaptável */}
            <Text style={[styles.mainTitle, { fontSize: width > 600 ? 24 : 18 }]}>
                Dashboard de Apiários
            </Text>

            <View style={styles.filterContainer}>
                <Selector 
                    label="Ano de Referência" 
                    options={[{label: 'Todos', value: ''}, {label: '2025', value: '2025'}]} 
                    onSelect={setAno} 
                />
            </View>

            <GraficoCard
                subtexto={`Visualizando: ${ano || 'Histórico Completo'}`}
                kpis={[
                    { label: 'Total Apiários', value: filtrados.length.toString() },
                    { label: 'Total Colmeias', value: filtrados.reduce((a,b) => a + b.colmeias, 0).toString() }
                ]}
                showSideBar={width > 600} // Esconde a barra lateral no mobile para ganhar espaço
            >
                {/* Container flexível para alinhar lado a lado no Web ou empilhado no Mobile */}
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
                                labels: filtrados.map(a => a.nome.substring(0, 6)), // Abrevia nomes longos
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
            </GraficoCard>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.fundo },
    content: { padding: '4%', gap: 15 },
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
    chartStyle: { borderRadius: 12 }
});