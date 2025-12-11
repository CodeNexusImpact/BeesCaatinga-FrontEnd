import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import Selector from '@/components/selector';
import Botao from '@/components/botao';
import TabelaGenerica, { TabelaColuna } from '@/components/tabelaGenerica';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import layout from '@/constants/layout';

// --- Interfaces ---
interface DadosRastreabilidade {
    id: string;
    ano: string;
    mes: string;
    dataProducao: string;
    quantidadeProduzida: string;
    tratamento: string;
    localidade: string;
    tipoAbelhas: string;
}

// --- BANCO DE DADOS MOCKADO ---
const MASTER_TABLE_DATA: DadosRastreabilidade[] = [
    { id: 'LT-01', ano: '2025', mes: '08', dataProducao: '15/08/2025', quantidadeProduzida: '15 kg', tratamento: 'Orgânico', localidade: 'Sitio A', tipoAbelhas: 'Nativa' },
    { id: 'LT-02', ano: '2025', mes: '08', dataProducao: '18/08/2025', quantidadeProduzida: '12 kg', tratamento: 'Convencional', localidade: 'Sitio B', tipoAbelhas: 'Africanizada' },
    { id: 'LT-03', ano: '2025', mes: '08', dataProducao: '20/08/2025', quantidadeProduzida: '18 kg', tratamento: 'Orgânico', localidade: 'Sitio A', tipoAbelhas: 'Nativa' },
    { id: 'LT-04', ano: '2025', mes: '09', dataProducao: '05/09/2025', quantidadeProduzida: '22 kg', tratamento: 'Sem Químico', localidade: 'Apiário C', tipoAbelhas: 'Italiana' },
    { id: 'LT-05', ano: '2025', mes: '09', dataProducao: '10/09/2025', quantidadeProduzida: '30 kg', tratamento: 'Orgânico', localidade: 'Sitio A', tipoAbelhas: 'Nativa' },
    
    { id: 'LT-06', ano: '2024', mes: '08', dataProducao: '12/08/2024', quantidadeProduzida: '14 kg', tratamento: 'Convencional', localidade: 'Sitio B', tipoAbelhas: 'Africanizada' },
    { id: 'LT-07', ano: '2024', mes: '09', dataProducao: '01/09/2024', quantidadeProduzida: '25 kg', tratamento: 'Orgânico', localidade: 'Sitio A', tipoAbelhas: 'Nativa' },
];

const colunasDoRelatorio: TabelaColuna<DadosRastreabilidade>[] = [
    { label: 'Lote ID', dataKey: 'id', sortable: true, flex: 1 },
    { label: 'Data', dataKey: 'dataProducao', sortable: true, flex: 2 },
    { label: 'Qtd (kg)', dataKey: 'quantidadeProduzida', sortable: true, flex: 1 },
    { label: 'Tratamento', dataKey: 'tratamento', sortable: true, flex: 2 },
    { label: 'Local', dataKey: 'localidade', sortable: true, flex: 2 },
    { label: 'Espécie', dataKey: 'tipoAbelhas', sortable: true, flex: 2 },
];

// --- Opções de Filtro ---
const anoOptions = [{ label: 'Todos', value: '' }, { label: '2025', value: '2025' }, { label: '2024', value: '2024' }];
const mesOptions = [{ label: 'Todos', value: '' }, { label: 'Agosto', value: '08' }, { label: 'Setembro', value: '09' }];

export default function RelatorioRastreabilidadeTabela() {
    const [ano, setAno] = useState('');
    const [mes, setMes] = useState('');

    const handleExportar = () => {
        alert(`Exportando ${dadosFiltrados.length} registros...`);
    };

    // --- FILTRAGEM DINÂMICA ---
    const dadosFiltrados = useMemo(() => {
        return MASTER_TABLE_DATA.filter(item => {
            const filtroAno = ano === '' ? true : item.ano === ano;
            const filtroMes = mes === '' ? true : item.mes === mes;
            return filtroAno && filtroMes;
        });
    }, [ano, mes]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Subtexto style={styles.subtexto}>Rastreabilidade Detalhada</Subtexto>

            {/* Área de Filtros */}
            <View style={styles.filtroContainer}>
                <View style={styles.linhaFiltro}>
                    <Selector label="Ano" options={anoOptions} onSelect={setAno} placeholder="Todos" />
                    <Selector label="Mês" options={mesOptions} onSelect={setMes} placeholder="Todos" />
                </View>
            </View>

            {/* Informação sobre resultados */}
            <Text style={{ textAlign: 'center', color: '#666', marginBottom: 5 }}>
                Encontrados: {dadosFiltrados.length} registros
            </Text>

            {/* --- TABELA COM SCROLL HORIZONTAL INVISÍVEL --- */}
            <View style={styles.tabelaContainer}>
                <ScrollView 
                    horizontal={true} 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={styles.scrollContentTabela}
                >
                    {/* minWidth garante que a tabela se expanda horizontalmente */}
                    <View style={{ minWidth: 800 }}> 
                        <TabelaGenerica
                            colunas={colunasDoRelatorio}
                            data={dadosFiltrados} 
                        />
                    </View>
                </ScrollView>
            </View>

            <Botao
                title="Exportar Relatório"
                cor="primaria"
                onPress={handleExportar}
                style={styles.botaoExportar}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.fundo },
    contentContainer: { padding: layout.espacamento.amigavel, gap: layout.espacamento.colega, overflow: 'visible' },
    subtexto: { width: '100%', textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: cores.texto, marginBottom: layout.espacamento.texto },
    
    filtroContainer: { zIndex: 100, marginBottom: layout.espacamento.texto },
    linhaFiltro: { flexDirection: 'row', gap: layout.espacamento.texto },
    
    tabelaContainer: { 
        marginTop: layout.espacamento.texto, 
        zIndex: -1,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#eee'
    },
    
    scrollContentTabela: {
        paddingRight: 20 
    },

    botaoExportar: { marginTop: layout.espacamento.amigavel },
});