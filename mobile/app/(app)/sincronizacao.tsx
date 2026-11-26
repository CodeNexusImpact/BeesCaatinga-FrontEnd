import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import Botao from '@/components/formulario/botao';
import { EstadoVazio } from '@/components/graficos';
import cores from '@/constants/cores';
import { descartarItem, sincronizar, useFilaOffline } from '@/services/offline';
import { alerta } from '@/utils/alerta';

const NOMES: Record<string, string> = { apiario: 'Apiário', colmeia: 'Colmeia', insumo: 'Insumo', vistoria: 'Vistoria', producao: 'Produção', lote: 'Lote', outro: 'Registro' };

/** Pendências da fila offline, com erro por item, nova tentativa e descarte (com confirmação). */
export default function Sincronizacao() {
  const { fila, sincronizando } = useFilaOffline();

  const enviar = async () => {
    const r = await sincronizar();
    alerta(r.semInternet ? 'Sem internet' : 'Sincronização', r.semInternet ? 'Tente novamente quando tiver sinal.' : `${r.enviados} enviado(s); ${r.pendentes} pendente(s).`);
  };

  const descartar = (uuid: string, descricao: string) =>
    alerta('Descartar registro', `"${descricao}" ainda não foi enviado e será apagado do aparelho. Deseja continuar?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Descartar', style: 'destructive', onPress: () => descartarItem(uuid) },
    ]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Stack.Screen options={{ title: 'Envios Pendentes' }} />
      {fila.length === 0 ? (
        <EstadoVazio mensagem="Tudo enviado! Nenhum registro aguardando envio." />
      ) : (
        <>
          <Botao title={sincronizando ? 'Enviando...' : `Sincronizar agora (${fila.length})`} onPress={enviar} cor="primaria" />
          {fila.map((i) => (
            <View key={i.uuid} style={styles.card}>
              <Text style={styles.titulo}>
                {NOMES[i.tipo] ?? 'Registro'} · {i.metodo === 'POST' ? 'novo' : 'edição'}
              </Text>
              <Text style={styles.texto}>{i.descricao}</Text>
              <Text style={styles.data}>Salvo em {new Date(i.criadoEm).toLocaleString('pt-BR')} · tentativas: {i.tentativas}</Text>
              {!!i.erro && <Text style={styles.erro}>{i.erro}</Text>}
              <Botao title="Descartar" onPress={() => descartar(i.uuid, i.descricao)} cor="branca" tamanho="pequeno" />
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 16, gap: 12, paddingBottom: 40 },
  card: { backgroundColor: cores.branco, borderRadius: 12, padding: 14, gap: 4, elevation: 2, boxShadow: '0px 2px 4px rgba(0,0,0,0.12)' },
  titulo: { fontSize: 16, fontWeight: 'bold', color: cores.texto },
  texto: { fontSize: 15, color: cores.texto },
  data: { fontSize: 13, color: '#555' },
  erro: { fontSize: 14, color: '#C62828', fontWeight: '600' },
});
