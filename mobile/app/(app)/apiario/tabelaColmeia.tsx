import React, { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import Selector from '@/components/formulario/selector';
import TelaRelatorio from '@/components/telaRelatorio';
import { rotuloEnum } from '@/components/graficos';
import type { TabelaColuna } from '@/components/tabela';
import { useDadosApi } from '@/hooks/useDadosApi';
import { listarColmeiasPorProdutor } from '@/services/colmeiaService';
import type { ColmeiaRetornoDTO } from '@/types/apiario/colmeia';

const buscar = (id: number) => listarColmeiasPorProdutor(id);

const colunas: TabelaColuna<ColmeiaRetornoDTO>[] = [
  { label: 'Colmeia', dataKey: 'identificador', sortable: true, flex: 1.5 },
  { label: 'Apiário', dataKey: 'nomeApiario', sortable: true, flex: 2 },
  { label: 'Material', dataKey: 'tipo', sortable: true, render: (c) => rotuloEnum(c.tipo) },
  { label: 'Situação', dataKey: 'statusColmeia', sortable: true, flex: 1.6, render: (c) => ((c as any).pendente ? 'Pendente de envio' : rotuloEnum(c.statusColmeia)) },
  { label: 'Ativa', dataKey: 'ativa', render: (c) => (c.ativa === false ? 'Não' : 'Sim') },
  { label: 'Última vistoria', dataKey: 'ultimaVistoria', sortable: true, tipo: 'data' },
];

export default function RelatorioColmeias() {
  const router = useRouter();
  const { dados, carregando, erro, recarregar } = useDadosApi<ColmeiaRetornoDTO[]>(buscar, []);
  const [apiario, setApiario] = useState('');
  const [situacao, setSituacao] = useState('');
  const apiarios = useMemo(() => [{ label: 'Todos os apiários', value: '' }, ...[...new Set(dados.map((c) => c.nomeApiario).filter(Boolean))].sort().map((n) => ({ label: n, value: n }))], [dados]);
  const situacoes = useMemo(() => [{ label: 'Todas as situações', value: '' }, ...[...new Set(dados.map((c) => c.statusColmeia).filter(Boolean))].map((s) => ({ label: rotuloEnum(s), value: s }))], [dados]);
  const filtrados = dados.filter((c) => (!apiario || c.nomeApiario === apiario) && (!situacao || c.statusColmeia === situacao));

  return (
    <TelaRelatorio
      titulo="Relatório de Colmeias"
      carregando={carregando}
      erro={erro}
      onTentarNovamente={recarregar}
      filtros={[
        <Selector key="a" label="Apiário" options={apiarios} onSelect={setApiario} value={apiario} />,
        <Selector key="s" label="Situação" options={situacoes} onSelect={setSituacao} value={situacao} />,
      ]}
      colunas={colunas}
      dados={filtrados}
      vazio={dados.length ? 'Nenhuma colmeia para estes filtros.' : 'Nenhuma colmeia cadastrada ainda.'}
      acaoVazio={dados.length ? undefined : { titulo: 'Cadastrar primeira colmeia', onPress: () => router.push('/apiario/colmeia/cadastrar') }}
      onPressLinha={(c) => !(c as any).pendente && router.push(`/apiario/colmeia/editar?id=${c.id}` as any)}
      arquivoCsv="relatorio-colmeias.csv"
    />
  );
}
