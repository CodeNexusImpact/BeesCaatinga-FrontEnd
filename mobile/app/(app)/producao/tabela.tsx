import React, { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import Selector from '@/components/formulario/selector';
import TelaRelatorio from '@/components/telaRelatorio';
import { opcoesDeAno, rotuloEnum } from '@/components/graficos';
import type { TabelaColuna } from '@/components/tabela';
import { useDadosApi } from '@/hooks/useDadosApi';
import { getProducoes } from '@/services/producaoService';
import type { ProducaoRetornoDTO } from '@/types/producao';
import { formatarKgL, paraKg } from '@/utils/mel';

const buscar = (id: number) => getProducoes(id);

const colunas: TabelaColuna<ProducaoRetornoDTO>[] = [
  { label: 'Coleta', dataKey: 'dataColeta', sortable: true, tipo: 'data' },
  { label: 'Tipo de mel', dataKey: 'tipoProducao', sortable: true, flex: 1.6 },
  { label: 'Quantidade', dataKey: 'quantidade', sortable: true, flex: 1.8, render: (p) => formatarKgL(paraKg(p.quantidade, p.unidadeMedida)) },
  { label: 'Apiário', dataKey: 'nomeApiario', sortable: true, flex: 1.6 },
  { label: 'Colmeia', dataKey: 'nomeColmeia', sortable: true },
  { label: 'Situação', dataKey: 'statusProduto', render: (p) => ((p as any).pendente ? 'Pendente de envio' : rotuloEnum(p.statusProduto)) },
  { label: 'Qualidade', dataKey: 'statusQualidade', render: (p) => rotuloEnum(p.statusQualidade) },
];

export default function RelatorioProducao() {
  const router = useRouter();
  const { dados, carregando, erro, recarregar } = useDadosApi<ProducaoRetornoDTO[]>(buscar, []);
  const [ano, setAno] = useState('');
  const [apiario, setApiario] = useState('');
  const apiarios = useMemo(() => [{ label: 'Todos os apiários', value: '' }, ...[...new Set(dados.map((p) => p.nomeApiario).filter(Boolean))].sort().map((n) => ({ label: n, value: n }))], [dados]);
  const filtrados = dados.filter((p) => (!ano || String(p.dataColeta).startsWith(ano)) && (!apiario || p.nomeApiario === apiario));
  const total = filtrados.reduce((s, p) => s + paraKg(p.quantidade, p.unidadeMedida), 0);

  return (
    <TelaRelatorio
      titulo="Relatório de Produção"
      descricao={filtrados.length ? `Total no período: ${formatarKgL(total)}` : undefined}
      carregando={carregando}
      erro={erro}
      onTentarNovamente={recarregar}
      filtros={[
        <Selector key="ano" label="Ano" options={opcoesDeAno(dados, (p) => p.dataColeta)} onSelect={setAno} value={ano} />,
        <Selector key="ap" label="Apiário" options={apiarios} onSelect={setApiario} value={apiario} />,
      ]}
      colunas={colunas}
      dados={filtrados}
      vazio={dados.length ? 'Nenhuma produção para estes filtros.' : 'Nenhuma produção cadastrada ainda.'}
      acaoVazio={dados.length ? undefined : { titulo: 'Cadastrar primeira produção', onPress: () => router.push('/producao/cadastrar') }}
      onPressLinha={(p) => !(p as any).pendente && router.push(`/producao/editar?id=${p.id}` as any)}
      arquivoCsv="relatorio-producao.csv"
      pdf={{ tipo: 'producao', filtro: { ano: ano ? Number(ano) : null } }}
    />
  );
}
