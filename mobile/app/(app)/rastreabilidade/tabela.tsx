import Botao from '@/components/botao';
import Selector from '@/components/selector';
import Subtexto from '@/components/subTexto';
import TabelaGenerica, { TabelaColuna } from '@/components/tabelaGenerica';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { Stack } from 'expo-router';
import React, { useCallback, useState, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { getRastreabilidade, RastreabilidadeDTO } from '@/services/rastreabilidadeService';
import { useFocusEffect } from 'expo-router';

export default function RelatorioRastreabilidadeTabela() {
    const { user } = useAuth();
    const [lotes, setLotes] = useState<RastreabilidadeDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [ano, setAno] = useState('');
    const [mes, setMes] = useState('');

    const carregarDados = useCallback(async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            const data = await getRastreabilidade(user.id);
            setLotes(data);
        } catch (error) {
            console.error('❌ Erro ao carregar rastreabilidade:', error);
            Alert.alert('Erro', 'Não foi possível carregar os dados de rastreabilidade.');
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useFocusEffect(
        useCallback(() => {
            carregarDados();
        }, [carregarDados])
    );

    const colunasDoRelatorio: TabelaColuna<RastreabilidadeDTO>[] = [
        { label: 'Lote ID', dataKey: 'id', sortable: true, flex: 1 },
        { label: 'Data', dataKey: 'dataProducao', sortable: true, flex: 2 },
        { label: 'Qtd (kg)', dataKey: 'quantidadeProduzida', sortable: true, flex: 1 },
        { label: 'Florada', dataKey: 'tipoFlorada', sortable: true, flex: 2 },
        { label: 'Abelha', dataKey: 'tipoAbelha', sortable: true, flex: 2 },
        { label: 'Status', dataKey: 'vendido', sortable: true, flex: 1, render: (val) => val ? 'Vendido' : 'Estoque' },
    ];

    const anoOptions = [
        { label: 'Todos os Anos', value: '' },
        { label: '2026', value: '2026' },
        { label: '2025', value: '2025' }
    ];

    const mesOptions = [
        { label: 'Todos os Meses', value: '' },
        { label: 'Janeiro', value: '01' },
        { label: 'Fevereiro', value: '02' },
        { label: 'Maio', value: '05' }
    ];

    const dadosFiltrados = useMemo(() => {
        return lotes.filter(item => {
            if (!item.dataProducao) return true;
            const [dia, mesProd, anoProd] = item.dataProducao.split('/');
            const filtroAno = ano === '' ? true : anoProd === ano;
            const filtroMes = mes === '' ? true : mesProd === mes;
            return filtroAno && filtroMes;
        });
    }, [lotes, ano, mes]);

    const handleExportar = () => {
        Alert.alert('Sucesso', `Exportando ${dadosFiltrados.length} registros para CSV.`);
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={cores.primaria[100]} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Stack.Screen options={{ title: 'Tabela de Rastreabilidade' }} />

            <Subtexto style={styles.subtexto}>Dados Reais de Produção</Subtexto>

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

            <Text style={styles.resultadosTexto}>
                Encontrados: {dadosFiltrados.length} registros
            </Text>

            <View style={styles.tabelaContainer}>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContentTabela}
                >
                    <View style={{ minWidth: 600 }}>
                        <TabelaGenerica
                            colunas={colunasDoRelatorio as any}
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
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        padding: layout.espacamento.amigavel,
        gap: layout.espacamento.colega,
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
        zIndex: 999,
        marginBottom: layout.espacamento.texto,
    },
    linhaFiltro: {
        flexDirection: 'row',
        gap: layout.espacamento.texto,
    },
    seletor: {
        flex: 1,
    },
    resultadosTexto: {
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
    },
    tabelaContainer: {
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: cores.borda,
        backgroundColor: cores.branco,
    },
    scrollContentTabela: {
        paddingRight: 20,
    },
    botaoExportar: {
        marginTop: layout.espacamento.amigavel
    },
});