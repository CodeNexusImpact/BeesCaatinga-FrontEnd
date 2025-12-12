import Botao from '@/components/botao';
import Selector from '@/components/selector';
import Subtexto from '@/components/subTexto';
import TabelaGenerica, { TabelaColuna } from '@/components/tabelaGenerica';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { Stack } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

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
const anoOptions = [{ label: 'Todos os Anos', value: '' }, { label: '2025', value: '2025' }, { label: '2024', value: '2024' }];
const mesOptions = [{ label: 'Todos os Meses', value: '' }, { label: 'Agosto', value: '08' }, { label: 'Setembro', value: '09' }];

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
            <Stack.Screen options={{ title: 'Tabela' }} />

            <Subtexto style={styles.subtexto}>Rastreabilidade Detalhada</Subtexto>

            <View style={styles.filtroWrapper}>
                <View style={styles.linhaFiltro}>
                    <Selector
                        label="Ano"
                        options={anoOptions}
                        onSelect={setAno}
                        placeholder="Todos"
                        style={styles.seletor}
                    />
                    <Selector
                        label="Mês"
                        options={mesOptions}
                        onSelect={setMes}
                        placeholder="Todos"
                        style={styles.seletor}
                    />
                </View>
            </View>

            {/* Informação sobre resultados */}
            <Text style={styles.resultadosTexto}>
                Encontrados: {dadosFiltrados.length} registros
            </Text>

            {/* --- TABELA COM SCROLL HORIZONTAL --- */}
            <View style={styles.tabelaContainer}>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContentTabela}
                >
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
    container: { 
        flex: 1, 
        backgroundColor: cores.fundo 
    },
    contentContainer: {
        padding: layout.espacamento.amigavel,
        gap: layout.espacamento.colega,
        overflow: 'visible', // ⚠️ IMPORTANTE: evita cortar dropdowns
    },
    subtexto: {
        width: '100%',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: cores.texto,
        marginBottom: layout.espacamento.texto
    },

    filtroWrapper: {
        position: 'relative', // necessário para zIndex funcionar
        zIndex: 999, // força estar acima de tudo
        marginBottom: layout.espacamento.texto,
        paddingHorizontal: layout.espacamento.amigavel, // opcional: alinha com o conteúdo
    },
    linhaFiltro: {
        flexDirection: 'row',
        gap: layout.espacamento.texto,
        flexWrap: 'wrap',
    },
    seletor: {
        flex: 1,
        minWidth: 140,
    },

    resultadosTexto: {
        textAlign: 'center',
        color: '#666',
        marginBottom: 5,
        fontSize: 14,
    },

    tabelaContainer: {
        marginTop: layout.espacamento.texto,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fff',
    },

    scrollContentTabela: {
        paddingRight: 20,
    },

    botaoExportar: {
        marginTop: layout.espacamento.amigavel
    },
});