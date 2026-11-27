import type { Insumo } from '@/services/insumoService';

const DIA = 24 * 60 * 60 * 1000;

/** Situação de validade: vencido, vence em até 30 dias, ok ou sem validade. */
export const situacaoValidade = (i: Insumo, hoje = new Date()) => {
  if (!i.dataValidade) return 'Sem validade';
  const dias = (new Date(`${i.dataValidade}T00:00:00`).getTime() - hoje.getTime()) / DIA;
  if (dias < 0) return 'Vencido';
  if (dias <= 30) return 'Vence em até 30 dias';
  return 'Dentro da validade';
};

