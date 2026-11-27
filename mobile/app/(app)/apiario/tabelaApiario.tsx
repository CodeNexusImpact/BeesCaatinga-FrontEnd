import React, { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import Selector from '@/components/formulario/selector';
import TelaRelatorio from '@/components/telaRelatorio';
import { opcoesDeAno } from '@/components/graficos';
import type { TabelaColuna } from '@/components/tabela';
import { useDadosApi } from '@/hooks/useDadosApi';
import { listarApiariosPorProdutor } from '@/services/apiarioService';
import type { ApiarioRetornoDTO } from '@/types/apiario';

const buscar = (id: number) => listarApiariosPorProdutor(id);

const colunas: TabelaColuna<ApiarioRetornoDTO>[] = [
  { label: 'Apiário', dataKey: 'nome', sortable: true, flex: 2 },
  { label: 'Registro', dataKey: 'nRegistro', sortable: true, flex: 1.5 },
  { label: 'Criado em', dataKey: 'dataDeCriacao', sortable: true, tipo: 'data' },
  { label: 'Cidade', dataKey: 'cidade', sortable: true, render: (a) => [a.cidade, a.estado].filter(Boolean).join(' - ') || '—' },
  { label: 'Propriedade', dataKey: 'nomeDaPropriedade', sortable: true, flex: 1.5 },
  { label: 'Colmeias', dataKey: 'colmeias', render: (a) => String(a.colmeias?.length ?? 0) },
  { label: 'Localização', dataKey: 'latitude', render: (a) => (a.latitude != null ? 'No mapa' : 'Sem local') },
];

export default function RelatorioApiarios() {
  const router = useRouter();
  const { dados, carregando, erro, recarregar } = useDadosApi<ApiarioRetornoDTO[]>(buscar, []);
  const [ano, setAno] = useState('');
  const [cidade, setCidade] = useState('');
  const cidades = useMemo(() => [{ label: 'Todas as cidades', value: '' }, ...[...new Set(dados.map((a) => a.cidade).filter(Boolean))].sort().map((c) => ({ label: c, value: c }))], [dados]);
  const filtrados = dados.filter((a) => (!ano || String(a.dataDeCriacao ?? '').startsWith(ano)) && (!cidade || a.cidade === cidade));

  return (
    <TelaRelatorio
      titulo="Relatório de Apiários"
      carregando={carregando}
      erro={erro}
      onTentarNovamente={recarregar}
      filtros={[
        <Selector key="ano" label="Ano de criação" options={opcoesDeAno(dados, (a) => a.dataDeCriacao)} onSelect={setAno} value={ano} />,
        <Selector key="cidade" label="Cidade" options={cidades} onSelect={setCidade} value={cidade} />,
      ]}
      colunas={colunas}
      dados={filtrados}
      vazio={dados.length ? 'Nenhum apiário para estes filtros.' : 'Nenhum apiário cadastrado ainda.'}
      acaoVazio={dados.length ? undefined : { titulo: 'Cadastrar primeiro apiário', onPress: () => router.push('/apiario/cadastrar') }}
      onPressLinha={(a) => router.push(`/apiario/editar?id=${a.id}` as any)}
      arquivoCsv="relatorio-apiarios.csv"
    />
  );
}
