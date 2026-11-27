import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Stack, useFocusEffect } from 'expo-router';
import Checkbox from 'expo-checkbox';
import * as Clipboard from 'expo-clipboard';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import Botao from '@/components/formulario/botao';
import { alerta } from '@/utils/alerta';
import { mensagemDeErro } from '@/utils/erros';
import { EVENTOS_WEBHOOK, EventoWebhook, WebhookDTO, WebhookEntregaDTO } from '@/types/webhook';
import {
  atualizarWebhook,
  criarWebhook,
  excluirWebhook,
  listarEntregas,
  listarWebhooks,
  testarWebhook,
  urlWebhookValida,
} from '@/services/webhookService';

const rotuloEvento = (e: string) => EVENTOS_WEBHOOK.find((x) => x.value === e)?.label ?? e;
const formatarDataHora = (iso: string) => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleString('pt-BR');
};

export default function Webhooks() {
  const [webhooks, setWebhooks] = useState<WebhookDTO[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Formulário de criação
  const [url, setUrl] = useState('');
  const [eventos, setEventos] = useState<EventoWebhook[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [segredo, setSegredo] = useState<string | null>(null);

  // Entregas exibidas por webhook
  const [entregas, setEntregas] = useState<Record<number, WebhookEntregaDTO[] | 'carregando'>>({});
  const [ocupado, setOcupado] = useState<number | null>(null);

  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      setWebhooks(await listarWebhooks());
      setErro(null);
    } catch (e) {
      setErro(mensagemDeErro(e, 'Não foi possível carregar os webhooks.'));
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  const alternarEvento = (ev: EventoWebhook) =>
    setEventos((atual) => (atual.includes(ev) ? atual.filter((e) => e !== ev) : [...atual, ev]));

  const criar = async () => {
    if (!urlWebhookValida(url)) {
      alerta('Atenção', 'Informe uma URL válida começando com http:// ou https://.');
      return;
    }
    if (eventos.length === 0) {
      alerta('Atenção', 'Selecione ao menos um evento.');
      return;
    }
    try {
      setSalvando(true);
      const criado = await criarWebhook({ url: url.trim(), eventos });
      setSegredo(criado.segredo ?? null);
      setUrl('');
      setEventos([]);
      await carregar();
    } catch (e) {
      alerta('Erro', mensagemDeErro(e, 'Não foi possível criar o webhook.'));
    } finally {
      setSalvando(false);
    }
  };

  const copiarSegredo = async () => {
    if (!segredo) return;
    await Clipboard.setStringAsync(segredo);
    alerta('Copiado', 'Segredo copiado para a área de transferência.');
  };

  const alternarAtivo = async (w: WebhookDTO) => {
    try {
      setOcupado(w.id);
      const atualizado = await atualizarWebhook(w.id, { ativo: !w.ativo });
      setWebhooks((l) => l.map((x) => (x.id === w.id ? { ...x, ...atualizado, ativo: atualizado?.ativo ?? !w.ativo } : x)));
    } catch (e) {
      alerta('Erro', mensagemDeErro(e, 'Não foi possível atualizar o webhook.'));
    } finally {
      setOcupado(null);
    }
  };

  const verEntregas = async (id: number) => {
    setEntregas((m) => ({ ...m, [id]: 'carregando' }));
    try {
      const lista = await listarEntregas(id);
      setEntregas((m) => ({ ...m, [id]: lista }));
    } catch (e) {
      setEntregas((m) => {
        const { [id]: _, ...resto } = m;
        return resto;
      });
      alerta('Erro', mensagemDeErro(e, 'Não foi possível carregar as entregas.'));
    }
  };

  const testar = async (w: WebhookDTO) => {
    try {
      setOcupado(w.id);
      await testarWebhook(w.id);
      alerta('Teste enviado', 'Um evento de teste foi enviado. Confira o resultado nas últimas entregas.');
      await verEntregas(w.id);
    } catch (e) {
      alerta('Erro', mensagemDeErro(e, 'Não foi possível enviar o teste.'));
    } finally {
      setOcupado(null);
    }
  };

  const excluir = (w: WebhookDTO) => {
    alerta('Excluir webhook', `Deseja excluir o webhook ${w.url}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            setOcupado(w.id);
            await excluirWebhook(w.id);
            setWebhooks((l) => l.filter((x) => x.id !== w.id));
          } catch (e) {
            alerta('Erro', mensagemDeErro(e, 'Não foi possível excluir o webhook.'));
          } finally {
            setOcupado(null);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: 'Integrações / Webhooks' }} />

      <Text style={styles.intro}>
        Receba notificações HTTP (POST) no seu sistema sempre que um registro for criado. Cada entrega é assinada com o
        segredo do webhook.
      </Text>

      {/* Novo webhook */}
      <View style={styles.card}>
        <Text style={styles.titulo}>Novo webhook</Text>
        <Text style={styles.rotulo}>URL de destino</Text>
        <TextInput
          style={styles.input}
          value={url}
          onChangeText={setUrl}
          placeholder="https://meusistema.com/webhooks/bees"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
        <Text style={styles.rotulo}>Eventos</Text>
        {EVENTOS_WEBHOOK.map((ev) => (
          <TouchableOpacity key={ev.value} style={styles.linhaEvento} onPress={() => alternarEvento(ev.value)} activeOpacity={0.7}>
            <Checkbox
              value={eventos.includes(ev.value)}
              onValueChange={() => alternarEvento(ev.value)}
              color={eventos.includes(ev.value) ? cores.primaria : undefined}
            />
            <Text style={styles.textoEvento}>{ev.label}</Text>
            <Text style={styles.codigoEvento}>{ev.value}</Text>
          </TouchableOpacity>
        ))}
        <Botao title={salvando ? 'Salvando...' : 'Criar Webhook'} onPress={criar} cor="primaria" style={{ marginTop: 12 }} />
      </View>

      {segredo && (
        <View style={[styles.card, styles.cardSegredo]}>
          <Text style={styles.titulo}>Segredo do webhook</Text>
          <Text style={styles.aviso}>Copie e guarde agora: ele não será exibido novamente.</Text>
          <Text selectable style={styles.segredo} testID="webhook-segredo">
            {segredo}
          </Text>
          <View style={styles.linhaAcoes}>
            <Botao title="Copiar segredo" onPress={copiarSegredo} cor="secundaria" tamanho="pequeno" />
            <Botao title="Ocultar" onPress={() => setSegredo(null)} cor="branca" tamanho="pequeno" />
          </View>
        </View>
      )}

      <Text style={styles.titulo}>Webhooks cadastrados</Text>
      {carregando ? (
        <ActivityIndicator size="large" color={cores.primaria} style={{ marginVertical: 20 }} />
      ) : erro ? (
        <View style={styles.card}>
          <Text style={styles.erro}>{erro}</Text>
          <Botao title="Tentar novamente" onPress={carregar} cor="secundaria" tamanho="pequeno" />
        </View>
      ) : webhooks.length === 0 ? (
        <Text style={styles.vazio}>Nenhum webhook cadastrado ainda.</Text>
      ) : (
        webhooks.map((w) => {
          const lista = entregas[w.id];
          return (
            <View key={w.id} style={styles.card} testID={`webhook-${w.id}`}>
              <Text style={styles.url} selectable>
                {w.url}
              </Text>
              <Text style={styles.eventos}>{(w.eventos ?? []).map(rotuloEvento).join(' · ')}</Text>
              <View style={styles.linhaAtivo}>
                <Text style={[styles.status, { color: w.ativo ? '#2E7D32' : '#9E9E9E' }]}>{w.ativo ? 'Ativo' : 'Inativo'}</Text>
                <Switch
                  value={!!w.ativo}
                  onValueChange={() => alternarAtivo(w)}
                  disabled={ocupado === w.id}
                  accessibilityLabel={`Ativar webhook ${w.id}`}
                />
              </View>
              <View style={styles.linhaAcoes}>
                <Botao title="Testar" onPress={() => testar(w)} cor="secundaria" tamanho="pequeno" />
                <Botao title="Entregas" onPress={() => verEntregas(w.id)} cor="branca" tamanho="pequeno" />
                <Botao title="Excluir" onPress={() => excluir(w)} cor="terciaria" tamanho="pequeno" />
              </View>
              {lista === 'carregando' && <ActivityIndicator color={cores.primaria} />}
              {Array.isArray(lista) &&
                (lista.length === 0 ? (
                  <Text style={styles.vazio}>Nenhuma entrega registrada ainda.</Text>
                ) : (
                  <View style={styles.entregas}>
                    <Text style={styles.rotulo}>Últimas entregas</Text>
                    {lista.slice(0, 10).map((en) => (
                      <View key={en.id} style={styles.entrega}>
                        <Text style={[styles.entregaStatus, { color: en.sucesso ? '#2E7D32' : '#C62828' }]}>
                          {en.sucesso ? 'Sucesso' : 'Falha'} {en.statusHttp ? `HTTP ${en.statusHttp}` : ''}
                        </Text>
                        <Text style={styles.entregaTexto}>
                          {en.evento} · tentativa {en.tentativa} · {formatarDataHora(en.criadoEm)}
                        </Text>
                        {!!en.erro && <Text style={styles.entregaErro}>{en.erro}</Text>}
                      </View>
                    ))}
                  </View>
                ))}
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: layout.espacamento.colega, gap: layout.espacamento.colega, paddingBottom: 40 },
  intro: { fontSize: 14, color: cores.texto, lineHeight: 20 },
  card: {
    backgroundColor: cores.branco,
    borderRadius: layout.borderRadius.r50,
    padding: layout.espacamento.colega,
    gap: 6,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
    elevation: 2,
  },
  cardSegredo: { borderWidth: 2, borderColor: cores.primaria },
  titulo: { fontSize: 16, fontWeight: 'bold', color: cores.texto },
  rotulo: { fontSize: 13, fontWeight: '600', color: cores.texto, marginTop: 6 },
  input: {
    borderWidth: 1,
    borderColor: cores.bordaSuave,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: cores.superficie,
  },
  linhaEvento: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
  textoEvento: { fontSize: 14, color: cores.texto, flex: 1 },
  codigoEvento: { fontSize: 11, color: cores.textoSecundario },
  aviso: { fontSize: 13, color: cores.perigo },
  segredo: { fontFamily: 'monospace', fontSize: 13, backgroundColor: cores.superficieAlternativa, padding: 8, borderRadius: 6 },
  linhaAcoes: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 6 },
  url: { fontSize: 14, fontWeight: '600', color: cores.texto },
  eventos: { fontSize: 12, color: cores.textoSecundario },
  linhaAtivo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  status: { fontWeight: 'bold' },
  erro: { color: cores.perigo, marginBottom: 8 },
  vazio: { textAlign: 'center', color: cores.textoSecundario, paddingVertical: 12 },
  entregas: { marginTop: 6, gap: 6 },
  entrega: { borderTopWidth: 1, borderTopColor: cores.bordaSuave, paddingTop: 6 },
  entregaStatus: { fontWeight: 'bold', fontSize: 13 },
  entregaTexto: { fontSize: 12, color: cores.textoSecundario },
  entregaErro: { fontSize: 12, color: cores.perigo },
});
