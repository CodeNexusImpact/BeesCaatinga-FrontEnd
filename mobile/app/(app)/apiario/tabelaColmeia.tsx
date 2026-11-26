import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';

// Componentes e Constantes Padronizados
import Selector from '@/components/formulario/selector';
import Botao from '@/components/formulario/botao';
import Tabela, { TabelaColuna } from '@/components/tabela';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { useAuth } from '@/hooks/useAuth';
import { exportarCsv } from '@/utils/csv';
import { alerta } from '@/utils/alerta';
import { listarColmeiasPorProdutor } from '@/services/colmeiaService';
import { rotuloEnum } from '@/components/graficos';
import { isoParaBr } from '@/utils/datas';

// --- Interface Atualizada ---
interface DadosColmeia {
    id: string;
    identificador: string;
    apiario: string;
    tipo: string;
    situacao: string;
    status: string;
    ultimaVistoria: string;
}

// --- Configuração das Colunas ---
const colunasColmeia: TabelaColuna<DadosColmeia>[] = [
    { label: 'Identificador', dataKey: 'identificador', sortable: true, flex: 2 },
    { label: 'Apiário', dataKey: 'apiario', sortable: true, flex: 3 },
    { label: 'Material', dataKey: 'tipo', sortable: true, flex: 2 },
    { label: 'Situação', dataKey: 'situacao', sortable: true, flex: 3 },
    { label: 'Ativa', dataKey: 'status', sortable: true, flex: 1.5 },
    { label: 'Última vistoria', dataKey: 'ultimaVistoria', sortable: true, flex: 2.5 },
];

export default function TabelaColmeias() {
    const { user } = useAuth();
    const [filtroAno, setFiltroAno] = useState('');
    const [colmeias, setColmeias] = useState<DadosColmeia[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchColmeias = async () => {
            if (!user?.id) return;
            try {
                setLoading(true);
                const data = await listarColmeiasPorProdutor(user.id);
                const formatados = data.map((c: any) => ({
                    id: c.id.toString(),
                    identificador: c.identificador,
                    apiario: c.nomeApiario || '—',
                    tipo: rotuloEnum(c.tipo),
                    situacao: c.pendente ? 'Pendente de envio' : rotuloEnum(c.statusColmeia),
                    status: c.ativa === false ? 'Não' : 'Sim',
                    ultimaVistoria: c.ultimaVistoria ? isoParaBr(c.ultimaVistoria) : 'Nenhuma'
                }));
                setColmeias(formatados);
            } catch (error) {
                console.error('Erro ao buscar colmeias para tabela:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchColmeias();
    }, [user?.id]);

    // --- LÓGICA: Filtra as colmeias pelo ano selecionado ---
    const dadosFiltrados = useMemo(() => {
        return colmeias.filter(item => filtroAno === '' || item.apiario === filtroAno);
    }, [colmeias, filtroAno]);

    const anoOptions = useMemo(() => {
        const nomes = Array.from(new Set(colmeias.map(c => c.apiario))).sort();
        return [{ label: 'Todos os apiários', value: '' }, ...nomes.map(a => ({ label: a, value: a }))];
    }, [colmeias]);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={cores.primaria[100]} />
                <Text>Carregando Relatório...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Stack.Screen options={{ title: 'Relatório de Colmeias' }} />

            <Subtexto style={styles.subtexto}>Relatório Detalhado</Subtexto>

            {/* Filtro por apiário */}
            <View style={styles.filtroContainer}>
                <Selector 
                    label="Filtrar por apiário" 
                    options={anoOptions} 
                    onSelect={setFiltroAno} 
                    placeholder="Selecione o apiário" 
                    iconName="beehiveOutline"
                    value={filtroAno}
                />
            </View>

            <Text style={styles.contagemTexto}>
                {dadosFiltrados.length} colmeia(s) encontrada(s)
            </Text>

            {/* --- TABELA COM SCROLL HORIZONTAL --- */}
            <View style={styles.tabelaContainer}>
                <ScrollView 
                    horizontal={true} 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContentTabela}
                >
                    <View style={{ minWidth: 750 }}>
                        <Tabela
                            colunas={colunasColmeia}
                            data={dadosFiltrados}
                        />
                    </View>
                </ScrollView>
            </View>
            
            <Text style={styles.dicaScroll}>Deslize lateralmente para ver todos os dados</Text>

            <Botao
                title="Exportar planilha (CSV)"
                cor="primaria"
                onPress={() => exportarCsv('relatorio-colmeias.csv', colunasColmeia, dadosFiltrados).catch(() => alerta('Erro', 'Não foi possível exportar.'))}
                style={styles.botaoAcao}
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
        gap: layout.espacamento.colega 
    },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    subtexto: { 
        width: '100%', 
        textAlign: 'center', 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: cores.texto, 
        marginBottom: layout.espacamento.texto 
    },
    filtroContainer: { 
        zIndex: 10, 
        marginBottom: layout.espacamento.texto 
    },
    contagemTexto: {
        textAlign: 'center', 
        fontSize: 12, 
        color: '#888', 
        marginBottom: 5
    },
    tabelaContainer: { 
        marginTop: layout.espacamento.texto,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        overflow: 'hidden'
    },
    scrollContentTabela: {
        paddingRight: 10
    },
    dicaScroll: {
        textAlign: 'center',
        fontSize: 10,
        color: '#999',
        fontStyle: 'italic',
        marginTop: 4
    },
    botaoAcao: { 
        marginTop: layout.espacamento.amigavel 
    },
});