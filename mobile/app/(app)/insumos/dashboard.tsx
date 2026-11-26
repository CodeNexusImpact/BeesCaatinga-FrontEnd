import React from 'react';
import PainelDashboard from '@/components/painelDashboard';
import { GraficoBarras, agrupar, rotuloEnum } from '@/components/graficos';
import { useDadosApi } from '@/hooks/useDadosApi';
import { listarInsumos, Insumo } from '@/services/insumoService';

const buscar = (id: number) => listarInsumos(id);
const DIA = 24 * 60 * 60 * 1000;

/** Situação de validade: vencido, vence em até 30 dias, ok ou sem validade. */
export const situacaoValidade = (i: Insumo, hoje = new Date()) => {
  if (!i.dataValidade) return 'Sem validade';
  const dias = (new Date(`${i.dataValidade}T00:00:00`).getTime() - hoje.getTime()) / DIA;
  if (dias < 0) return 'Vencido';
  if (dias <= 30) return 'Vence em até 30 dias';
  return 'Dentro da validade';
};

const CORES_STATUS: Record<string, string> = { DISPONIVEL: '#2E7D32', EM_USO: '#1565C0', ESTOQUE_BAIXO: '#C62828' };
const CORES_VALIDADE: Record<string, string> = {
  Vencido: '#C62828',
  'Vence em até 30 dias': '#F9A825',
  'Dentro da validade': '#2E7D32',
  'Sem validade': '#9E9E9E',
};

export default function DashboardInsumos() {
  const { dados: insumos, carregando, erro, recarregar } = useDadosApi<Insumo[]>(buscar, []);
  const conta = (s: string) => insumos.filter((i) => i.statusInsumo === s).length;
  const vencendo = insumos.filter((i) => ['Vencido', 'Vence em até 30 dias'].includes(situacaoValidade(i))).length;

  return (
    <PainelDashboard
      titulo="Resumo dos Insumos"
      subtitulo="Estoque atual de insumos"
      carregando={carregando}
      erro={erro}
      vazio={insumos.length === 0}
      mensagemVazio="Nenhum insumo cadastrado ainda. Cadastre um insumo para ver os indicadores."
      acaoVazio={{ titulo: 'Cadastrar primeiro insumo', rota: '/insumos/cadastrar' }}
      onTentarNovamente={recarregar}
      kpis={[
        { label: 'Total de Insumos', value: insumos.length },
        { label: 'Disponíveis', value: conta('DISPONIVEL'), corDaBarra: '#2E7D32' },
        { label: 'Em Uso', value: conta('EM_USO'), corDaBarra: '#1565C0' },
        { label: 'Estoque Baixo', value: conta('ESTOQUE_BAIXO'), corDaBarra: '#C62828' },
        { label: 'Vencidos ou Vencendo', value: vencendo, corDaBarra: '#F9A825' },
      ]}
    >
      <GraficoBarras
        titulo="Insumos por situação"
        dados={agrupar(insumos, (i) => i.statusInsumo).map((p) => ({ ...p, cor: CORES_STATUS[p.rotulo], rotulo: rotuloEnum(p.rotulo) }))}
        casas={0}
      />
      <GraficoBarras titulo="Insumos por tipo" dados={agrupar(insumos, (i) => i.tipo)} casas={0} />
      <GraficoBarras
        titulo="Validade"
        dados={agrupar(insumos, (i) => situacaoValidade(i)).map((p) => ({ ...p, cor: CORES_VALIDADE[p.rotulo] }))}
        casas={0}
      />
    </PainelDashboard>
  );
}
