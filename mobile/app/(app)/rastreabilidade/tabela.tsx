import React, { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import Selector from '@/components/formulario/selector';
import TelaRelatorio from '@/components/telaRelatorio';
import { opcoesDeAno, rotuloEnum } from '@/components/graficos';
import type { TabelaColuna } from '@/components/tabela';
import { useDadosApi } from '@/hooks/useDadosApi';
import { listarLotesDetalhado } from '@/services/loteService';
import type { LoteRetornoListadoDTO } from '@/types/rastreabilidade';
import { formatarKgL } from '@/utils/mel';

const buscar = (id: number): Promise<LoteRetornoListadoDTO[]> => listarLotesDetalhado(id);
const MESES_EXTENSO = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const colunas: TabelaColuna<LoteRetornoListadoDTO>[] = [
  { label: 'Lote', dataKey: 'id', sortable: true, flex: 0.8, render: (l) => ((l as any).pendente ? 'Pendente' : `Nº ${l.id}`) },
  { label: 'Produção', dataKey: 'dataProducao', sortable: true, tipo: 'data' },
  { label: 'Quantidade', dataKey: 'quantidadeProduzida', sortable: true, flex: 1.8, tipo: 'kg' },
  { label: 'Apiário', dataKey: 'nomeApiario', sortable: true, flex: 1.6 },
  { label: 'Colmeia(s)', dataKey: 'identificadorColmeia', flex: 1.4, render: (l: any) => (l.colmeias?.length ? l.colmeias.map((c: any) => c.identificador).join(', ') : l.identificadorColmeia || 'Apiário inteiro') },
  { label: 'Florada', dataKey: 'tipoFlorada', sortable: true, render: (l) => rotuloEnum(l.tipoFlorada) },
  { label: 'Abelha', dataKey: 'tipoAbelha', sortable: true, render: (l) => rotuloEnum(l.tipoAbelha) },
  { label: 'Situação', dataKey: 'vendido', render: (l) => (l.vendido ? 'Vendido' : 'Em estoque') },
];

export default function RelatorioRastreabilidade() {
  const router = useRouter();
  const { dados, carregando, erro, recarregar } = useDadosApi<LoteRetornoListadoDTO[]>(buscar, []);
  const [ano, setAno] = useState('');
  const [mes, setMes] = useState('');
  const [apiario, setApiario] = useState('');
  const apiarios = useMemo(() => [{ label: 'Todos os apiários', value: '' }, ...[...new Set(dados.map((l) => l.nomeApiario).filter(Boolean))].sort().map((n) => ({ label: n, value: n }))], [dados]);
  const meses = [{ label: 'Todos os meses', value: '' }, ...MESES_EXTENSO.map((m, i) => ({ label: m, value: String(i + 1).padStart(2, '0') }))];
  const filtrados = dados.filter((l) => {
    const d = String(l.dataProducao ?? '');
    return (!ano || d.startsWith(ano)) && (!mes || d.slice(5, 7) === mes) && (!apiario || l.nomeApiario === apiario);
  });

  return (
    <TelaRelatorio
      titulo="Relatório de Rastreabilidade"
      carregando={carregando}
      erro={erro}
      onTentarNovamente={recarregar}
      filtros={[
        <Selector key="ano" label="Ano" options={opcoesDeAno(dados, (l) => l.dataProducao)} onSelect={setAno} value={ano} />,
        <Selector key="mes" label="Mês" options={meses} onSelect={setMes} value={mes} />,
        <Selector key="ap" label="Apiário" options={apiarios} onSelect={setApiario} value={apiario} />,
      ]}
      colunas={colunas}
      dados={filtrados}
      vazio={dados.length ? 'Nenhum lote para estes filtros.' : 'Nenhum lote cadastrado ainda.'}
      acaoVazio={dados.length ? undefined : { titulo: 'Cadastrar primeiro lote', onPress: () => router.push('/rastreabilidade/cadastrar') }}
      onPressLinha={(l) => !(l as any).pendente && router.push(`/rastreabilidade/editar?id=${l.id}` as any)}
      arquivoCsv="relatorio-rastreabilidade.csv"
      pdf={{ tipo: 'rastreabilidade', filtro: { ano: ano ? Number(ano) : null, mes: mes ? Number(mes) : null } }}
    />
  );
}
