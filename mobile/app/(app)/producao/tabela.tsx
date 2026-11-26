import React, { useState, useCallback } from 'react';
import { exportarCsv } from '@/utils/csv';
import BotaoExportarPdf from '@/components/botaoExportarPdf';
import { opcoesDeAno } from '@/components/graficos';
import { formatarKgL, paraKg } from '@/utils/mel';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';
import Selector from '@/components/formulario/selector';
import Botao from '@/components/formulario/botao';
import Tabela, { TabelaColuna } from '@/components/tabela';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { Stack, useFocusEffect } from 'expo-router';
import { getProducoes } from '@/services/producaoService';
import { useAuth } from '@/hooks/useAuth';
import type { ProducaoRetornoDTO } from '@/types/producao';
import { alerta } from '@/utils/alerta';

// --- Interfaces ---
interface DadosProducao {
    id: string;
    loteId: string;
    dataExtracao: string;
    tipo: string;
    pesoLitro: string;
    qualidade: string;
    status: string;
}

const colunasDoRelatorio: TabelaColuna<DadosProducao>[] = [
    { label: 'Lote', dataKey: 'loteId', sortable: true, flex: 2 },
    { label: 'Data', dataKey: 'dataExtracao', sortable: true, flex: 3 },
    { label: 'Tipo', dataKey: 'tipo', sortable: true, flex: 2 },
    { label: 'Quantidade', dataKey: 'pesoLitro', sortable: true, flex: 3 },
    { label: 'Qualidade', dataKey: 'qualidade', sortable: true, flex: 2 },
    { label: 'Status', dataKey: 'status', sortable: true, flex: 2 },
];

/**
 * Formata data de forma robusta, suportando YYYY-MM-DD e DD/MM/YYYY
 */
const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    if (dateStr.includes('/')) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        const [ano, mes, dia] = parts;
        return `${dia}/${mes}/${ano}`;
    }
    return dateStr;
};

const formatStatus = (status: string) => {
    return status === 'EM_ESTOQUE' ? 'Em Estoque' : 'Vendido';
};

const formatQualidade = (qualidade: string) => {
    return qualidade === 'APROVADO' ? 'Aprovado' : 'Não Avaliado';
};

export default function RelatorioProducaoTabela() {
    const { user } = useAuth();
    const userId = user?.id;
    const [ano, setAno] = useState('');
    const [anoOptions, setAnoOptions] = useState([{ label: 'Todos os anos', value: '' }]);
    const [producoes, setProducoes] = useState<DadosProducao[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const carregarDados = useCallback(async () => {
        if (!userId) return;
        setIsLoading(true);
        try {
            const data = await getProducoes(userId);
            setAnoOptions(opcoesDeAno(data, (p) => p.dataColeta));

            // Filtragem por ano (se selecionado)
            const filtrados = ano 
                ? data.filter(p => p.dataColeta && p.dataColeta.includes(ano))
                : data;

            const formatados: DadosProducao[] = filtrados.map(p => ({
                id: String(p.id),
                loteId: `#${p.id}`,
                dataExtracao: formatDate(p.dataColeta),
                tipo: p.tipoProducao || 'Mel',
                pesoLitro: formatarKgL(paraKg(p.quantidade, p.unidadeMedida)),
                qualidade: formatQualidade(p.statusQualidade),
                status: formatStatus(p.statusProduto)
            }));

            setProducoes(formatados);
        } catch (error) {
            console.error('Erro ao carregar dados da tabela:', error);
            alerta('Erro', 'Não foi possível carregar os dados de produção.');
        } finally {
            setIsLoading(false);
        }
    }, [userId, ano]);

    useFocusEffect(
        useCallback(() => {
            carregarDados();
        }, [carregarDados])
    );

    const handleExportar = async () => {
        if (!producoes?.length) {
            alerta('Aviso', 'Não há dados para exportar.');
            return;
        }
        try {
            await exportarCsv('relatorio-producao.csv', colunasDoRelatorio as any, producoes);
        } catch {
            alerta('Erro', 'Não foi possível exportar a planilha.');
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Stack.Screen options={{ title: 'Relatório de Produção' }} />
            <BotaoExportarPdf tipo="producao" filtro={{ ano: ano ? Number(ano) : null }} />

            <Subtexto style={styles.subtexto}>Relatório Detalhado</Subtexto>

            {/* Filtros */}
            <View style={styles.filtroContainer}>
                <Selector
                    label="Filtrar por Ano"
                    options={anoOptions}
                    onSelect={setAno}
                    placeholder="Todos os Anos"
                />
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color={cores.primaria} />
            ) : (
                <>
                    <Text style={{ textAlign: 'center', fontSize: 12, color: '#888', marginBottom: 5 }}>
                        {producoes.length} registros encontrados
                    </Text>

                    <View style={styles.tabelaContainer}>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContentTabela}
                        >
                            <View style={{ minWidth: 900 }}>
                                <Tabela
                                    colunas={colunasDoRelatorio}
                                    data={producoes}
                                />
                            </View>
                        </ScrollView>
                    </View>
                    <Text style={styles.dicaScroll}>Deslize para o lado para ver mais detalhes</Text>
                </>
            )}

            <Botao
                title="Exportar planilha (CSV)"
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
        fontStyle: 'italic',
        marginTop: 4
    },

    botaoExportar: { marginTop: layout.espacamento.amigavel },
});