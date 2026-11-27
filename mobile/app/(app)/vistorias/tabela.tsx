import React, { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import Selector from '@/components/formulario/selector';
import TelaRelatorio from '@/components/telaRelatorio';
import { opcoesDeAno, rotuloEnum } from '@/components/graficos';
import type { TabelaColuna } from '@/components/tabela';
import { useDadosApi } from '@/hooks/useDadosApi';
import { listarVistoriasPorProdutor, Vistoria } from '@/services/vistoriaService';

const buscar = (id: number) => listarVistoriasPorProdutor(id);
const lista = (v?: string[]) => (v?.length ? v.map(rotuloEnum).join(', ') : 'Nenhuma');

const colunas: TabelaColuna<Vistoria>[] = [
  { label: 'Data', dataKey: 'dataVistoria', sortable: true, tipo: 'data' },
  { label: 'Apiário', dataKey: 'nomeApiario', sortable: true, flex: 1.6 },
  { label: 'Colmeia', dataKey: 'nomeColmeia', sortable: true },
  { label: 'Condição', dataKey: 'condicao', sortable: true, flex: 1.6, render: (v) => rotuloEnum(v.condicao) },
  { label: 'Pragas', dataKey: 'pragasIdentificadas', flex: 2, render: (v) => lista(v.pragasIdentificadas) },
  { label: 'Perdas', dataKey: 'perdasIdentificadas', flex: 2, render: (v) => lista(v.perdasIdentificadas) },
  { label: 'Observações', dataKey: 'observacoes', flex: 2.5 },
];

export default function RelatorioVistorias() {
  const router = useRouter();
  const { dados, carregando, erro, recarregar } = useDadosApi<Vistoria[]>(buscar, []);
  const [ano, setAno] = useState('');
  const [condicao, setCondicao] = useState('');
  const [apiario, setApiario] = useState('');
  const apiarios = useMemo(() => [{ label: 'Todos os apiários', value: '' }, ...[...new Set(dados.map((v) => v.nomeApiario ?? '').filter(Boolean))].sort().map((n) => ({ label: n, value: n }))], [dados]);
  const filtrados = dados.filter((v) => (!ano || String(v.dataVistoria).startsWith(ano)) && (!condicao || v.condicao === condicao) && (!apiario || v.nomeApiario === apiario));

  return (
    <TelaRelatorio
      titulo="Relatório de Vistorias"
      carregando={carregando}
      erro={erro}
      onTentarNovamente={recarregar}
      filtros={[
        <Selector key="ano" label="Ano" options={opcoesDeAno(dados, (v) => v.dataVistoria)} onSelect={setAno} value={ano} />,
        <Selector
          key="cond"
          label="Condição"
          options={[
            { label: 'Todas as condições', value: '' },
            { label: 'Saudável', value: 'SAUDAVEL' },
            { label: 'Manutenção necessária', value: 'MANUTENCAO_NECESSARIA' },
            { label: 'Agendar colheita', value: 'AGENDAR_COLHEITA' },
          ]}
          onSelect={setCondicao}
          value={condicao}
        />,
        <Selector key="ap" label="Apiário" options={apiarios} onSelect={setApiario} value={apiario} />,
      ]}
      colunas={colunas}
      dados={filtrados}
      vazio={dados.length ? 'Nenhuma vistoria para estes filtros.' : 'Nenhuma vistoria cadastrada ainda.'}
      acaoVazio={dados.length ? undefined : { titulo: 'Cadastrar primeira vistoria', onPress: () => router.push('/vistorias/cadastrar') }}
      onPressLinha={(v) => !(v as any).pendente && router.push(`/vistorias/${v.id}` as any)}
      arquivoCsv="relatorio-vistorias.csv"
      pdf={{ tipo: 'vistorias', filtro: { ano: ano ? Number(ano) : null, apiarioId: apiario ? (dados.find((v) => v.nomeApiario === apiario)?.apiarioId ?? null) : null } }}
    />
  );
}
