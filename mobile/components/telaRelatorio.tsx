import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import Botao from '@/components/formulario/botao';
import BotaoExportarPdf from '@/components/botaoExportarPdf';
import Filtros from '@/components/filtros';
import Tabela, { TabelaColuna } from '@/components/tabela';
import { EstadoCarregando, EstadoErro } from '@/components/graficos';
import { exportarCsv } from '@/utils/csv';
import { alerta } from '@/utils/alerta';
import { formatarCelula } from '@/components/tabela';
import type { FiltroRelatorio, TipoRelatorio } from '@/services/relatorioService';

interface Props<T extends object> {
  titulo: string;
  descricao?: string;
  carregando: boolean;
  erro: string | null;
  onTentarNovamente: () => void;
  filtros?: React.ReactNode;
  colunas: TabelaColuna<T>[];
  dados: T[];
  vazio: string;
  acaoVazio?: { titulo: string; onPress: () => void };
  onPressLinha?: (item: T) => void;
  arquivoCsv: string;
  pdf?: { tipo: TipoRelatorio; filtro: FiltroRelatorio };
}

/** Estrutura padrão das telas de relatório: filtros, contagem, tabela e exportações (CSV e PDF). */
export default function TelaRelatorio<T extends object>(p: Props<T>) {
  const exportar = async () => {
    if (!p.dados.length) return alerta('Aviso', 'Não há dados para exportar.');
    try {
      // Exporta com a mesma formatação da tela (datas dd/mm/aaaa, kg com litros etc.).
      const colunas = p.colunas.map((c) => ({ label: c.label, dataKey: c.dataKey, render: (i: T) => formatarCelula(c, i) }));
      await exportarCsv(p.arquivoCsv, colunas as any, p.dados);
    } catch {
      alerta('Erro', 'Não foi possível exportar a planilha.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: p.titulo }} />
      {!!p.descricao && <Text style={styles.descricao}>{p.descricao}</Text>}
      {p.carregando && p.dados.length === 0 ? (
        <EstadoCarregando texto="Carregando relatório..." />
      ) : p.erro ? (
        <EstadoErro mensagem={p.erro} onTentarNovamente={p.onTentarNovamente} />
      ) : (
        <>
          {p.filtros && <Filtros resumo={`${p.dados.length} registro(s) encontrado(s)`}>{p.filtros}</Filtros>}
          <Tabela colunas={p.colunas} data={p.dados} vazio={p.vazio} acaoVazio={p.acaoVazio} onPressLinha={p.onPressLinha} />
          <View style={styles.acoes}>
            {p.pdf && (
              <View style={styles.acao}>
                <BotaoExportarPdf tipo={p.pdf.tipo} filtro={p.pdf.filtro} />
              </View>
            )}
            <View style={styles.acao}>
              <Botao title="Exportar planilha (CSV)" iconName="fileDocument" onPress={exportar} cor="branca" />
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: layout.espacamento.colega, gap: 14, paddingBottom: 40, width: '100%', maxWidth: 1200, alignSelf: 'center' },
  descricao: { fontSize: 16, color: cores.textoSecundario },
  acoes: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  acao: { flexGrow: 1, flexBasis: 240 },
});
