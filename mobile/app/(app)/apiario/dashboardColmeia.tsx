import React, { useMemo, useState } from 'react';
import Selector from '@/components/formulario/selector';
import PainelDashboard from '@/components/painelDashboard';
import { GraficoBarras, agrupar, rotuloEnum } from '@/components/graficos';
import { useDadosApi } from '@/hooks/useDadosApi';
import { listarColmeiasPorProdutor } from '@/services/colmeiaService';
import type { ColmeiaRetornoDTO } from '@/types/apiario/colmeia';

const buscar = async (id: number): Promise<ColmeiaRetornoDTO[]> => {
  const dados = await listarColmeiasPorProdutor(id);
  return Array.isArray(dados) ? dados : [];
};

const CORES_STATUS: Record<string, string> = {
  SAUDAVEL: '#2E7D32',
  MANUTENCAO_NECESSARIA: '#F9A825',
  TRATAMENTO_NECESSARIO: '#EF6C00',
  PERIGO_CLIMATICO: '#C62828',
  INATIVO: '#9E9E9E',
};

export default function DashboardColmeias() {
  const { dados: colmeias, carregando, erro, recarregar } = useDadosApi<ColmeiaRetornoDTO[]>(buscar, []);
  const [apiario, setApiario] = useState('');

  const opcoesApiario = useMemo(
    () => [{ label: 'Todos os apiários', value: '' }, ...[...new Set(colmeias.map((c) => c.nomeApiario).filter(Boolean))].map((n) => ({ label: n, value: n }))],
    [colmeias],
  );
  const filtradas = colmeias.filter((c) => !apiario || c.nomeApiario === apiario);
  const ativas = filtradas.filter((c) => c.ativa !== false).length;
  const atencao = filtradas.filter((c) => c.statusColmeia && !['SAUDAVEL', 'INATIVO'].includes(c.statusColmeia)).length;
  const porStatus = agrupar(filtradas, (c) => c.statusColmeia ?? '').map((p) => ({ ...p, cor: CORES_STATUS[p.rotulo], rotulo: rotuloEnum(p.rotulo) }));

  return (
    <PainelDashboard
      titulo="Resumo das Colmeias"
      subtitulo={`Análise: ${apiario || 'todos os apiários'}`}
      carregando={carregando}
      erro={erro}
      vazio={colmeias.length === 0}
      mensagemVazio="Nenhuma colmeia cadastrada ainda. Cadastre uma colmeia em um apiário para ver os indicadores."
      acaoVazio={{ titulo: 'Cadastrar primeira colmeia', rota: '/apiario/colmeia/cadastrar' }}
      onTentarNovamente={recarregar}
      filtros={<Selector label="Apiário" options={opcoesApiario} onSelect={setApiario} value={apiario} />}
      kpis={[
        { label: 'Total de Colmeias', value: filtradas.length },
        { label: 'Ativas', value: ativas },
        { label: 'Inativas', value: filtradas.length - ativas },
        { label: 'Precisam de Atenção', value: atencao, corDaBarra: '#EF6C00' },
      ]}
    >
      <GraficoBarras titulo="Situação das colmeias" dados={porStatus} casas={0} />
      <GraficoBarras titulo="Colmeias por material" dados={agrupar(filtradas, (c) => rotuloEnum(c.tipo))} casas={0} />
      <GraficoBarras titulo="Colmeias por apiário" dados={agrupar(filtradas, (c) => c.nomeApiario)} casas={0} />
    </PainelDashboard>
  );
}
