import React, { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import Selector from '@/components/formulario/selector';
import TelaRelatorio from '@/components/telaRelatorio';
import { rotuloEnum } from '@/components/graficos';
import type { TabelaColuna } from '@/components/tabela';
import { useDadosApi } from '@/hooks/useDadosApi';
import { listarInsumos, Insumo } from '@/services/insumoService';
import { situacaoValidade } from '@/utils/insumos';
import { formatarNumero } from '@/utils/mel';
import { isoParaBr } from '@/utils/datas';

const buscar = (id: number) => listarInsumos(id);

const colunas: TabelaColuna<Insumo>[] = [
  { label: 'Insumo', dataKey: 'nome', sortable: true, flex: 2 },
  { label: 'Tipo', dataKey: 'tipo', sortable: true, flex: 1.4 },
  { label: 'Quantidade', dataKey: 'quantidade', sortable: true, render: (i) => `${formatarNumero(Number(i.quantidade))} ${rotuloEnum(i.unidadeMedida)}` },
  { label: 'Situação', dataKey: 'statusInsumo', sortable: true, render: (i) => ((i as any).pendente ? 'Pendente de envio' : rotuloEnum(i.statusInsumo)) },
  { label: 'Entrada', dataKey: 'dataEntrada', sortable: true, tipo: 'data' },
  { label: 'Validade', dataKey: 'dataValidade', sortable: true, flex: 1.6, render: (i) => (i.dataValidade ? `${isoParaBr(i.dataValidade)} · ${situacaoValidade(i)}` : 'Sem validade') },
];

export default function RelatorioInsumos() {
  const router = useRouter();
  const { dados, carregando, erro, recarregar } = useDadosApi<Insumo[]>(buscar, []);
  const [situacao, setSituacao] = useState('');
  const [tipo, setTipo] = useState('');
  const tipos = useMemo(() => [{ label: 'Todos os tipos', value: '' }, ...[...new Set(dados.map((i) => i.tipo).filter(Boolean))].sort().map((t) => ({ label: t, value: t }))], [dados]);
  const filtrados = dados.filter((i) => (!situacao || i.statusInsumo === situacao) && (!tipo || i.tipo === tipo));

  return (
    <TelaRelatorio
      titulo="Relatório de Insumos"
      carregando={carregando}
      erro={erro}
      onTentarNovamente={recarregar}
      filtros={[
        <Selector
          key="sit"
          label="Situação"
          options={[
            { label: 'Todas as situações', value: '' },
            { label: 'Disponível', value: 'DISPONIVEL' },
            { label: 'Em uso', value: 'EM_USO' },
            { label: 'Estoque baixo', value: 'ESTOQUE_BAIXO' },
          ]}
          onSelect={setSituacao}
          value={situacao}
        />,
        <Selector key="tipo" label="Tipo" options={tipos} onSelect={setTipo} value={tipo} />,
      ]}
      colunas={colunas}
      dados={filtrados}
      vazio={dados.length ? 'Nenhum insumo para estes filtros.' : 'Nenhum insumo cadastrado ainda.'}
      acaoVazio={dados.length ? undefined : { titulo: 'Cadastrar primeiro insumo', onPress: () => router.push('/insumos/cadastrar') }}
      onPressLinha={(i) => !(i as any).pendente && router.push(`/insumos/${i.id}` as any)}
      arquivoCsv="relatorio-insumos.csv"
    />
  );
}
