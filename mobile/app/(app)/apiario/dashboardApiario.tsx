import React, { useMemo, useState } from 'react';
import Selector from '@/components/formulario/selector';
import PainelDashboard from '@/components/painelDashboard';
import { GraficoBarras, agrupar, opcoesDeAno } from '@/components/graficos';
import { useDadosApi } from '@/hooks/useDadosApi';
import { listarApiariosPorProdutor } from '@/services/apiarioService';
import type { ApiarioRetornoDTO } from '@/types/apiario';

const buscar = (id: number) => listarApiariosPorProdutor(id);

export default function DashboardApiario() {
  const { dados: apiarios, carregando, erro, recarregar } = useDadosApi<ApiarioRetornoDTO[]>(buscar, []);
  const [ano, setAno] = useState('');

  const filtrados = useMemo(
    () => apiarios.filter((a) => !ano || String(a.dataDeCriacao ?? '').startsWith(ano)),
    [apiarios, ano],
  );
  const totalColmeias = filtrados.reduce((s, a) => s + (a.colmeias?.length ?? 0), 0);
  const ativas = filtrados.reduce((s, a) => s + (a.colmeias ?? []).filter((c) => c.ativa !== false).length, 0);
  const comLocalizacao = filtrados.filter((a) => a.latitude != null && a.longitude != null).length;

  return (
    <PainelDashboard
      titulo="Resumo dos Apiários"
      subtitulo={`Visualizando: ${ano || 'histórico completo'}`}
      carregando={carregando}
      erro={erro}
      vazio={apiarios.length === 0}
      mensagemVazio="Nenhum apiário cadastrado ainda. Cadastre um apiário para ver os indicadores."
      acaoVazio={{ titulo: 'Cadastrar primeiro apiário', rota: '/apiario/cadastrar' }}
      onTentarNovamente={recarregar}
      filtros={<Selector label="Ano de criação" options={opcoesDeAno(apiarios, (a) => a.dataDeCriacao)} onSelect={setAno} value={ano} />}
      kpis={[
        { label: 'Total de Apiários', value: filtrados.length },
        { label: 'Total de Colmeias', value: totalColmeias },
        { label: 'Colmeias Ativas', value: ativas },
        { label: 'Com Localização', value: `${comLocalizacao}/${filtrados.length}` },
      ]}
    >
      <GraficoBarras
        titulo="Colmeias por apiário"
        dados={filtrados.map((a) => ({ rotulo: a.nome, valor: a.colmeias?.length ?? 0 }))}
        casas={0}
        vazio="Nenhuma colmeia cadastrada nos apiários."
      />
      <GraficoBarras titulo="Apiários por cidade" dados={agrupar(filtrados, (a) => [a.cidade, a.estado].filter(Boolean).join(' - '))} casas={0} />
    </PainelDashboard>
  );
}
