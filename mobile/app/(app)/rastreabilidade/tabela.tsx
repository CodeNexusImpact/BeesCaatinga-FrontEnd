import Botao from '@/components/formulario/botao';
import { exportarCsv } from '@/utils/csv';
import BotaoExportarPdf from '@/components/botaoExportarPdf';
import { opcoesDeAno, rotuloEnum } from '@/components/graficos';
import { isoParaBr } from '@/utils/datas';
import { formatarKgL } from '@/utils/mel';

const MESES_EXTENSO = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
import Selector from '@/components/formulario/selector';
import Subtexto from '@/components/subTexto';
import Tabela, { TabelaColuna } from '@/components/tabela';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { Stack } from 'expo-router';
import React, { useCallback, useState, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { getRastreabilidade, RastreabilidadeDTO } from '@/services/rastreabilidadeService';
import { useFocusEffect } from 'expo-router';
import { alerta } from '@/utils/alerta';

export default function RelatorioRastreabilidadeTabela() {
    const { user } = useAuth();
    const userId = user?.id;
    const [lotes, setLotes] = useState<RastreabilidadeDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [ano, setAno] = useState('');
    const [mes, setMes] = useState('');

    const carregarDados = useCallback(async () => {
        if (!userId) return;
        try {
            setLoading(true);
            const data = await getRastreabilidade(userId);
            setLotes(data);
        } catch (error) {
            console.error('❌ Erro ao carregar rastreabilidade:', error);
            alerta('Erro', 'Não foi possível carregar os dados de rastreabilidade.');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useFocusEffect(
        useCallback(() => {
            carregarDados();
        }, [carregarDados])
    );

    const colunasDoRelatorio: TabelaColuna<RastreabilidadeDTO>[] = [
        { label: 'Lote ID', dataKey: 'id', sortable: true, flex: 1 },
        { label: 'Data', dataKey: 'dataProducao', sortable: true, flex: 2, render: (l) => isoParaBr(l.dataProducao) },
        { label: 'Quantidade', dataKey: 'quantidadeProduzida', sortable: true, flex: 2, render: (l) => formatarKgL(Number(l.quantidadeProduzida) || 0) },
        { label: 'Florada', dataKey: 'tipoFlorada', sortable: true, flex: 2, render: (l) => rotuloEnum(l.tipoFlorada) },
        { label: 'Abelha', dataKey: 'tipoAbelha', sortable: true, flex: 2, render: (l) => rotuloEnum(l.tipoAbelha) },
        { label: 'Status', dataKey: 'vendido', sortable: true, flex: 1, render: (l) => (l.vendido ? 'Vendido' : 'Em estoque') },
    ];

    const anoOptions = opcoesDeAno(lotes, (l) => l.dataProducao);

    const mesOptions = [{ label: 'Todos os meses', value: '' }, ...MESES_EXTENSO.map((m, i) => ({ label: m, value: String(i + 1).padStart(2, '0') }))];

    const dadosFiltrados = useMemo(() => {
        return lotes.filter(item => {
            if (!item.dataProducao) return true;
            // Backend retorna LocalDate ISO (AAAA-MM-DD); aceita também DD/MM/AAAA.
            const iso = item.dataProducao.includes('-');
            const partes = item.dataProducao.split(iso ? '-' : '/');
            const anoProd = iso ? partes[0] : partes[2];
            const mesProd = partes[1];
            const filtroAno = ano === '' ? true : anoProd === ano;
            const filtroMes = mes === '' ? true : mesProd === mes;
            return filtroAno && filtroMes;
        });
    }, [lotes, ano, mes]);

    const handleExportar = async () => {
        if (!dadosFiltrados?.length) {
            alerta('Aviso', 'Não há dados para exportar.');
            return;
        }
        try {
            await exportarCsv('relatorio-rastreabilidade.csv', colunasDoRelatorio as any, dadosFiltrados);
        } catch {
            alerta('Erro', 'Não foi possível exportar a planilha.');
        }
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
            <Stack.Screen options={{ title: 'Relatório de Rastreabilidade' }} />
            <BotaoExportarPdf tipo="rastreabilidade" filtro={{ ano: ano ? Number(ano) : null, mes: mes ? Number(mes) : null }} />

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
                        <Tabela
                            colunas={colunasDoRelatorio as any}
                            data={dadosFiltrados}
                        />
                    </View>
                </ScrollView>
            </View>

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