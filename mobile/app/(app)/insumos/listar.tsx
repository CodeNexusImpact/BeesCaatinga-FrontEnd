import React, { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import Selector from '@/components/formulario/selector';
import TelaLista from '@/components/telaLista';
import { rotuloEnum } from '@/components/graficos';
import type { TabelaColuna } from '@/components/tabela';
import { useDadosApi } from '@/hooks/useDadosApi';
import { listarInsumos, Insumo } from '@/services/insumoService';
import { formatarNumero } from '@/utils/mel';
import { isoParaBr } from '@/utils/datas';
import { situacaoValidade } from '@/utils/insumos';

const buscar = (id: number) => listarInsumos(id);

const colunas: TabelaColuna<Insumo>[] = [
  { label: 'Insumo', dataKey: 'nome', sortable: true, flex: 2 },
  { label: 'Tipo', dataKey: 'tipo', sortable: true },
  { label: 'Quantidade', dataKey: 'quantidade', sortable: true, render: (i) => `${formatarNumero(Number(i.quantidade))} ${rotuloEnum(i.unidadeMedida)}` },
  { label: 'Situação', dataKey: 'statusInsumo', sortable: true, render: (i) => ((i as any).pendente ? 'Pendente de envio' : rotuloEnum(i.statusInsumo)) },
  { label: 'Validade', dataKey: 'dataValidade', sortable: true, flex: 1.6, render: (i) => (i.dataValidade ? `${isoParaBr(i.dataValidade)} · ${situacaoValidade(i)}` : 'Sem validade') },
];

export default function ListarInsumos() {
  const router = useRouter();
  const { dados, carregando, erro, recarregar } = useDadosApi<Insumo[]>(buscar, []);
  const [tipo, setTipo] = useState('');
  const tipos = useMemo(() => [{ label: 'Todos os tipos', value: '' }, ...[...new Set(dados.map((i) => i.tipo).filter(Boolean))].sort().map((t) => ({ label: t, value: t }))], [dados]);
  const filtrados = dados.filter((i) => !tipo || i.tipo === tipo);

  return (
    <TelaLista
      titulo="Meus Insumos"
      cadastrar={{ titulo: 'Cadastrar insumo', rota: '/insumos/cadastrar' }}
      carregando={carregando}
      erro={erro}
      onTentarNovamente={recarregar}
      filtros={[<Selector key="tipo" label="Tipo" options={tipos} onSelect={setTipo} value={tipo} />]}
      colunas={colunas}
      dados={filtrados}
      total={dados.length}
      vazio="Nenhum insumo cadastrado ainda."
      onPressLinha={(i) => !(i as any).pendente && router.push(`/insumos/${i.id}` as any)}
    />
  );
}
