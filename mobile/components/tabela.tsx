import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import cores from '@/constants/cores';
import Icon from '@/components/icon';
import { EstadoVazio } from '@/components/graficos';
import { isoParaBr } from '@/utils/datas';
import { formatarKgL, formatarNumero } from '@/utils/mel';

/** Tipos de valor com formatação pt-BR padronizada. */
export type TipoColuna = 'texto' | 'numero' | 'inteiro' | 'data' | 'kg';

export interface TabelaColuna<T extends object> {
  label: string;
  dataKey: keyof T | string;
  sortable?: boolean;
  /** Conteúdo personalizado (deve retornar texto para manter a exportação e o cartão). */
  render?: (item: T) => React.ReactNode;
  tipo?: TipoColuna;
  /** Peso da largura (1 = 120 px na tabela larga). */
  flex?: number;
}

interface Props<T extends object> {
  colunas: TabelaColuna<T>[];
  data: T[];
  /** Mensagem quando não há linhas. */
  vazio?: string;
  acaoVazio?: { titulo: string; onPress: () => void };
  onPressLinha?: (item: T) => void;
  /** Largura mínima (px) a partir da qual mostra tabela; abaixo, lista de cartões. Padrão 700. */
  larguraTabela?: number;
}

const POR_PAGINA = 25;

const valorBruto = (item: any, chave: any) => (item ? item[chave] : undefined);

/** Formata uma célula pelo tipo da coluna (data dd/mm/aaaa, número com vírgula, kg com litros). */
export function formatarCelula<T extends object>(coluna: TabelaColuna<T>, item: T): React.ReactNode {
  if (coluna.render) return coluna.render(item);
  const v = valorBruto(item, coluna.dataKey);
  if (v === null || v === undefined || v === '') return '—';
  switch (coluna.tipo) {
    case 'data':
      return isoParaBr(String(v));
    case 'numero':
      return formatarNumero(Number(v));
    case 'inteiro':
      return Number(v).toLocaleString('pt-BR');
    case 'kg':
      return formatarKgL(Number(v));
    default:
      return String(v);
  }
}

/**
 * Tabela padrão do app: cabeçalho, linhas zebradas, ordenação, formatação pt-BR e estado vazio.
 * Em telas estreitas vira lista de cartões (rótulo: valor), sem rolagem lateral da página.
 * Em telas largas a rolagem horizontal, se precisar, fica dentro do próprio contêiner.
 */
