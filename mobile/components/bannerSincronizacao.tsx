import cores from '@/constants/cores';
import React, { useSyncExternalStore } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { sincronizar, useFilaOffline } from '@/services/offline';
import { alerta } from '@/utils/alerta';

const assinarConexao = (f: () => void) => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return () => {};
  window.addEventListener('online', f);
  window.addEventListener('offline', f);
  return () => {
    window.removeEventListener('online', f);
    window.removeEventListener('offline', f);
  };
};
const online = () => (Platform.OS === 'web' && typeof navigator !== 'undefined' ? navigator.onLine : true);

/** Faixa no topo: aviso de "sem internet" e botão "Sincronizar (N pendentes)". */
export default function BannerSincronizacao() {
  const router = useRouter();
  const { fila, sincronizando } = useFilaOffline();
  const conectado = useSyncExternalStore(assinarConexao, online, () => true);
  if (conectado && fila.length === 0) return null;

  const enviar = async () => {
    const r = await sincronizar();
    if (r.semInternet) alerta('Sem internet', 'Não foi possível falar com o servidor. Tente de novo quando tiver sinal.');
    else if (r.erros) alerta('Atenção', `${r.enviados} enviado(s). ${r.erros} registro(s) com problema: toque em "Ver" para detalhes.`);
    else alerta('Sincronizado', `${r.enviados} registro(s) enviado(s) com sucesso.`);
  };

  return (
    <View style={[styles.faixa, !conectado && styles.offline]} accessibilityRole="alert" testID="banner-sincronizacao">
      <Text style={styles.texto}>
        {!conectado ? 'Sem internet. Seus cadastros ficam salvos no aparelho.' : `${fila.length} registro(s) aguardando envio.`}
      </Text>
      {fila.length > 0 && (
        <View style={styles.acoes}>
          <TouchableOpacity onPress={() => router.push('/sincronizacao' as any)} style={styles.botaoSec} accessibilityRole="button" accessibilityLabel="Ver pendências">
            <Text style={styles.textoBotaoSec}>Ver</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={enviar} disabled={sincronizando} style={styles.botao} accessibilityRole="button" accessibilityLabel={`Sincronizar ${fila.length} pendentes`}>
            <Text style={styles.textoBotao}>{sincronizando ? 'Enviando...' : `Sincronizar (${fila.length} pendente${fila.length > 1 ? 's' : ''})`}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  faixa: { backgroundColor: cores.destaque, borderBottomWidth: 1, borderColor: '#E0A100', padding: 10, gap: 8 },
  offline: { backgroundColor: '#FDECEA', borderColor: '#C62828' },
  texto: { fontSize: 15, color: '#3E2723', fontWeight: '600' },
  acoes: { flexDirection: 'row', gap: 8, justifyContent: 'flex-end' },
  botao: { backgroundColor: '#5D4037', borderRadius: 8, paddingHorizontal: 14, minHeight: 44, justifyContent: 'center' },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  botaoSec: { borderWidth: 2, borderColor: '#5D4037', borderRadius: 8, paddingHorizontal: 14, minHeight: 44, justifyContent: 'center' },
  textoBotaoSec: { color: '#5D4037', fontWeight: 'bold', fontSize: 15 },
});
