import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import type { ProducaoRetornoDTO } from '@/types/producao';
import type { Kpi, GraficoConfig } from '@/types/common';

export interface FiltrosProducao {
  ano?: string;
  mes?: string;
  apiario?: string;
}

interface UseProducaoResult {
  data: ProducaoRetornoDTO[];
  kpis: Kpi[];
  graficos: GraficoConfig[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const formatarKg = (n: number) => `${n.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} kg`;

/** Busca as produções do produtor logado e deriva KPIs e gráficos a partir dos dados reais. */
export const useProducao = (filtros: FiltrosProducao = {}): UseProducaoResult => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<ProducaoRetornoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    const produtorId = user?.id;
    if (!produtorId) return;
    let ativo = true;
    api
      .get<ProducaoRetornoDTO[]>(`/producoes/${produtorId}`)
      .then((res) => {
        if (!ativo) return;
        setTodos(Array.isArray(res.data) ? res.data : []);
        setError(null);
      })
      .catch((err) => {
        if (!ativo) return;
        console.error(err);
        setError('Erro ao carregar dados');
      })
      .finally(() => ativo && setLoading(false));
    return () => {
      ativo = false;
    };
  }, [user?.id, versao]);

  const refetch = useCallback(() => {
    setLoading(true);
    setVersao((v) => v + 1);
  }, []);

  const { ano, mes, apiario } = filtros;
  const data = useMemo(() => {
    const mesPreenchido = mes ? mes.padStart(2, '0') : '';
    return todos.filter(
      (p) =>
        (!ano || p.dataColeta?.startsWith(ano)) &&
        (!mesPreenchido || p.dataColeta?.slice(5, 7) === mesPreenchido) &&
        (!apiario || p.nomeApiario === apiario),
    );
  }, [todos, ano, mes, apiario]);

  const kpis = useMemo<Kpi[]>(() => {
    const total = data.reduce((s, p) => s + (p.quantidade ?? 0), 0);
    const colmeias = new Set(data.map((p) => p.nomeColmeia).filter(Boolean)).size;
    return [
      { label: 'Produção Total', value: formatarKg(total) },
      { label: 'Média/Colmeia', value: formatarKg(colmeias ? total / colmeias : 0) },
    ];
  }, [data]);

  const graficos = useMemo<GraficoConfig[]>(() => {
    const porMes = new Map<string, number>();
    [...data]
      .sort((a, b) => (a.dataColeta ?? '').localeCompare(b.dataColeta ?? ''))
      .forEach((p) => {
        if (!p.dataColeta) return;
        const chave = `${MESES[Number(p.dataColeta.slice(5, 7)) - 1]}/${p.dataColeta.slice(2, 4)}`;
        porMes.set(chave, (porMes.get(chave) ?? 0) + (p.quantidade ?? 0));
      });
    const porStatus = new Map<string, number>();
    data.forEach((p) => porStatus.set(p.statusProduto, (porStatus.get(p.statusProduto) ?? 0) + 1));
    return [
      {
        tipo: 'linha',
        titulo: 'Produção Mensal (kg)',
        dados: [...porMes].map(([m, producao]) => ({ mes: m, producao })),
      },
      {
        tipo: 'barra',
        titulo: 'Status dos Produtos',
        dados: [...porStatus].map(([status, quantidade]) => ({ status, quantidade })),
      },
    ];
  }, [data]);

  return { data, kpis, graficos, loading: loading && !!user?.id, error, refetch };
};
