import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';
import Selector from '@/components/selector';
import Botao from '@/components/botao';
import TabelaGenerica, { TabelaColuna } from '@/components/tabelaGenerica';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { Stack, useFocusEffect } from 'expo-router';
import { getProducao } from '@/services/producaoService';
import { useAuth } from '@/hooks/useAuth';
import type { ProducaoRetornoDTO } from '@/types/producao';

// --- Interfaces ---
interface DadosProducao {
    id: string;        
    loteId: string;
    dataExtracao: string;
    pesoLitro: string;
    qualidade: string;
    status: string;
}

const colunasDoRelatorio: TabelaColuna<DadosProducao>[] = [
    { label: 'Lote', dataKey: 'loteId', sortable: true, flex: 2 },
    { label: 'Data', dataKey: 'dataExtracao', sortable: true, flex: 3 },
    { label: 'Peso/Qtd', dataKey: 'pesoLitro', sortable: true, flex: 2 },
    { label: 'Qualidade', dataKey: 'qualidade', sortable: true, flex: 2 },
    { label: 'Status', dataKey: 'status', sortable: true, flex: 2 },
];

const anoOptions = [
    { label: 'Todos os Anos', value: '' }, 
    { label: '2025', value: '2025' }, 
    { label: '2024', value: '2024' },
];

const formatDate = (dateStr: string) => {
  if (!dateStr) return '—';
  const [ano, mes, dia] = dateStr.split('-');
  return `${dia}/${mes}/${ano}`;
};

const formatStatus = (status: string) => {
  return status === 'EM_ESTOQUE' ? 'Em Estoque' : 'Vendido';
};

const formatQualidade = (qualidade: string) => {
  return qualidade === 'APROVADO' ? 'Aprovado' : 'Não Avaliado';
};

export default function RelatorioProducaoTabela() {
    const { session } = useAuth();
    const [ano, setAno] = useState('');
    const [producoes, setProducoes] = useState<DadosProducao[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const carregarDados = useCallback(async () => {
        setIsLoading(true);
        try {
            const produtorId = session || '1';
            const data = await getProducao({ userId: produtorId, ano: ano || undefined });
            
            const formatados: DadosProducao[] = data.map(p => ({
                id: String(p.id),
                loteId: p.id ? `LT-${p.id}` : '—', // Usando ID como fallback para Lote
                dataExtracao: formatDate(p.dataColeta),
                pesoLitro: `${p.quantidade}`,
                qualidade: formatQualidade(p.statusQualidade),
                status: formatStatus(p.statusProduto)
            }));

            setProducoes(formatados);
        } catch (error) {
            console.error('Erro ao carregar dados da tabela:', error);
        } finally {
            setIsLoading(false);
        }
    }, [session, ano]);

    useFocusEffect(
        useCallback(() => {
            carregarDados();
        }, [carregarDados])
    );

    const handleExportar = () => {
        alert(`Exportando ${producoes.length} registros...`);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Stack.Screen options={{ title: 'Tabela' }} />

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
                    <Text style={{textAlign:'center', fontSize: 12, color: '#888', marginBottom: 5}}>
                        {producoes.length} registros encontrados
                    </Text>

                    <View style={styles.tabelaContainer}>
                        <ScrollView 
                            horizontal={true} 
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContentTabela}
                        >
                            <View style={{ minWidth: 900 }}>
                                <TabelaGenerica
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