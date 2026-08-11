import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';

import Selector from '@/components/formulario/selector';
import Botao from '@/components/formulario/botao';
import Tabela, { TabelaColuna } from '@/components/tabela';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { useAuth } from '@/hooks/useAuth';
import { listarApiariosPorProdutor } from '@/services/apiarioService';

// Interface baseada no Retorno do Backend
interface DadosApiario {
    id: string;
    nome: string;
    registro: string;
    dataCriacao: string; // "DD/MM/AAAA"
    cidade: string;
    colmeiasTotal: number;
    ano: string; // Campo auxiliar para o filtro
}

const colunasApiario: TabelaColuna<DadosApiario>[] = [
    { label: 'Nome', dataKey: 'nome', sortable: true, flex: 3 },
    { label: 'Registro', dataKey: 'registro', sortable: true, flex: 2 },
    { label: 'Cidade', dataKey: 'cidade', sortable: true, flex: 2 },
    { label: 'Colmeias', dataKey: 'colmeiasTotal', sortable: true, flex: 1.5 },
];

export default function TabelaApiarios() {
    const { user } = useAuth();
    const [filtroAno, setFiltroAno] = useState('');
    const [apiarios, setApiarios] = useState<DadosApiario[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApiarios = async () => {
            if (!user?.id) return;
            try {
                setLoading(true);
                const data = await listarApiariosPorProdutor(user.id);
                const formatados = data.map(a => ({
                    id: a.id.toString(),
                    nome: a.nome,
                    registro: a.nRegistro || 'N/A',
                    dataCriacao: a.dataDeCriacao ? new Date(a.dataDeCriacao).toLocaleDateString('pt-BR') : 'N/A',
                    cidade: a.cidade,
                    colmeiasTotal: a.colmeias ? a.colmeias.length : 0,
                    ano: a.dataDeCriacao ? new Date(a.dataDeCriacao).getFullYear().toString() : ''
                }));
                setApiarios(formatados);
            } catch (error) {
                console.error('Erro ao buscar apiários para tabela:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchApiarios();
    }, [user?.id]);

    const dadosFiltrados = useMemo(() => {
        return apiarios.filter(item => filtroAno === '' || item.ano === filtroAno);
    }, [apiarios, filtroAno]);

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
            <Stack.Screen options={{ title: 'Relatório de Apiários' }} />
            <Subtexto style={styles.titulo}>Relatório de Apiários</Subtexto>

            <View style={{ zIndex: 100 }}>
                <Selector 
                    label="Filtrar por Ano:" 
                    options={[{label: 'Todos', value: ''}, {label: '2026', value: '2026'}, {label: '2025', value: '2025'}, {label: '2024', value: '2024'}]} 
                    onSelect={setFiltroAno} 
                    iconName="calendar"
                    value={filtroAno}
                />
            </View>

            <View style={styles.tabelaContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ minWidth: 700 }}>
                        <Tabela colunas={colunasApiario} data={dadosFiltrados} />
                    </View>
                </ScrollView>
            </View>

            <Botao title="Exportar Relatório" cor="primaria" onPress={() => alert('Exportando para CSV...')} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.fundo },
    contentContainer: { padding: layout.espacamento.amigavel, gap: 20 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    titulo: { textAlign: 'center', width: '100%' },
    tabelaContainer: { borderRadius: 8, borderWidth: 1, borderColor: cores.cores.base[20], overflow: 'hidden' },
});