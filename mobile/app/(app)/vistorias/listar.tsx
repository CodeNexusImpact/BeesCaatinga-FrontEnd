import React, { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import Selector from '@/components/formulario/selector';
import TelaLista from '@/components/telaLista';
import { opcoesDeAno, rotuloEnum } from '@/components/graficos';
import type { TabelaColuna } from '@/components/tabela';
import { useDadosApi } from '@/hooks/useDadosApi';
import { listarVistoriasPorProdutor, Vistoria } from '@/services/vistoriaService';

const buscar = (id: number) => listarVistoriasPorProdutor(id);
const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const colunas: TabelaColuna<Vistoria>[] = [
  { label: 'Data', dataKey: 'dataVistoria', sortable: true, tipo: 'data' },
  { label: 'Colmeia', dataKey: 'nomeColmeia', sortable: true },
  { label: 'Apiário', dataKey: 'nomeApiario', sortable: true, flex: 1.6 },
  { label: 'Condição', dataKey: 'condicao', sortable: true, flex: 1.6, render: (v) => ((v as any).pendente ? 'Pendente de envio' : rotuloEnum(v.condicao)) },
  { label: 'Pragas', dataKey: 'pragasIdentificadas', flex: 1.6, render: (v) => (v.pragasIdentificadas?.length ? v.pragasIdentificadas.map(rotuloEnum).join(', ') : 'Nenhuma') },
];

export default function ListarVistorias() {
  const router = useRouter();
  const { dados, carregando, erro, recarregar } = useDadosApi<Vistoria[]>(buscar, []);
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');
  const ordenadas = useMemo(() => [...dados].sort((a, b) => String(b.dataVistoria).localeCompare(String(a.dataVistoria))), [dados]);
  const filtradas = ordenadas.filter((v) => {
    const d = String(v.dataVistoria ?? '');
    return (!ano || d.startsWith(ano)) && (!mes || d.slice(5, 7) === mes);
  });

  return (
    <TelaLista
      titulo="Minhas Vistorias"
      cadastrar={{ titulo: 'Cadastrar vistoria', rota: '/vistorias/cadastrar' }}
      carregando={carregando}
      erro={erro}
      onTentarNovamente={recarregar}
      filtros={[
        <Selector key="mes" label="Mês" options={[{ label: 'Todos os meses', value: '' }, ...MESES.map((m, i) => ({ label: m, value: String(i + 1).padStart(2, '0') }))]} onSelect={setMes} value={mes} />,
        <Selector key="ano" label="Ano" options={opcoesDeAno(dados, (v) => v.dataVistoria)} onSelect={setAno} value={ano} />,
      ]}
      colunas={colunas}
      dados={filtradas}
      total={dados.length}
      vazio="Nenhuma vistoria cadastrada ainda."
      onPressLinha={(v) => !(v as any).pendente && router.push(`/vistorias/${v.id}` as any)}
    />
  );
}
