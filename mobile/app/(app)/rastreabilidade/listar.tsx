import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Botao from '@/components/formulario/botao';
import Selector from '@/components/formulario/selector';
import Filtros from '@/components/filtros';
import Tabela, { TabelaColuna } from '@/components/tabela';
import { EstadoCarregando, EstadoErro, rotuloEnum } from '@/components/graficos';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { useDadosApi } from '@/hooks/useDadosApi';
import { listarLotesDetalhado } from '@/services/loteService';
import type { LoteRetornoListadoDTO } from '@/types/rastreabilidade';

const buscar = (id: number): Promise<LoteRetornoListadoDTO[]> => listarLotesDetalhado(id);

const colunas: TabelaColuna<LoteRetornoListadoDTO>[] = [
  { label: 'Lote', dataKey: 'id', sortable: true, flex: 0.8, render: (l) => ((l as any).pendente ? 'Pendente de envio' : `Nº ${l.id}`) },
  { label: 'Apiário', dataKey: 'nomeApiario', sortable: true, flex: 1.6 },
  { label: 'Produção', dataKey: 'dataProducao', sortable: true, tipo: 'data' },
  { label: 'Quantidade', dataKey: 'quantidadeProduzida', sortable: true, flex: 1.8, tipo: 'kg' },
  { label: 'Colmeia(s)', dataKey: 'identificadorColmeia', flex: 1.4, render: (l: any) => (l.colmeias?.length ? l.colmeias.map((c: any) => c.identificador).join(', ') : l.identificadorColmeia || 'Apiário inteiro') },
  { label: 'Florada', dataKey: 'tipoFlorada', render: (l) => rotuloEnum(l.tipoFlorada) },
  { label: 'Situação', dataKey: 'vendido', render: (l) => (l.vendido ? 'Vendido' : 'Em estoque') },
];

/** Lista de lotes (toque abre o detalhe com a origem do mel). */
export default function ListarLotes() {
  const router = useRouter();
  const { dados, carregando, erro, recarregar } = useDadosApi<LoteRetornoListadoDTO[]>(buscar, []);
  const [apiario, setApiario] = useState('');
  const apiarios = useMemo(() => [{ label: 'Todos os apiários', value: '' }, ...[...new Set(dados.map((l) => l.nomeApiario).filter(Boolean))].sort().map((n) => ({ label: n, value: n }))], [dados]);
  const filtrados = dados.filter((l) => !apiario || l.nomeApiario === apiario);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Stack.Screen options={{ title: 'Meus Lotes' }} />
      <Botao title="Cadastrar lote" iconName="add" onPress={() => router.push('/rastreabilidade/cadastrar')} cor="primaria" />
      {carregando && dados.length === 0 ? (
        <EstadoCarregando texto="Carregando lotes..." />
      ) : erro ? (
        <EstadoErro mensagem={erro} onTentarNovamente={recarregar} />
      ) : (
        <>
          {dados.length > 0 && (
            <Filtros resumo={`${filtrados.length} lote(s)`}>
              <Selector label="Apiário" options={apiarios} onSelect={setApiario} value={apiario} />
            </Filtros>
          )}
          <Tabela
            colunas={colunas}
            data={filtrados}
            vazio="Nenhum lote cadastrado ainda."
            onPressLinha={(l) => !(l as any).pendente && router.push(`/rastreabilidade/editar?id=${l.id}` as any)}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: layout.espacamento.colega, gap: 14, paddingBottom: 40, width: '100%', maxWidth: 1200, alignSelf: 'center' },
});