export default function Tabela<T extends object>({ colunas, data, vazio = 'Nenhum registro encontrado.', acaoVazio, onPressLinha, larguraTabela = 700 }: Props<T>) {
  const { width } = useWindowDimensions();
  const [ordem, setOrdem] = useState<{ chave: string; asc: boolean } | null>(null);
  const [limite, setLimite] = useState(POR_PAGINA);

  const ordenadas = useMemo(() => {
    if (!ordem) return data;
    return [...data].sort((a: any, b: any) => {
      const x = a[ordem.chave];
      const y = b[ordem.chave];
      if (x == null) return 1;
      if (y == null) return -1;
      const r = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'pt-BR', { numeric: true });
      return ordem.asc ? r : -r;
    });
  }, [data, ordem]);
  // Paginação no cliente (a API devolve a lista inteira).
  const linhas = ordenadas.slice(0, limite);
  const restantes = ordenadas.length - linhas.length;
  const maisLinhas = restantes > 0 && (
    <TouchableOpacity style={styles.mais} onPress={() => setLimite((l) => l + POR_PAGINA)} accessibilityRole="button">
      <Text style={styles.maisTexto}>Mostrar mais ({restantes} restante{restantes > 1 ? 's' : ''})</Text>
    </TouchableOpacity>
  );

  if (data.length === 0) return <EstadoVazio mensagem={vazio} icone="fileDocument" acao={acaoVazio} />;

  const ordenar = (c: TabelaColuna<T>) => {
    if (!c.sortable) return;
    const chave = String(c.dataKey);
    setOrdem((o) => (o && o.chave === chave ? { chave, asc: !o.asc } : { chave, asc: true }));
  };

  // Celular: cartões.
  if (width < larguraTabela) {
    const [principal, ...resto] = colunas;
    return (
      <View style={styles.cartoes} testID="tabela-cartoes">
        {linhas.map((item, i) => {
          const Conteudo = (
            <>
              <Text style={styles.cartaoTitulo}>{formatarCelula(principal, item)}</Text>
              {resto.map((c) => (
                <View key={String(c.dataKey)} style={styles.cartaoLinha}>
                  <Text style={styles.cartaoRotulo}>{c.label}</Text>
                  <Text style={styles.cartaoValor}>{formatarCelula(c, item)}</Text>
                </View>
              ))}
            </>
          );
          return onPressLinha ? (
            <TouchableOpacity key={i} style={styles.cartao} onPress={() => onPressLinha(item)} accessibilityRole="button">
              {Conteudo}
            </TouchableOpacity>
          ) : (
            <View key={i} style={styles.cartao}>
              {Conteudo}
            </View>
          );
        })}
        {maisLinhas}
      </View>
    );
  }

  // Tela larga: tabela com rolagem horizontal própria quando as colunas não couberem.
  const larguraMinima = colunas.reduce((s, c) => s + 120 * (c.flex ?? 1), 0);
  return (
    <View style={styles.moldura} testID="tabela">
      <ScrollView horizontal contentContainerStyle={{ minWidth: '100%' }}>
        <View style={{ minWidth: larguraMinima, flex: 1 }}>
          <View style={[styles.linha, styles.cabecalho]} accessibilityRole="header">
            {colunas.map((c) => {
              const ativa = ordem?.chave === String(c.dataKey);
              return (
                <TouchableOpacity
                  key={String(c.dataKey)}
                  style={[styles.celula, { flex: c.flex ?? 1 }]}
                  onPress={() => ordenar(c)}
                  disabled={!c.sortable}
                  accessibilityRole={c.sortable ? 'button' : undefined}
                  accessibilityLabel={c.sortable ? `Ordenar por ${c.label}` : c.label}
                >
                  <Text style={styles.textoCabecalho}>{c.label}</Text>
                  {c.sortable && <Icon name={ativa ? (ordem!.asc ? 'setaCima' : 'setaBaixo') : 'chevronDown'} size={16} color={ativa ? cores.textoSobrePrimaria : '#8D6E63'} />}
                </TouchableOpacity>
              );
            })}
          </View>
          {linhas.map((item, i) => {
            const Linha = (
              <View style={[styles.linha, i % 2 === 1 && styles.zebra]}>
                {colunas.map((c) => {
                  const conteudo = formatarCelula(c, item);
                  const numerico = c.tipo === 'numero' || c.tipo === 'inteiro' || c.tipo === 'kg';
                  return (
                    <View key={String(c.dataKey)} style={[styles.celula, { flex: c.flex ?? 1 }, numerico && styles.celulaNumero]}>
                      {typeof conteudo === 'string' || typeof conteudo === 'number' ? <Text style={styles.textoCelula}>{conteudo}</Text> : conteudo}
                    </View>
                  );
                })}
              </View>
            );
            return onPressLinha ? (
              <TouchableOpacity key={i} onPress={() => onPressLinha(item)} accessibilityRole="button">
                {Linha}
              </TouchableOpacity>
            ) : (
              <View key={i}>{Linha}</View>
            );
          })}
        </View>
      </ScrollView>
      {maisLinhas}
    </View>
  );
}

const styles = StyleSheet.create({
  moldura: { width: '100%', backgroundColor: cores.superficie, borderRadius: 12, borderWidth: 1, borderColor: cores.bordaSuave, overflow: 'hidden' },
  linha: { flexDirection: 'row', minHeight: 48, alignItems: 'stretch' },
  cabecalho: { backgroundColor: cores.primaria },
  zebra: { backgroundColor: cores.destaque },
  celula: { paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 4 },
  celulaNumero: { justifyContent: 'flex-end' },
  textoCabecalho: { fontWeight: 'bold', fontSize: 15, color: cores.textoSobrePrimaria, flexShrink: 1 },
  textoCelula: { fontSize: 15, color: cores.texto, flexShrink: 1 },
  cartoes: { gap: 10, width: '100%' },
  mais: { minHeight: 48, alignItems: 'center', justifyContent: 'center', borderTopWidth: 1, borderTopColor: cores.bordaSuave },
  maisTexto: { fontSize: 16, fontWeight: 'bold', color: cores.secundaria },
  cartao: { backgroundColor: cores.superficie, borderRadius: 12, borderWidth: 1, borderColor: cores.bordaSuave, borderLeftWidth: 5, borderLeftColor: cores.primaria, padding: 12, gap: 6 },
  cartaoTitulo: { fontSize: 17, fontWeight: 'bold', color: cores.texto },
  cartaoLinha: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' },
  cartaoRotulo: { fontSize: 14, color: cores.textoSecundario, flexShrink: 0 },
  cartaoValor: { fontSize: 15, color: cores.texto, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
});
