import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Checkbox from 'expo-checkbox';
import Botao from '@/components/formulario/botao';
import Input from '@/components/formulario/input';
import Selector from '@/components/formulario/selector';
import CampoKgLitros from '@/components/formulario/campoKgLitros';
import SeletorLocalizacao, { Coordenada } from '@/components/mapa/seletorLocalizacao';
import { validarCoordenadas } from '@/components/mapa/mapaComum';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { useAuth } from '@/hooks/useAuth';
import { listarApiariosPorProdutor } from '@/services/apiarioService';
import { listarColmeiasPorApiario } from '@/services/colmeiaService';
import { getProducoes } from '@/services/producaoService';
import { cadastrarLote } from '@/services/loteService';
import type { ApiarioRetornoDTO } from '@/types/apiario';
import type { ColmeiaRetornoDTO } from '@/types/apiario/colmeia';
import type { ProducaoRetornoDTO } from '@/types/producao';
import { alerta } from '@/utils/alerta';
import { mensagemDeErro } from '@/utils/erros';
import { maskDate } from '@/utils/masks';
import { formatarKgL, paraKg } from '@/utils/mel';
import { lembrarEscolha, ultimaEscolha } from '@/utils/sugestoes';
import { dataValida } from '@/utils/datas';

// Valores alinhados aos enums TipoAbelha / TipoFlorada do backend.
export const TIPOS_ABELHA = [
  { label: 'Jandaíra', value: 'JANDAIRA' },
  { label: 'Uruçu Nordestina', value: 'URUCU_NORDESTINA' },
  { label: 'Africanizada', value: 'AFRICANIZADA' },
  { label: 'Apis mellifera', value: 'APIS_MELLIFERA' },
];

export const FLORADAS = [
  { label: 'Silvestre', value: 'SILVESTRE' },
  { label: 'Polifloral', value: 'POLIFLORAL' },
  { label: 'Monofloral', value: 'MONOFLORAL' },
  { label: 'Marmeleiro', value: 'MARMELEIRO' },
  { label: 'Jitirana', value: 'JITIRANA' },
  { label: 'Angico', value: 'ANGICO' },
  { label: 'Aroeira', value: 'AROEIRA' },
  { label: 'Cipó-uva', value: 'CIPO_UVA' },
  { label: 'Quitoco', value: 'QUITOCO' },
  { label: 'Eucalipto', value: 'EUCALIPTO' },
  { label: 'Laranjeira', value: 'LARANJEIRA' },
  { label: 'Assa-peixe', value: 'ASSA_PEIXE' },
  { label: 'Acácia', value: 'ACACIA' },
  { label: 'Café', value: 'CAFE' },
  { label: 'Uva-japonesa', value: 'UVA_JAPONESA' },
];

/**
 * Cadastro de lote de mel: o lote nasce de um apiário e das colmeias que produziram o mel,
 * usando os dados reais do produtor (apiário → colmeia → vistoria → produção → lote).
 */
