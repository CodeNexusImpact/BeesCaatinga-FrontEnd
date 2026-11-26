import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import cores from '@/constants/cores';
import Botao from '@/components/formulario/botao';
import Icon from '@/components/icon';

/**
 * Gráficos simples feitos com View (sem SVG/canvas): renderizam igual no Android, iOS e web,
 * sem avisos de console do react-native-svg no navegador.
 */
export interface PontoGrafico {
  rotulo: string;
  valor: number;
  cor?: string;
}

export const PALETA = ['#EFAF1A', '#2E7D32', '#1565C0', '#C62828', '#7D4CDB', '#F57C00', '#00838F', '#6D4C41'];

const formatarNum = (n: number, casas = 1) => n.toLocaleString('pt-BR', { maximumFractionDigits: casas });

interface PropsGrafico {
  titulo: string;
  dados: PontoGrafico[];
  unidade?: string;
  casas?: number;
  vazio?: string;
  /** Formatação personalizada do valor (ex.: formatarKgL → "12,50 kg (8,80 L)"). */
  formatar?: (n: number) => string;
}

/** Barras horizontais para categorias (tipo, status, apiário...). */
export function GraficoBarras({ titulo, dados, unidade = '', casas = 1, vazio = 'Sem dados para exibir.', formatar }: PropsGrafico) {
  const max = Math.max(0, ...dados.map((d) => d.valor));
  return (
    <View style={styles.card} accessibilityLabel={`Gráfico ${titulo}`} testID="grafico">
      <Text style={styles.titulo}>{titulo}</Text>
      {dados.length === 0 || max === 0 ? (
        <Text style={styles.vazio}>{vazio}</Text>
      ) : (
        dados.map((d, i) => (
          <View key={`${d.rotulo}-${i}`} style={styles.linha}>
            <Text style={styles.rotulo} numberOfLines={1}>
              {d.rotulo}
            </Text>
            <View style={styles.trilha}>
              <View
                style={[styles.barra, { width: `${Math.max(2, (d.valor / max) * 100)}%`, backgroundColor: d.cor ?? PALETA[i % PALETA.length] }]}
              />
            </View>
            <Text style={[styles.valor, formatar && styles.valorLongo]}>
              {formatar ? formatar(d.valor) : `${formatarNum(d.valor, casas)}${unidade ? ` ${unidade}` : ''}`}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}

/** Colunas verticais para séries (ex.: meses do ano). */
export function GraficoColunas({ titulo, dados, unidade = '', casas = 1, vazio = 'Sem dados para exibir.' }: PropsGrafico) {
  const max = Math.max(0, ...dados.map((d) => d.valor));
  return (
    <View style={styles.card} accessibilityLabel={`Gráfico ${titulo}`} testID="grafico">
      <Text style={styles.titulo}>
        {titulo}
        {unidade ? ` (${unidade})` : ''}
      </Text>
      {dados.length === 0 || max === 0 ? (
        <Text style={styles.vazio}>{vazio}</Text>
      ) : (
        <View style={styles.colunas}>
          {dados.map((d, i) => (
            <View key={`${d.rotulo}-${i}`} style={styles.coluna}>
              <Text style={styles.valorColuna}>{d.valor ? formatarNum(d.valor, casas) : ''}</Text>
              <View style={styles.trilhaColuna}>
                <View style={[styles.barraColuna, { height: `${(d.valor / max) * 100}%`, backgroundColor: d.cor ?? PALETA[0] }]} />
              </View>
              <Text style={styles.rotuloColuna}>{d.rotulo}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

/** Estados de carregamento, erro e vazio padronizados para as telas com dados da API. */
export function EstadoCarregando({ texto = 'Carregando...' }: { texto?: string }) {
  return (
    <View style={styles.estado}>
      <ActivityIndicator size="large" color={cores.primaria} />
      <Text style={styles.estadoTexto}>{texto}</Text>
    </View>
  );
}

export function EstadoErro({ mensagem, onTentarNovamente }: { mensagem: string; onTentarNovamente?: () => void }) {
  return (
    <View style={styles.estado}>
      <Text style={[styles.estadoTexto, { color: '#C62828' }]}>{mensagem}</Text>
      {onTentarNovamente && <Botao title="Tentar novamente" onPress={onTentarNovamente} cor="secundaria" tamanho="pequeno" />}
    </View>
  );
}

export function EstadoVazio({ mensagem, icone = 'beehiveOutline', acao }: { mensagem: string; icone?: string; acao?: { titulo: string; onPress: () => void } }) {
  return (
    <View style={styles.estado}>
      <View style={styles.estadoIcone}>
        <Icon name={icone} size={44} color={cores.secundaria} />
      </View>
      <Text style={[styles.estadoTexto, { fontSize: 17, color: cores.texto }]}>{mensagem}</Text>
      {acao && <Botao title={acao.titulo} onPress={acao.onPress} cor="primaria" iconName="add" />}
    </View>
  );
}

/** Agrupa e soma valores por chave, ordenando do maior para o menor. */
export function agrupar<T>(itens: T[], chave: (i: T) => string, valor: (i: T) => number = () => 1): PontoGrafico[] {
  const mapa = new Map<string, number>();
  itens.forEach((i) => {
    const k = chave(i) || 'Não informado';
    mapa.set(k, (mapa.get(k) ?? 0) + (Number(valor(i)) || 0));
  });
  return [...mapa.entries()].map(([rotulo, v]) => ({ rotulo, valor: v })).sort((a, b) => b.valor - a.valor);
}

export const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

/** Série mensal (12 meses) a partir de datas ISO (yyyy-MM-dd). */
export function porMes<T>(itens: T[], data: (i: T) => string | null | undefined, valor: (i: T) => number = () => 1): PontoGrafico[] {
  const soma = new Array(12).fill(0);
  itens.forEach((i) => {
    const d = data(i);
    const m = d ? Number(String(d).slice(5, 7)) : NaN;
    if (m >= 1 && m <= 12) soma[m - 1] += Number(valor(i)) || 0;
  });
  return soma.map((v, idx) => ({ rotulo: MESES[idx], valor: v }));
}

/** Opções de ano a partir das datas presentes nos dados (mais recente primeiro). */
export function opcoesDeAno<T>(itens: T[], data: (i: T) => string | null | undefined, rotuloTodos = 'Todos os anos') {
  const anos = [...new Set(itens.map((i) => String(data(i) ?? '').slice(0, 4)).filter((a) => /^\d{4}$/.test(a)))].sort().reverse();
  return [{ label: rotuloTodos, value: '' }, ...anos.map((a) => ({ label: a, value: a }))];
}

/** Rótulos em português (com acentos) para os enums do backend. */
const ROTULOS: Record<string, string> = {
  SAUDAVEL: 'Saudável', MANUTENCAO_NECESSARIA: 'Manutenção necessária', TRATAMENTO_NECESSARIO: 'Tratamento necessário',
  PERIGO_CLIMATICO: 'Perigo climático', INATIVO: 'Inativa', AGENDAR_COLHEITA: 'Agendar colheita',
  DISPONIVEL: 'Disponível', EM_USO: 'Em uso', ESTOQUE_BAIXO: 'Estoque baixo',
  MADEIRA: 'Madeira', CONCRETO: 'Concreto', POLIESTIRENO: 'Poliestireno',
  VARROA: 'Varroa', FORMIGA: 'Formiga', TRACA: 'Traça', LAGARTIXA: 'Lagartixa', OUTRO: 'Outro',
  ALIMENTACAO: 'Alimentação', VENENO: 'Veneno', CLIMA: 'Clima',
  JANDAIRA: 'Jandaíra', URUCU_NORDESTINA: 'Uruçu nordestina', AFRICANIZADA: 'Africanizada', APIS_MELLIFERA: 'Apis mellifera',
  CIPO_UVA: 'Cipó-uva', ASSA_PEIXE: 'Assa-peixe', ACACIA: 'Acácia', CAFE: 'Café', UVA_JAPONESA: 'Uva-japonesa',
  EM_ESTOQUE: 'Em estoque', VENDIDO: 'Vendido', NAO_AVALIADO: 'Não avaliado', APROVADO: 'Aprovado',
  KILOGRAMA: 'kg', LITRO: 'L', GRAMA: 'g', MILILITRO: 'mL', UNIDADE: 'unidade',
};

/** Converte ENUM_EM_CAIXA_ALTA em rótulo legível ("Manutenção necessária"). */
export const rotuloEnum = (v?: string | null) =>
  v ? ROTULOS[v] ?? v.toLowerCase().replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase()) : 'Não informado';

const styles = StyleSheet.create({
  card: {
    backgroundColor: cores.branco,
    borderRadius: 16,
    padding: 12,
    gap: 8,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
    width: '100%',
  },
  titulo: { fontSize: 15, fontWeight: 'bold', color: cores.texto, marginBottom: 4 },
  vazio: { color: '#888', textAlign: 'center', paddingVertical: 16 },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rotulo: { width: 100, fontSize: 12, color: cores.texto },
  trilha: { flex: 1, height: 14, backgroundColor: '#f0f0f0', borderRadius: 7, overflow: 'hidden' },
  barra: { height: '100%', borderRadius: 7 },
  valorLongo: { minWidth: 120, fontSize: 11 },
  valor: { minWidth: 56, fontSize: 12, fontWeight: '600', color: cores.texto, textAlign: 'right' },
  colunas: { flexDirection: 'row', alignItems: 'flex-end', height: 170, gap: 3 },
  coluna: { flex: 1, alignItems: 'center', height: '100%' },
  valorColuna: { fontSize: 9, color: cores.texto, height: 14 },
  trilhaColuna: { flex: 1, width: '70%', justifyContent: 'flex-end' },
  barraColuna: { width: '100%', borderTopLeftRadius: 4, borderTopRightRadius: 4, minHeight: 0 },
  rotuloColuna: { fontSize: 9, color: '#666', marginTop: 4 },
  estado: { alignItems: 'center', justifyContent: 'center', padding: 24, gap: 14 },
  estadoIcone: { width: 84, height: 84, borderRadius: 42, backgroundColor: cores.cores.primaria[10], alignItems: 'center', justifyContent: 'center' },
  estadoTexto: { color: '#666', textAlign: 'center', fontSize: 14 },
});
