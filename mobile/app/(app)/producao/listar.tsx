import React, { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import Selector from '@/components/formulario/selector';
import TelaLista from '@/components/telaLista';
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
];

export default function ListarProducoes() {
  const router = useRouter();
  const { dados, carregando, erro, recarregar } = useDadosApi<ProducaoRetornoDTO[]>(buscar, []);
  const [ano, setAno] = useState('');
  const ordenadas = useMemo(() => [...dados].sort((a, b) => String(b.dataColeta).localeCompare(String(a.dataColeta))), [dados]);
  const filtradas = ordenadas.filter((p) => !ano || String(p.dataColeta).startsWith(ano));

  return (
    <TelaLista
      titulo="Minhas Produções"
      cadastrar={{ titulo: 'Cadastrar produção', rota: '/producao/cadastrar' }}
      carregando={carregando}
      erro={erro}
      onTentarNovamente={recarregar}
      filtros={[<Selector key="ano" label="Ano" options={opcoesDeAno(dados, (p) => p.dataColeta)} onSelect={setAno} value={ano} />]}
      colunas={colunas}
      dados={filtradas}
      total={dados.length}
      vazio="Nenhuma produção cadastrada ainda."
      onPressLinha={(p) => !(p as any).pendente && router.push(`/producao/editar?id=${p.id}` as any)}
    />
  );
}
