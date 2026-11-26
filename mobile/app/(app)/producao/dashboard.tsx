import React, { useMemo, useState } from 'react';
import Selector from '@/components/formulario/selector';
import PainelDashboard from '@/components/painelDashboard';
import { GraficoBarras, GraficoColunas, agrupar, opcoesDeAno, porMes } from '@/components/graficos';
import { useDadosApi } from '@/hooks/useDadosApi';
import { getProducoes } from '@/services/producaoService';
import type { ProducaoRetornoDTO } from '@/types/producao';
import { formatarKgL, formatarNumero, kgParaLitros, paraKg, useDensidadeMel } from '@/utils/mel';

const emKg = (p: ProducaoRetornoDTO) => paraKg(p.quantidade, p.unidadeMedida);

const ESTACOES = [
  { label: 'Todas as estações', value: '' },
  { label: 'Verão', value: 'verao' },
  { label: 'Outono', value: 'outono' },
  { label: 'Inverno', value: 'inverno' },
  { label: 'Primavera', value: 'primavera' },
];
const estacaoDe = (iso: string) => {
  const m = Number(iso.slice(5, 7));
  const d = Number(iso.slice(8, 10));
  const md = m * 100 + d;
  if (md >= 1221 || md < 320) return 'verao';
  if (md < 621) return 'outono';
  if (md < 922) return 'inverno';
  return 'primavera';
};

const buscar = (id: number) => getProducoes(id);
const fmt = (n: number) => formatarNumero(n);

export default function DashboardProducao() {
  const { dados: producoes, carregando, erro, recarregar } = useDadosApi<ProducaoRetornoDTO[]>(buscar, []);
  const anos = useMemo(() => opcoesDeAno(producoes, (p) => p.dataColeta), [producoes]);
  const [anoEscolhido, setAno] = useState<string | null>(null);
  const ano = anoEscolhido ?? anos[1]?.value ?? ''; // padrão: ano mais recente com dados
  const [estacao, setEstacao] = useState('');

  const filtradas = producoes.filter(
    (p) => (!ano || String(p.dataColeta).startsWith(ano)) && (!estacao || (p.dataColeta && estacaoDe(p.dataColeta) === estacao)),
  );
  const totalKg = filtradas.reduce((s, p) => s + emKg(p), 0);
  const densidade = useDensidadeMel();
  const totalL = kgParaLitros(totalKg, densidade);
  const colmeias = new Set(filtradas.map((p) => p.colmeiaId ?? p.nomeColmeia)).size;

  return (
    <PainelDashboard
      titulo="Resumo da Produção"
      subtitulo={`Período: ${ano || 'todos os anos'}${estacao ? ` · ${ESTACOES.find((e) => e.value === estacao)?.label}` : ''}`}
      carregando={carregando}
      erro={erro}
      vazio={producoes.length === 0}
      mensagemVazio="Nenhuma produção cadastrada ainda. Registre uma coleta para ver os indicadores."
      acaoVazio={{ titulo: 'Cadastrar primeira produção', rota: '/producao/cadastrar' }}
      onTentarNovamente={recarregar}
      filtros={
        <>
          <Selector label="Ano" options={anos} onSelect={setAno} value={ano} />
          <Selector label="Estação" options={ESTACOES} onSelect={setEstacao} value={estacao} />
        </>
      }
      kpis={[
        { label: 'Produção total (kg)', value: fmt(totalKg) },
        { label: 'Produção total (L)', value: fmt(totalL) },
        { label: 'Coletas', value: filtradas.length },
        { label: 'Média por Colmeia (kg)', value: fmt(colmeias ? totalKg / colmeias : 0) },
      ]}
    >
      <GraficoColunas titulo={`Produção mensal ${ano || ''}`.trim()} unidade="kg" dados={porMes(filtradas, (p) => p.dataColeta, emKg)} />
      <GraficoBarras titulo="Produção por tipo de mel" formatar={(n) => formatarKgL(n)} dados={agrupar(filtradas, (p) => p.tipoProducao, emKg)} />
      <GraficoBarras titulo="Produção por apiário" formatar={(n) => formatarKgL(n)} dados={agrupar(filtradas, (p) => p.nomeApiario, emKg)} />
    </PainelDashboard>
  );
}
