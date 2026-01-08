import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit'; 
import Selector from '@/components/selector';
import GraficoCard from '@/components/graficoCard';
import cores from '@/constants/cores';
import layout from '@/constants/layout';

const screenWidth = Dimensions.get('window').width;

export default function DashboardColmeias() {
    const [ano, setAno] = useState('');

    // Configuração base para os gráficos
    const chartConfig = {
        backgroundGradientFrom: cores.branco,
        backgroundGradientTo: cores.branco,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Cor dos rótulos/eixos
        labelColor: (opacity = 1) => cores.texto,
        barPercentage: 0.7,
        propsForBackgroundLines: {
            strokeDasharray: "", // Linhas sólidas de fundo
            strokeWidth: 1,
            stroke: "#e3e3e3"
        }
    };

    // Dados do BarChart corrigidos com cores semânticas (Imagem 82e828)
    const dataBarra = {
        labels: ["Saudável", "Atenção", "Crítica"],
        datasets: [
            {
                data: [4, 1, 1],
                // Cores individuais para cada barra conforme o padrão visual
                colors: [
                    (opacity = 1) => `#2ecc71`, // Verde
                    (opacity = 1) => `#f1c40f`, // Amarelo
                    (opacity = 1) => `#e74c3c`, // Vermelho
                ]
            }
        ]
    };

    // Dados do PieChart com o padrão de material (Imagem 82d84c)
    const dataPizza = [
        { name: 'Madeira', population: 3, color: '#8d6e63', legendFontColor: cores.texto, legendFontSize: 12 },
        { name: 'Concreto', population: 2, color: '#90a4ae', legendFontColor: cores.texto, legendFontSize: 12 },
        { name: 'Poli', population: 1, color: '#4fc3f7', legendFontColor: cores.texto, legendFontSize: 12 },
    ];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={{ zIndex: 100 }}>
                <Selector 
                    label="Filtrar por Ano" 
                    options={[{label: '2025', value: '2025'}, {label: '2024', value: '2024'}]} 
                    onSelect={setAno} 
                />
            </View>

            <GraficoCard
                subtexto={`Análise: Todos os Apiários (${ano || 'Todos os Anos'})`}
                kpis={[
                    { label: 'Tipo Madeira', value: '3' },
                    { label: 'Alertas', value: '2' }
                ]}
                showSideBar={true}
            >
                {/* Gráfico de Barras com Cores Corrigidas */}
                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Saúde Geral das Colmeias</Text>
                    <BarChart
                        data={dataBarra}
                        width={screenWidth - 60}
                        height={220}
                        chartConfig={chartConfig}
                        style={{
                            borderRadius: 16,
                            marginVertical: 8,
                        }}
                        fromZero
                        showValuesOnTopOfBars
                        withCustomBarColorFromData={true} // ESSENCIAL para as cores funcionarem
                        flatColor={true}
                    />
                </View>

                {/* Gráfico de Pizza */}
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
            </GraficoCard>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.fundo },
    contentContainer: { padding: layout.espacamento.amigavel, gap: 20 },
    chartContainer: { 
        marginTop: 20, 
        alignItems: 'center',
        backgroundColor: cores.branco,
        borderRadius: 16,
        padding: 10,
        // Sombra leve para destacar os gráficos
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
    },
    chartTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: cores.texto }
});