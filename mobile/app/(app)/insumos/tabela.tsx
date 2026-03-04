import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import Selector from '@/components/selector';
import Botao from '@/components/botao';
import TabelaGenerica, { TabelaColuna } from '@/components/tabelaGenerica';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import layout from '@/constants/layout';

// --- Interfaces e Dados ---
interface DadosInsumo {
    id: string;
    ano: string; // Para filtro
    dataEntrada: string;
    nomeInsumo: string;
    tipoInsumo: string;
    quantidade: string;
    unidadeMedida: string;
    status: string;
}

const MASTER_TABLE_DATA: DadosInsumo[] = [
    { id: '1', ano: '2025', dataEntrada: '15/01/2025', nomeInsumo: 'Cera de abelha', tipoInsumo: 'Equipamento', quantidade: '5', unidadeMedida: 'kg', status: 'Disponível' },
    { id: '2', ano: '2025', dataEntrada: '20/01/2025', nomeInsumo: 'Avis MultiFlex', tipoInsumo: 'Outro', quantidade: '100', unidadeMedida: 'Un.', status: 'Em uso' },
    { id: '3', ano: '2025', dataEntrada: '05/02/2025', nomeInsumo: 'Xarope', tipoInsumo: 'Alimentação', quantidade: '10', unidadeMedida: 'Lt', status: 'Estoque baixo' },
    { id: '4', ano: '2025', dataEntrada: '10/02/2025', nomeInsumo: 'Macacão Apícola', tipoInsumo: 'EPI', quantidade: '2', unidadeMedida: 'Un.', status: 'Disponível' },
    
    { id: '5', ano: '2024', dataEntrada: '15/06/2024', nomeInsumo: 'Fumegador', tipoInsumo: 'Equipamento', quantidade: '1', unidadeMedida: 'Un.', status: 'Em uso' },
    { id: '6', ano: '2024', dataEntrada: '20/08/2024', nomeInsumo: 'Suplemento Proteico', tipoInsumo: 'Alimentação', quantidade: '20', unidadeMedida: 'kg', status: 'Vencido' },
];

const colunasDoRelatorio: TabelaColuna<DadosInsumo>[] = [
    { label: 'Data', dataKey: 'dataEntrada', sortable: true, flex: 2 },
    { label: 'Item', dataKey: 'nomeInsumo', sortable: true, flex: 3 },
    { label: 'Tipo', dataKey: 'tipoInsumo', sortable: true, flex: 2 },
    { label: 'Qtd.', dataKey: 'quantidade', sortable: true, flex: 1 },
    { label: 'Un.', dataKey: 'unidadeMedida', sortable: true, flex: 1 },
    { label: 'Status', dataKey: 'status', sortable: true, flex: 2 },
];

// --- Opções de Filtro ---
const anoOptions = [
    { label: 'Todos os Anos', value: '' },
    { label: '2025', value: '2025' },
    { label: '2024', value: '2024' },
];

const statusOptions = [
    { label: 'Todos os Status', value: '' },
    { label: 'Disponível', value: 'Disponível' },
    { label: 'Em uso', value: 'Em uso' },
    { label: 'Estoque baixo', value: 'Estoque baixo' },
    { label: 'Vencido', value: 'Vencido' },
];

export default function RelatorioInsumosTabela() {
    const [ano, setAno] = useState('');
    const [statusFiltro, setStatusFiltro] = useState('');

    const handleExportar = () => {
        alert(`Exportando ${dadosFiltrados.length} itens do inventário...`);
    };

    // --- Lógica de Filtro ---
    const dadosFiltrados = useMemo(() => {
        return MASTER_TABLE_DATA.filter(item => {
            const filtroAno = ano === '' ? true : item.ano === ano;
            const filtroStatus = statusFiltro === '' ? true : item.status === statusFiltro;
            return filtroAno && filtroStatus;
        });
    }, [ano, statusFiltro]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Subtexto style={styles.subtexto}>Inventário Detalhado</Subtexto>

            {/* Filtros */}
            <View style={styles.filtroContainer}>
                <View style={styles.linhaFiltro}>
                    <Selector 
                        label="Ano Entrada" 
                        options={anoOptions} 
                        onSelect={setAno} 
                        placeholder="Todos" 
                        style={{flex: 1}}
                    />
                    <Selector 
                        label="Status Atual" 
                        options={statusOptions} 
                        onSelect={setStatusFiltro} 
                        placeholder="Todos" 
                        style={{flex: 1}}
                    />
                </View>
            </View>

            <Text style={{textAlign:'center', fontSize: 12, color: '#888', marginBottom: 5}}>
                {dadosFiltrados.length} itens encontrados
            </Text>

            {/* --- TABELA COM SCROLL HORIZONTAL --- */}
            <View style={styles.tabelaContainer}>
                <ScrollView 
                    horizontal={true} 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContentTabela}
                >
                    {/* MinWidth ajustada para caber as 6 colunas confortavelmente */}
                    <View style={{ minWidth: 900 }}>
                        <TabelaGenerica
                            colunas={colunasDoRelatorio}
                            data={dadosFiltrados}
                        />
                    </View>
                </ScrollView>
            </View>
            <Text style={styles.dicaScroll}>Deslize para ver detalhes</Text>

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
    
    filtroContainer: { zIndex: 10, marginBottom: layout.espacamento.texto },
    linhaFiltro: { flexDirection: 'row', gap: layout.espacamento.texto },

    tabelaContainer: { 
        marginTop: layout.espacamento.texto,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        overflow: 'hidden'
    },
    
    scrollContentTabela: {
        paddingRight: 20
    },

    dicaScroll: {
        textAlign: 'center',
        fontSize: 10,
        color: '#999',
        marginTop: 4
    },

    botaoExportar: { marginTop: layout.espacamento.amigavel },
});