import React, { useMemo, useState } from 'react';
import Selector from '@/components/formulario/selector';
import PainelDashboard from '@/components/painelDashboard';
import { GraficoBarras, GraficoColunas, agrupar, opcoesDeAno, porMes, rotuloEnum } from '@/components/graficos';
import { useDadosApi } from '@/hooks/useDadosApi';
import { listarLotesDetalhado } from '@/services/loteService';
import { formatarKgL } from '@/utils/mel';
import type { LoteRetornoListadoDTO } from '@/types/rastreabilidade';

const buscar = async (id: number): Promise<LoteRetornoListadoDTO[]> => {
  const dados = await listarLotesDetalhado(id);
  return Array.isArray(dados) ? dados : [];
};

export default function DashboardRastreabilidade() {
  const { dados: lotes, carregando, erro, recarregar } = useDadosApi<LoteRetornoListadoDTO[]>(buscar, []);
  const anos = useMemo(() => opcoesDeAno(lotes, (l) => l.dataProducao), [lotes]);
  const [ano, setAno] = useState('');
  const [apiario, setApiario] = useState('');
  const opcoesApiario = useMemo(
    () => [{ label: 'Todos os apiários', value: '' }, ...[...new Set(lotes.map((l) => l.nomeApiario).filter(Boolean))].map((n) => ({ label: n, value: n }))],
    [lotes],
  );

  const filtrados = lotes.filter((l) => (!ano || String(l.dataProducao).startsWith(ano)) && (!apiario || l.nomeApiario === apiario));
  const total = filtrados.reduce((s, l) => s + (Number(l.quantidadeProduzida) || 0), 0);
  const vendidos = filtrados.filter((l) => l.vendido).length;
  const origens = new Set(filtrados.map((l) => l.nomeApiario)).size;

  return (
    <PainelDashboard
      titulo="Resumo dos Lotes"
      subtitulo={`Lotes: ${ano || 'todos os anos'} · ${apiario || 'todos os apiários'}`}
      carregando={carregando}
      erro={erro}
      vazio={lotes.length === 0}
      mensagemVazio="Nenhum lote cadastrado ainda. Cadastre um lote para ver os indicadores."
      acaoVazio={{ titulo: 'Cadastrar primeiro lote', rota: '/rastreabilidade/cadastrar' }}
      onTentarNovamente={recarregar}
      filtros={
        <>
          <Selector label="Ano" options={anos} onSelect={setAno} value={ano} />
          <Selector label="Apiário" options={opcoesApiario} onSelect={setApiario} value={apiario} />
        </>
      }
      kpis={[
        { label: 'Lotes Rastreados', value: filtrados.length },
        { label: 'Quantidade total', value: formatarKgL(total) },
        { label: 'Vendidos', value: `${filtrados.length ? Math.round((vendidos / filtrados.length) * 100) : 0}%` },
        { label: 'Apiários de Origem', value: origens },
      ]}
    >
      <GraficoColunas titulo="Produção por mês" unidade="kg" dados={porMes(filtrados, (l) => l.dataProducao, (l) => Number(l.quantidadeProduzida))} />
      <GraficoBarras titulo="Lotes por florada" dados={agrupar(filtrados, (l) => rotuloEnum(l.tipoFlorada))} casas={0} />
      <GraficoBarras titulo="Lotes por tipo de abelha" dados={agrupar(filtrados, (l) => rotuloEnum(l.tipoAbelha))} casas={0} />
      <GraficoBarras
        titulo="Vendidos x em estoque"
        dados={[
          { rotulo: 'Vendidos', valor: vendidos, cor: '#2E7D32' },
          { rotulo: 'Em estoque', valor: filtrados.length - vendidos, cor: '#EFAF1A' },
        ]}
        casas={0}
      />
    </PainelDashboard>
  );
}
