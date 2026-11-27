import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import Botao from '@/components/formulario/botao';
import { alerta } from '@/utils/alerta';
import { mensagemDeErro } from '@/utils/erros';
import { voltar } from '@/utils/navegacao';
import Input from '@/components/formulario/input';
import { EstadoCarregando, EstadoErro, EstadoVazio, rotuloEnum } from '@/components/graficos';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { useDadosApi } from '@/hooks/useDadosApi';
import { excluirLote, idsColmeiasDoLote, listarLotesDetalhado } from '@/services/loteService';
import { listarColmeiasPorProdutor } from '@/services/colmeiaService';
import { getProducoes } from '@/services/producaoService';
import { listarVistoriasPorProdutor } from '@/services/vistoriaService';
import { isoParaBr } from '@/utils/datas';
import { formatarKgL, paraKg } from '@/utils/mel';

interface Origem {
  lote: any | null;
  colmeias: any[];
  producoes: any[];
  vistorias: any[];
  vinculoExplicito: boolean;
}

/**
 * Detalhes do lote com a cadeia de origem: apiário → colmeias → vistorias → produções,
 * com editar (PUT /lotes/{p}/{id}) e excluir (DELETE, com confirmação).
 */
export default function DetalheLote() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const buscar = useCallback(
    async (produtorId: number): Promise<Origem> => {
      const [lotes, colmeias, producoes, vistorias] = await Promise.all([
        listarLotesDetalhado(produtorId),
        listarColmeiasPorProdutor(produtorId),
        getProducoes(produtorId),
        listarVistoriasPorProdutor(produtorId),
      ]);
      const lote = (lotes as any[]).find((l) => String(l.id) === String(id)) ?? null;
      if (!lote) return { lote: null, colmeias: [], producoes: [], vistorias: [], vinculoExplicito: false };
      // Vínculo explícito (se a API devolver as colmeias do lote) ou origem derivada:
      // produções do mesmo apiário com data de coleta até a data do lote.
      const ids0 = idsColmeiasDoLote(lote);
      const idsExplicitos: number[] | null = ids0.length ? ids0 : null;
      const doApiario = (colmeias as any[]).filter((c) => (lote.apiarioId != null ? c.apiarioId === lote.apiarioId : c.nomeApiario === lote.nomeApiario));
      const prods = producoes.filter(
        (p) => (lote.apiarioId != null ? p.apiarioId === lote.apiarioId : p.nomeApiario === lote.nomeApiario) && (!p.dataColeta || p.dataColeta <= lote.dataProducao) && (!idsExplicitos || idsExplicitos.includes(p.colmeiaId!)),
      );
      const ids = idsExplicitos ?? [...new Set(prods.map((p) => p.colmeiaId))];
      const cols = doApiario.filter((c) => ids.includes(c.id));
      const vis = (vistorias as any[]).filter((v) => ids.includes(v.colmeiaId) && v.dataVistoria <= lote.dataProducao);
      return { lote, colmeias: cols, producoes: prods, vistorias: vis, vinculoExplicito: !!idsExplicitos };
    },
    [id],
  );

  const router = useRouter();
  const { dados, carregando, erro, recarregar, produtorId } = useDadosApi<Origem>(buscar, { lote: null, colmeias: [], producoes: [], vistorias: [], vinculoExplicito: false });
  const lote = dados.lote;

  if (carregando && !lote) return <EstadoCarregando texto="Carregando lote..." />;
  if (erro) return <EstadoErro mensagem={erro} onTentarNovamente={recarregar} />;
  if (!lote) return <EstadoVazio mensagem="Lote não encontrado." />;

  const nada = () => {};
  const excluir = () =>
    alerta('Excluir lote', `Deseja excluir o lote ${lote.id}? Esta ação não pode ser desfeita.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await excluirLote(produtorId!, lote.id);
            alerta('Lote excluído', `O lote ${lote.id} foi excluído.`);
            voltar(router, '/rastreabilidade/listar');
          } catch (e) {
            alerta('Erro', mensagemDeErro(e, 'Não foi possível excluir o lote.'));
          }
        },
      },
    ]);
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Stack.Screen options={{ title: 'Detalhes do Lote' }} />
      <Input label="Número do lote" value={String(lote.id ?? '')} onChangeText={nada} editable={false} />
      <Input label="Data de produção" value={isoParaBr(lote.dataProducao)} onChangeText={nada} editable={false} iconName="calendar" />
      <Input label="Quantidade" value={formatarKgL(Number(lote.quantidadeProduzida) || 0)} onChangeText={nada} editable={false} />
      <Input label="Apiário" value={lote.nomeApiario ?? ''} onChangeText={nada} editable={false} />
      <Input label="Florada" value={lote.tipoFlorada ? rotuloEnum(lote.tipoFlorada) : 'Não informada'} onChangeText={nada} editable={false} />
      <Input label="Tipo de abelha" value={rotuloEnum(lote.tipoAbelha)} onChangeText={nada} editable={false} />
      <Input label="Situação" value={lote.vendido ? 'Vendido' : 'Em estoque'} onChangeText={nada} editable={false} />
      {lote.latitude != null && (
        <Input label="Localização" value={`${Number(lote.latitude).toFixed(5)}, ${Number(lote.longitude).toFixed(5)}`} onChangeText={nada} editable={false} />
      )}

      <View style={styles.card}>
        <Text style={styles.titulo}>Origem do mel</Text>
        <Text style={styles.dica}>
          {dados.vinculoExplicito
            ? 'Colmeias informadas no cadastro do lote.'
            : 'Lote do apiário inteiro: colmeias com produção registrada até a data do lote.'}
        </Text>
        {dados.colmeias.length === 0 ? (
          <Text style={styles.dica}>Nenhuma colmeia vinculada.</Text>
        ) : (
          dados.colmeias.map((c) => <Text key={c.id} style={styles.item}>• Colmeia {c.identificador}</Text>)
        )}
        <Text style={styles.subtitulo}>Produções ({dados.producoes.length})</Text>
        {dados.producoes.map((p) => (
          <Text key={p.id} style={styles.item}>
            • {isoParaBr(p.dataColeta)} · {p.nomeColmeia} · {p.tipoProducao} · {formatarKgL(paraKg(p.quantidade, p.unidadeMedida))}
          </Text>
        ))}
        <Text style={styles.subtitulo}>Vistorias ({dados.vistorias.length})</Text>
        {dados.vistorias.map((v) => (
          <Text key={v.id} style={styles.item}>
            • {isoParaBr(v.dataVistoria)} · {v.nomeColmeia} · {rotuloEnum(v.condicao)}
          </Text>
        ))}
      </View>

      <View style={styles.acoes}>
        <View style={styles.acao}>
          <Botao title="Editar lote" iconName="edit" onPress={() => router.push(`/rastreabilidade/cadastrar?id=${lote.id}` as any)} cor="primaria" />
        </View>
        <View style={styles.acao}>
          <Botao title="Excluir lote" iconName="delete" onPress={excluir} cor="terciaria" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: layout.espacamento.colega, gap: layout.espacamento.colega, paddingBottom: 50 },
  card: { backgroundColor: cores.branco, borderRadius: 16, padding: 14, gap: 6, elevation: 2, boxShadow: '0px 2px 4px rgba(0,0,0,0.12)' },
  titulo: { fontSize: 17, fontWeight: 'bold', color: cores.texto },
  subtitulo: { fontSize: 15, fontWeight: 'bold', color: cores.texto, marginTop: 8 },
  dica: { fontSize: 14, color: cores.textoSecundario },
  item: { fontSize: 15, color: cores.texto },
  acoes: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  acao: { flexGrow: 1, flexBasis: 220 },
});
