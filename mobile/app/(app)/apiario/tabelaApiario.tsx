import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Stack } from 'expo-router';

import Selector from '@/components/selector';
import Botao from '@/components/botao';
import TabelaGenerica, { TabelaColuna } from '@/components/tabelaGenerica';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import layout from '@/constants/layout';

// Interface baseada no CadastrarApiario
interface DadosApiario {
    id: string;
    nome: string;
    registro: string;
    dataCriacao: string; // "DD/MM/AAAA"
    cidade: string;
    colmeiasTotal: number;
    ano: string; // Campo auxiliar para o filtro
}

const MOCK_APIARIOS: DadosApiario[] = [
    { id: '1', nome: 'Rosa do Sertão', registro: 'SISBI 101', dataCriacao: '15/01/2025', cidade: 'Pombal', colmeiasTotal: 15, ano: '2025' },
    { id: '2', nome: 'Vale das Abelhas', registro: 'SISBI 102', dataCriacao: '20/02/2024', cidade: 'Sousa', colmeiasTotal: 22, ano: '2024' },
    { id: '3', nome: 'Bees Caatinga', registro: 'SISBI 103', dataCriacao: '10/05/2025', cidade: 'Pombal', colmeiasTotal: 10, ano: '2025' },
];

const colunasApiario: TabelaColuna<DadosApiario>[] = [
    { label: 'Nome', dataKey: 'nome', sortable: true, flex: 3 },
    { label: 'Registro', dataKey: 'registro', sortable: true, flex: 2 },
    { label: 'Cidade', dataKey: 'cidade', sortable: true, flex: 2 },
    { label: 'Colmeias', dataKey: 'colmeiasTotal', sortable: true, flex: 1.5 },
];

export default function TabelaApiarios() {
    const [filtroAno, setFiltroAno] = useState('');

    const dadosFiltrados = useMemo(() => {
        return MOCK_APIARIOS.filter(item => filtroAno === '' || item.ano === filtroAno);
    }, [filtroAno]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Stack.Screen options={{ title: 'Relatório de Apiários' }} />
            <Subtexto style={styles.titulo}>Listagem de Apiários</Subtexto>

            <View style={{ zIndex: 100 }}>
                <Selector 
                    label="Filtrar por Ano:" 
                    options={[{label: 'Todos', value: ''}, {label: '2025', value: '2025'}, {label: '2024', value: '2024'}]} 
                    onSelect={setFiltroAno} 
                    iconName="calendar"
                />
            </View>

            <View style={styles.tabelaContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ minWidth: 700 }}>
                        <TabelaGenerica colunas={colunasApiario} data={dadosFiltrados} />
                    </View>
                </ScrollView>
            </View>

            <Botao title="Exportar Relatório" cor="primaria" onPress={() => {}} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.fundo },
    contentContainer: { padding: layout.espacamento.amigavel, gap: 20 },
    titulo: { textAlign: 'center' },
    tabelaContainer: { borderRadius: 8, borderWidth: 1, borderColor: cores.borda, overflow: 'hidden' },
});