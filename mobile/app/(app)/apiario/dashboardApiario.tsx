import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit'; 
import Selector from '@/components/selector';
import GraficoCard from '@/components/graficoCard';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import Subtexto from '@/components/subTexto';

const screenWidth = Dimensions.get('window').width;

export default function DashboardApiarios() {
    const [ano, setAno] = useState('');

    // Dados Mockados Dinâmicos
    const apiariosData = [
        { nome: 'Rosa do Sertão', cidade: 'Pombal', colmeias: 15, ano: '2025', mesIndex: 0 },
        { nome: 'Vale das Abelhas', cidade: 'Sousa', colmeias: 22, ano: '2024', mesIndex: 5 },
        { nome: 'Bees Caatinga', cidade: 'Pombal', colmeias: 10, ano: '2025', mesIndex: 8 },
    ];

    const filtrados = useMemo(() => {
        return apiariosData.filter(d => ano === '' || d.ano === ano);
    }, [ano]);

    // Gráfico de Pizza: Apiários por Cidade
    const dataCidade = useMemo(() => {
        const cidades = filtrados.reduce((acc: any, curr) => {
            acc[curr.cidade] = (acc[curr.cidade] || 0) + 1;
            return acc;
        }, {});

        return Object.keys(cidades).map((c, i) => ({
            name: c,
            population: cidades[c],
            color: [cores.verde, '#f1c40f', '#e74c3c'][i % 3],
            legendFontColor: cores.texto,
            legendFontSize: 12,
        }));
    }, [filtrados]);

    // Gráfico de Barras: Colmeias por Apiário
    const dataColmeias = useMemo(() => ({
        labels: filtrados.map(a => a.nome.split(' ')[0]), // Pega o primeiro nome
        datasets: [{ data: filtrados.map(a => a.colmeias) }]
    }), [filtrados]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Subtexto style={{ textAlign: 'center' }}>Dashboard de Apiários</Subtexto>

            <View style={{ zIndex: 100 }}>
                <Selector 
                    label="Ano de Referência" 
                    options={[{label: 'Todos', value: ''}, {label: '2025', value: '2025'}, {label: '2024', value: '2024'}]} 
                    onSelect={setAno} 
                />
            </View>

            <GraficoCard
                subtexto={`Visualizando: ${ano || 'Histórico Completo'}`}
                kpis={[
                    { label: 'Total Apiários', value: filtrados.length.toString() },
                    { label: 'Total Colmeias', value: filtrados.reduce((a,b) => a + b.colmeias, 0).toString() }
                ]}
                showSideBar={true}
            >
                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Distribuição por Cidade</Text>
                    <PieChart
                        data={dataCidade}
                        width={screenWidth - 60}
                        height={200}
                        accessor={"population"}
                        backgroundColor={"transparent"}
                        paddingLeft={"15"}
                        absolute
                        chartConfig={{ color: () => cores.texto }}
                    />
                </View>

                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Colmeias por Apiário</Text>
                    <BarChart
                        data={dataColmeias}
                        width={screenWidth - 60}
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix=""
                        fromZero
                        chartConfig={{
                            backgroundGradientFrom: cores.branco,
                            backgroundGradientTo: cores.branco,
                            color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
                            labelColor: () => cores.texto,
                        }}
                        style={{ borderRadius: 16 }}
                    />
                </View>
            </GraficoCard>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.fundo },
    contentContainer: { padding: layout.espacamento.amigavel, gap: 20 },
    chartContainer: { marginTop: 20, alignItems: 'center', backgroundColor: cores.branco, borderRadius: 16, padding: 15, elevation: 3 },
    chartTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: cores.texto }
});