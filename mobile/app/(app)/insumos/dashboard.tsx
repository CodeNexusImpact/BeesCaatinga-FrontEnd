import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit'; 
import Selector from '@/components/selector';
import GraficoCard, { KpiData } from '@/components/graficoCard';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import layout from '@/constants/layout';

// --- DADOS MOCKADOS (Base de Dados Local) ---
const MASTER_DATA = [
    { ano: '2025', tipo: 'Equipamento', status: 'Disponível', qtd: 5 },
    { ano: '2025', tipo: 'Outro', status: 'Em uso', qtd: 100 },
    { ano: '2025', tipo: 'Alimentação', status: 'Estoque baixo', qtd: 10 },
    { ano: '2025', tipo: 'EPI', status: 'Disponível', qtd: 8 },
    { ano: '2025', tipo: 'Equipamento', status: 'Em uso', qtd: 3 },
    
    { ano: '2024', tipo: 'Equipamento', status: 'Disponível', qtd: 10 },
    { ano: '2024', tipo: 'Alimentação', status: 'Vencido', qtd: 5 },
    { ano: '2024', tipo: 'EPI', status: 'Em uso', qtd: 12 },
    { ano: '2024', tipo: 'Outro', status: 'Disponível', qtd: 50 },
];

const screenWidth = Dimensions.get('window').width;

// --- Opções de Filtro ---
const anoOptions = [
    { label: 'Todos os Anos', value: '' },
    { label: '2025', value: '2025' },
    { label: '2024', value: '2024' },
];

const tipoOptions = [
    { label: 'Todos os Tipos', value: '' },
    { label: 'Equipamento', value: 'Equipamento' },
    { label: 'Alimentação', value: 'Alimentação' },
    { label: 'EPI', value: 'EPI' },
    { label: 'Outro', value: 'Outro' },
];

export default function DashboardInsumos() {
    const [ano, setAno] = useState(''); // '' = Todos
    const [tipo, setTipo] = useState('');

    // --- 1. Lógica de Filtragem ---
    const dadosFiltrados = useMemo(() => {
        return MASTER_DATA.filter(item => {
            const filtroAno = ano === '' ? true : item.ano === ano;
            const filtroTipo = tipo === '' ? true : item.tipo === tipo;
            return filtroAno && filtroTipo;
        });
    }, [ano, tipo]);

    // --- 2. Cálculo dos KPIs ---
    const kpisCalculados: KpiData[] = useMemo(() => {
        const totalItens = dadosFiltrados.length; // Contagem de registros
        const estoqueBaixo = dadosFiltrados.filter(d => d.status === 'Estoque baixo').length;
        const emUso = dadosFiltrados.filter(d => d.status === 'Em uso').length;
        const disponiveis = dadosFiltrados.filter(d => d.status === 'Disponível').length;

        return [
            { label: 'Registros de Insumos', value: totalItens.toString() },
            { label: 'Disponíveis', value: disponiveis.toString() },
            { label: 'Em Uso', value: emUso.toString() },
            { label: 'Estoque Baixo', value: estoqueBaixo.toString() },
        ];
    }, [dadosFiltrados]);

    // --- 3. Gráfico de Pizza (Distribuição por Tipo) ---
    const dataPizza = useMemo(() => {
        const countTipo = (t: string) => dadosFiltrados.filter(d => d.tipo === t).length;
        
        const dados = [
            { name: 'Equip.', population: countTipo('Equipamento'), color: '#3498db', legendFontColor: '#7F7F7F', legendFontSize: 12 },
            { name: 'Alim.', population: countTipo('Alimentação'), color: '#e67e22', legendFontColor: '#7F7F7F', legendFontSize: 12 },
            { name: 'EPI', population: countTipo('EPI'), color: '#2ecc71', legendFontColor: '#7F7F7F', legendFontSize: 12 },
            { name: 'Outro', population: countTipo('Outro'), color: '#95a5a6', legendFontColor: '#7F7F7F', legendFontSize: 12 },
        ];
        return dados.filter(d => d.population > 0);
    }, [dadosFiltrados]);

    // --- 4. Gráfico de Barras (Status do Estoque) ---
    const dataBarra = useMemo(() => {
        const disponivel = dadosFiltrados.filter(d => d.status === 'Disponível').length;
        const emUso = dadosFiltrados.filter(d => d.status === 'Em uso').length;
        const baixo = dadosFiltrados.filter(d => d.status === 'Estoque baixo' || d.status === 'Vencido').length;

        return {
            labels: ["Disponível", "Em Uso", "Crítico"],
            datasets: [{ data: [disponivel, emUso, baixo] }]
        };
    }, [dadosFiltrados]);

    const chartConfig = {
        backgroundGradientFrom: cores.branco,
        backgroundGradientTo: cores.branco,
        color: (opacity = 1) => `rgba(155, 89, 182, ${opacity})`, // Roxo para insumos
        strokeWidth: 2,
        barPercentage: 0.6,
        decimalPlaces: 0,
        labelColor: (opacity = 1) => cores.texto,
        fillShadowGradient: `rgba(155, 89, 182, 1)`,
        fillShadowGradientOpacity: 1,
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Subtexto style={styles.subtexto}>Dashboard de Insumos</Subtexto>

            {/* --- Filtros --- */}
            <View style={styles.filtroContainer}>
                 <View style={styles.linhaFiltro}>
                    <Selector 
                        label="Ano Entrada" 
                        options={anoOptions} 
                        onSelect={setAno} 
                        placeholder="Todos" 
                        style={styles.filtroPequeno} 
                    />
                    <Selector 
                        label="Tipo Material" 
                        options={tipoOptions} 
                        onSelect={setTipo} 
                        placeholder="Todos" 
                        style={styles.filtroPequeno} 
                    />
                </View>
            </View>

            {/* --- KPIs e Gráficos --- */}
            <GraficoCard
                subtexto={`Panorama do Estoque: ${ano === '' ? 'Geral' : ano}`}
                kpis={kpisCalculados}
                showSideBar={true}
            >
                {/* Gráfico de Pizza */}
                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Categorias em Estoque</Text>
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
                        <Text style={{textAlign: 'center', marginTop: 20, color: '#999'}}>Sem dados.</Text>
                    )}
                </View>

                {/* Gráfico de Barras */}
                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Situação dos Itens</Text>
                    <BarChart
                        data={dataBarra}
                        width={screenWidth - 60}
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix=""
                        chartConfig={chartConfig}
                        style={styles.chartStyle}
                        showValuesOnTopOfBars
                        fromZero
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