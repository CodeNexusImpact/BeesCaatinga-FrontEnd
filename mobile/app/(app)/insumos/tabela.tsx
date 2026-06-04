import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator, Alert } from 'react-native';
import Selector from '@/components/formulario/selector';
import Botao from '@/components/formulario/botao';
import Tabela, { TabelaColuna } from '@/components/tabela';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { useFocusEffect, Stack } from 'expo-router';
import { getInsumos } from '@/services/insumoService';
import { useAuth } from '@/hooks/useAuth';
import { InsumoRetornoDTO } from '@/types/insumos';

export default function RelatorioInsumosTabela() {
    const { session } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [insumos, setInsumos] = useState<any[]>([]);
    const [statusFiltro, setStatusFiltro] = useState('');

    /**
     * Carregamento dinâmico via useFocusEffect (Sem Mocks)
     */
    const carregarDados = useCallback(async () => {
        const produtorId = session || '1';
        try {
            setIsLoading(true);
            const data = await getInsumos(produtorId);

            // Processamento para padronização de exibição (Concatenar Quantidade + Unidade)
            const dadosFormatados = data.map(item => ({
                ...item,
                volumeFormatado: `${item.quantidade} ${item.unidadeMedida || ''}`.trim(),
                statusFormatado: (item.statusInsumo || 'DISPONIVEL').replace('_', ' ')
            }));

            setInsumos(dadosFormatados);
        } catch (error) {
            console.error('❌ [RELATORIO INSUMOS] Erro:', error);
            Alert.alert('Erro', 'Não foi possível carregar os dados do relatório.');
        } finally {
            setIsLoading(false);
        }
    }, [session, statusFiltro]);

    useFocusEffect(
        useCallback(() => {
            carregarDados();
        }, [carregarDados])
    );

    const handleExportar = () => {
        if (!insumos || insumos.length === 0) {
            Alert.alert('Aviso', 'Não há dados para exportar.');
            return;
        }

        // Geração do CSV real
        const cabecalho = 'Data,Insumo,Tipo,Quantidade,Unidade,Status,Observacoes\n';
        const linhas = insumos.map(i => 
            `${i.dataInsumo},${i.nome},${i.tipoInsumo},${i.quantidade},${i.unidadeMedida},${i.statusFormatado},"${(i.observacoes || '').replace(/"/g, '""')}"`
        ).join('\n');

        const csvString = cabecalho + linhas;

        console.log('--- EXPORTAÇÃO CSV (INSUMOS) ---');
        console.log(csvString);
        console.log('--------------------------------');

        Alert.alert('Sucesso', `Relatório com ${insumos.length} registros gerado no console com sucesso!`);
    };

    // Colunas mapeadas com as chaves reais e formatadas
    const colunasDoRelatorio: TabelaColuna<any>[] = [
        { label: 'Data', dataKey: 'dataInsumo', sortable: true, flex: 2 },
        { label: 'Insumo', dataKey: 'nome', sortable: true, flex: 3 },
        { label: 'Tipo', dataKey: 'tipoInsumo', sortable: true, flex: 2 },
        { label: 'Volume', dataKey: 'volumeFormatado', sortable: true, flex: 2 },
        { label: 'Status', dataKey: 'statusFormatado', sortable: true, flex: 2 },
    ];

    const statusOptions = [
        { label: 'Todos os Tipos', value: '' },
        { label: 'Alimentação', value: 'Alimentação' },
        { label: 'Medicamento', value: 'Medicamento' },
        { label: 'Equipamento', value: 'Equipamento' },
    ];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Stack.Screen options={{ title: 'Relatório de Inventário' }} />
            <Subtexto style={styles.subtexto}>Inventário Detalhado</Subtexto>

            {/* Filtros */}
            <View style={styles.filtroContainer}>
                <View style={styles.linhaFiltro}>
                    <Selector
                        label="Filtrar por Categoria"
                        options={statusOptions}
                        onSelect={setStatusFiltro}
                        placeholder="Todas"
                        style={{ flex: 1 }}
                        value={statusFiltro}
                    />
                </View>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={cores.primaria[100]} />
                </View>
            ) : (
                <>
                    <Text style={styles.itensEncontrados}>
                        {insumos.length} registros encontrados no banco 8081
                    </Text>

                    <View style={styles.tabelaContainer}>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContentTabela}
                        >
                            <View style={{ minWidth: 800 }}>
                                <Tabela
                                    colunas={colunasDoRelatorio}
                                    data={insumos}
                                />
                            </View>
                        </ScrollView>
                    </View>
                    <Text style={styles.dicaScroll}>Deslize lateralmente para ver todas as colunas</Text>

                    <Botao
                        title="Exportar Inventário"
                        cor="primaria"
                        onPress={handleExportar}
                        style={styles.botaoExportar}
                    />
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.fundo },
    contentContainer: { padding: layout.espacamento.amigavel, gap: layout.espacamento.colega },
    subtexto: { width: '100%', textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: cores.texto, marginBottom: layout.espacamento.texto },
    filtroContainer: { zIndex: 10, marginBottom: layout.espacamento.texto },
    linhaFiltro: { flexDirection: 'row', gap: layout.espacamento.texto },
    itensEncontrados: { textAlign: 'center', fontSize: 12, color: '#888', marginBottom: 5 },
    tabelaContainer: {
        marginTop: layout.espacamento.texto,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        overflow: 'hidden',
        backgroundColor: '#fff'
    },
    scrollContentTabela: { paddingRight: 20 },
    dicaScroll: { textAlign: 'center', fontSize: 10, color: '#999', marginTop: 4 },
    botaoExportar: { marginTop: layout.espacamento.amigavel },
    loadingContainer: { marginTop: 50 }
});
