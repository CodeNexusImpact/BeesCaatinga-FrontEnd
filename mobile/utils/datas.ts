/** Datas no padrão brasileiro (dd/mm/aaaa) ↔ ISO (aaaa-mm-dd) usado pela API nas respostas. */
export const isoParaBr = (iso?: string | null) => {
  if (!iso) return '';
  const [a, m, d] = String(iso).slice(0, 10).split('-');
  return d && m && a ? `${d}/${m}/${a}` : String(iso);
};

export const brParaIso = (br?: string | null) => {
  const [d, m, a] = String(br ?? '').split('/');
  return d && m && a ? `${a}-${m.padStart(2, '0')}-${d.padStart(2, '0')}` : '';
};

/** Valida dd/mm/aaaa (inclui dia existente no mês). */
export const dataValida = (br: string) => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(br)) return false;
  const [d, m, a] = br.split('/').map(Number);
  const dt = new Date(a, m - 1, d);
  return dt.getFullYear() === a && dt.getMonth() === m - 1 && dt.getDate() === d && a > 1900;
};