export default function CadastrarLoteMel() {
  const router = useRouter();
  const { user } = useAuth();
  const produtorId = user?.id;

  const [dataProducao, setDataProducao] = useState(new Date().toLocaleDateString('pt-BR'));
  const [kg, setKg] = useState<number | null>(null);
  const [apiarioId, setApiarioId] = useState('');
  const [colmeiasMarcadas, setColmeiasMarcadas] = useState<number[]>([]);
  const [florada, setFlorada] = useState('');
  const [tipoAbelha, setTipoAbelha] = useState('');
  const [local, setLocal] = useState<Coordenada | null>(null);
  const [salvando, setSalvando] = useState(false);

  const [apiarios, setApiarios] = useState<ApiarioRetornoDTO[]>([]);
  const [colmeias, setColmeias] = useState<ColmeiaRetornoDTO[]>([]);
  const [producoes, setProducoes] = useState<ProducaoRetornoDTO[]>([]);
  const [carregandoColmeias, setCarregandoColmeias] = useState(false);

  useEffect(() => {
    if (!produtorId) return;
    let ativo = true;
    Promise.all([listarApiariosPorProdutor(produtorId), getProducoes(produtorId), ultimaEscolha('lote.tipoAbelha'), ultimaEscolha('lote.florada')])
      .then(([a, p, abelha, flor]) => {
        if (!ativo) return;
        setApiarios(a);
        setProducoes(p);
        if (abelha) setTipoAbelha(abelha);
        if (flor) setFlorada(flor);
      })
      .catch((e) => alerta('Erro', mensagemDeErro(e, 'Não foi possível carregar seus apiários.')));
    return () => {
      ativo = false;
    };
  }, [produtorId]);

  const apiario = apiarios.find((a) => String(a.id) === apiarioId);

  const escolherApiario = async (id: string) => {
    setApiarioId(id);
    setColmeiasMarcadas([]);
    setColmeias([]);
    const a = apiarios.find((x) => String(x.id) === id);
    if (a?.latitude != null && a?.longitude != null) setLocal({ latitude: Number(a.latitude), longitude: Number(a.longitude) });
    if (!produtorId) return;
    try {
      setCarregandoColmeias(true);
      const lista: ColmeiaRetornoDTO[] = await listarColmeiasPorApiario(produtorId, id);
      setColmeias(Array.isArray(lista) ? lista : []);
      // Pré-seleciona a colmeia quando só uma tem produção registrada neste apiário.
      const comProducao = [...new Set(producoes.filter((p) => String(p.apiarioId) === id).map((p) => p.colmeiaId))];
      if (comProducao.length === 1 && comProducao[0] != null) setColmeiasMarcadas([comProducao[0]]);
    } catch (e) {
      alerta('Erro', mensagemDeErro(e, 'Não foi possível carregar as colmeias do apiário.'));
    } finally {
      setCarregandoColmeias(false);
    }
  };

  const kgPorColmeia = useMemo(() => {
    const m = new Map<number, number>();
    producoes.forEach((p) => p.colmeiaId != null && m.set(p.colmeiaId, (m.get(p.colmeiaId) ?? 0) + paraKg(p.quantidade, p.unidadeMedida)));
    return m;
  }, [producoes]);
  const somaSelecionadas = colmeiasMarcadas.length
    ? colmeiasMarcadas.reduce((s, id) => s + (kgPorColmeia.get(id) ?? 0), 0)
    : colmeias.reduce((s, c) => s + (kgPorColmeia.get(c.id) ?? 0), 0);

  // O backend vincula o lote a uma colmeia (opcional); sem colmeia, o lote representa o apiário todo.
  const alternarColmeia = (id: number) => setColmeiasMarcadas((l) => (l.includes(id) ? [] : [id]));

  const salvar = async () => {
    if (!produtorId) return;
    if (!dataValida(dataProducao)) return alerta('Atenção', 'Informe a data de produção no formato dd/mm/aaaa.');
    if (!kg || kg <= 0) return alerta('Atenção', 'Informe a quantidade de mel (em kg ou litros).');
    if (!apiario) return alerta('Atenção', 'Escolha o apiário de origem do lote.');
    if (!tipoAbelha) return alerta('Atenção', 'Escolha o tipo de abelha.');
    if (!local) return alerta('Atenção', 'Informe a localização da produção (mapa ou GPS).');
    const erroCoord = validarCoordenadas(local.latitude, local.longitude);
    if (erroCoord) return alerta('Atenção', erroCoord);

    setSalvando(true);
    try {
      // LoteCriadoDTO: o backend identifica o apiário pelo nome (do próprio produtor).
      // apiarioId (preferencial) e colmeiaId opcional, que deve pertencer ao apiário.
      const resultado = await cadastrarLote(produtorId, {
        dataProducao,
        quantidadeProduzida: Math.round(kg * 100) / 100,
        nomeApiario: apiario.nome,
        apiarioId: apiario.id,
        colmeiaId: colmeiasMarcadas[0] ?? undefined,
        tipoFlorada: florada || undefined,
        tipoAbelha,
        latitude: local.latitude,
        longitude: local.longitude,
        vendido: false,
      });
      lembrarEscolha('lote.tipoAbelha', tipoAbelha);
      if (florada) lembrarEscolha('lote.florada', florada);
      lembrarEscolha('apiario', apiarioId);
      alerta(
        resultado?.pendente ? 'Salvo no aparelho' : 'Sucesso',
        resultado?.pendente ? 'Sem internet: o lote será enviado ao sincronizar.' : `Lote ${resultado?.id ?? ''} cadastrado com sucesso!`,
      );
      router.replace('/rastreabilidade/listar');
    } catch (e) {
      alerta('Erro', mensagemDeErro(e, 'Não foi possível salvar o lote.'));
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: 'Cadastrar Lote' }} />
      <Text style={styles.intro}>Escolha o apiário e as colmeias de onde saiu o mel. O lote recebe um número para rastreio.</Text>

      <Input label="Data de produção" value={dataProducao} onChangeText={(t) => setDataProducao(maskDate(t))} placeholder="dd/mm/aaaa" iconName="calendar" maxLength={10} />

      <View style={{ zIndex: 30 }}>
        <Selector
          label="Apiário de origem"
          options={apiarios.map((a) => ({ label: a.nome, value: String(a.id) }))}
          onSelect={escolherApiario}
          value={apiarioId}
          placeholder={apiarios.length ? 'Selecione o apiário' : 'Nenhum apiário cadastrado ainda'}
          iconName="beehiveOutline"
        />
      </View>

      {apiario && (
        <View style={styles.card}>
          <Text style={styles.titulo}>Colmeia de origem (opcional)</Text>
          <Text style={styles.dica}>Marque a colmeia de onde saiu o mel. Deixe sem marcar se o lote reúne todo o apiário.</Text>
          {carregandoColmeias ? (
            <Text style={styles.dica}>Carregando colmeias...</Text>
          ) : colmeias.length === 0 ? (
            <Text style={styles.dica}>Este apiário ainda não tem colmeias cadastradas.</Text>
          ) : (
            colmeias.map((c) => (
              <TouchableOpacity key={c.id} style={styles.linhaColmeia} onPress={() => alternarColmeia(c.id)} role="radio" aria-checked={colmeiasMarcadas.includes(c.id)} accessibilityLabel={`Colmeia ${c.identificador}`} testID={`colmeia-${c.id}`}>
                <Checkbox value={colmeiasMarcadas.includes(c.id)} onValueChange={() => alternarColmeia(c.id)} color={colmeiasMarcadas.includes(c.id) ? cores.primaria : undefined} />
                <Text style={styles.nomeColmeia}>{c.identificador}</Text>
                <Text style={styles.dica}>{kgPorColmeia.get(c.id) ? formatarKgL(kgPorColmeia.get(c.id)!) : 'sem produção'}</Text>
              </TouchableOpacity>
            ))
          )}
          {somaSelecionadas > 0 && (
            <Botao title={`Usar o total produzido: ${formatarKgL(somaSelecionadas)}`} onPress={() => setKg(Math.round(somaSelecionadas * 100) / 100)} cor="branca" tamanho="pequeno" />
          )}
        </View>
      )}

      <CampoKgLitros kg={kg} onChange={setKg} rotulo="Quantidade do lote" />

      <View style={{ zIndex: 20 }}>
        <Selector label="Florada" options={FLORADAS} onSelect={setFlorada} value={florada} placeholder="Selecione a florada" iconName="flower" />
      </View>
      <View style={{ zIndex: 10 }}>
        <Selector label="Tipo de abelha" options={TIPOS_ABELHA} onSelect={setTipoAbelha} value={tipoAbelha} placeholder="Selecione o tipo de abelha" iconName="bee" />
      </View>

      <Text style={styles.titulo}>Localização da produção</Text>
      <SeletorLocalizacao valor={local} onChange={setLocal} />

      <Botao title={salvando ? 'Salvando...' : 'Cadastrar lote'} onPress={salvando ? () => {} : salvar} cor="primaria" style={{ marginTop: 16 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: layout.espacamento.colega, gap: layout.espacamento.colega, paddingBottom: 48 },
  intro: { fontSize: 16, color: cores.texto, lineHeight: 22 },
  card: { backgroundColor: cores.branco, borderRadius: 16, padding: 14, gap: 8, elevation: 2, boxShadow: '0px 2px 4px rgba(0,0,0,0.12)' },
  titulo: { fontSize: 16, fontWeight: 'bold', color: cores.texto },
  linhaColmeia: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44 },
  nomeColmeia: { fontSize: 16, color: cores.texto, flex: 1 },
  dica: { fontSize: 14, color: '#555' },
});
