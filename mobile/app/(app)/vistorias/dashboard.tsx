import React, { useMemo, useState } from 'react';
import Selector from '@/components/formulario/selector';
import PainelDashboard from '@/components/painelDashboard';
import { GraficoBarras, GraficoColunas, agrupar, opcoesDeAno, porMes, rotuloEnum } from '@/components/graficos';
import { useDadosApi } from '@/hooks/useDadosApi';
import { listarVistoriasPorProdutor } from '@/services/vistoriaService';
import type { VistoriaRetornoDTO } from '@/types/vistorias';

const buscar = async (id: number) => (await listarVistoriasPorProdutor(id)) as unknown as VistoriaRetornoDTO[];

const CORES: Record<string, string> = { SAUDAVEL: '#2E7D32', MANUTENCAO_NECESSARIA: '#F9A825', AGENDAR_COLHEITA: '#1565C0' };

export default function DashboardVistoria() {
  const { dados: vistorias, carregando, erro, recarregar } = useDadosApi<VistoriaRetornoDTO[]>(buscar, []);
  const anos = useMemo(() => opcoesDeAno(vistorias, (v) => v.dataVistoria), [vistorias]);
  const [ano, setAno] = useState('');
  const [condicao, setCondicao] = useState('');

  const filtradas = vistorias.filter((v) => (!ano || String(v.dataVistoria).startsWith(ano)) && (!condicao || v.condicao === condicao));
  const conta = (c: string) => filtradas.filter((v) => v.condicao === c).length;
  const comPragas = filtradas.filter((v) => (v.pragasIdentificadas ?? []).length > 0).length;
  const saude = filtradas.length ? Math.round((conta('SAUDAVEL') / filtradas.length) * 100) : 0;

  return (
    <PainelDashboard
      titulo="Resumo das Vistorias"
      subtitulo={`Período: ${ano || 'todos os anos'}`}
      carregando={carregando}
      erro={erro}
      vazio={vistorias.length === 0}
      mensagemVazio="Nenhuma vistoria cadastrada ainda. Registre uma vistoria para ver os indicadores."
      acaoVazio={{ titulo: 'Cadastrar primeira vistoria', rota: '/vistorias/cadastrar' }}
      onTentarNovamente={recarregar}
      filtros={
        <>
          <Selector label="Ano" options={anos} onSelect={setAno} value={ano} />
          <Selector
            label="Condição"
            options={[
              { label: 'Todas as condições', value: '' },
              { label: 'Saudável', value: 'SAUDAVEL' },
              { label: 'Manutenção Necessária', value: 'MANUTENCAO_NECESSARIA' },
              { label: 'Agendar Colheita', value: 'AGENDAR_COLHEITA' },
            ]}
            onSelect={setCondicao}
            value={condicao}
          />
        </>
      }
      kpis={[
        { label: 'Vistorias Realizadas', value: filtradas.length },
        { label: 'Saudáveis', value: conta('SAUDAVEL'), corDaBarra: '#2E7D32' },
        { label: 'Manutenção Necessária', value: conta('MANUTENCAO_NECESSARIA'), corDaBarra: '#F9A825' },
        { label: 'Com Pragas', value: comPragas, corDaBarra: '#C62828' },
        { label: 'Saúde Geral', value: `${saude}%` },
      ]}
    >
      <GraficoColunas titulo="Vistorias por mês" dados={porMes(filtradas, (v) => v.dataVistoria)} casas={0} />
      <GraficoBarras
        titulo="Condição das vistorias"
        dados={agrupar(filtradas, (v) => v.condicao).map((p) => ({ ...p, cor: CORES[p.rotulo], rotulo: rotuloEnum(p.rotulo) }))}
        casas={0}
      />
      <GraficoBarras
        titulo="Pragas identificadas"
        dados={agrupar(filtradas.flatMap((v) => v.pragasIdentificadas ?? []), (p) => rotuloEnum(p))}
        casas={0}
        vazio="Nenhuma praga registrada."
      />
      <GraficoBarras
        titulo="Perdas identificadas"
        dados={agrupar(filtradas.flatMap((v) => v.perdasIdentificadas ?? []), (p) => rotuloEnum(p))}
        casas={0}
        vazio="Nenhuma perda registrada."
      />
    </PainelDashboard>
  );
}
