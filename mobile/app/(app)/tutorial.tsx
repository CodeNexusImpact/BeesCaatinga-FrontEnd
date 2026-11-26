import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Botao from '@/components/formulario/botao';
import cores from '@/constants/cores';

const PASSOS = [
  { titulo: 'Cadastre o apiário', texto: 'Em "Apiários e Colmeias", toque em "Cadastrar apiário". Informe o nome, o endereço e marque o local no mapa (ou use o GPS).' },
  { titulo: 'Cadastre as colmeias', texto: 'Ainda em "Apiários e Colmeias", cadastre cada caixa com um nome fácil, como "Caixa 01", e escolha o apiário onde ela fica.' },
  { titulo: 'Faça as vistorias', texto: 'Em "Vistorias", anote a data, a colmeia, como ela está e se viu pragas ou perdas.' },
  { titulo: 'Registre a produção', texto: 'Em "Produção de Mel", informe quanto mel colheu. Pode digitar em quilos ou em litros: o outro valor é calculado sozinho.' },
  { titulo: 'Crie o lote', texto: 'Em "Lotes", junte o mel colhido em um lote. O número do lote permite rastrear a origem do mel até a venda.' },
  { titulo: 'Veja os relatórios', texto: 'Em "Relatórios", veja os resumos e gere um PDF para imprimir ou enviar.' },
  { titulo: 'Sem internet?', texto: 'Pode cadastrar normalmente. Os dados ficam guardados no aparelho e aparecem como "pendente". Quando tiver sinal, toque em "Sincronizar".' },
];

/** Guia "Como usar" em passos curtos e linguagem simples. */
export default function ComoUsar() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Stack.Screen options={{ title: 'Como Usar' }} />
      <Text style={styles.intro}>Siga estes passos na ordem. Você pode voltar aqui quando quiser pela tela inicial.</Text>
      {PASSOS.map((p, i) => (
        <View key={p.titulo} style={styles.passo}>
          <View style={styles.numero}>
            <Text style={styles.numeroTexto}>{i + 1}</Text>
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.titulo}>{p.titulo}</Text>
            <Text style={styles.texto}>{p.texto}</Text>
          </View>
        </View>
      ))}
      <Botao title="Começar pelo apiário" onPress={() => router.push('/apiario')} cor="primaria" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 16, gap: 14, paddingBottom: 40 },
  intro: { fontSize: 17, color: cores.texto, lineHeight: 24 },
  passo: { flexDirection: 'row', gap: 12, backgroundColor: cores.branco, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: cores.cores.base[20] },
  numero: { width: 36, height: 36, borderRadius: 18, backgroundColor: cores.primaria, alignItems: 'center', justifyContent: 'center' },
  numeroTexto: { fontSize: 18, fontWeight: 'bold', color: cores.textoSobrePrimaria },
  titulo: { fontSize: 18, fontWeight: 'bold', color: cores.texto },
  texto: { fontSize: 16, color: cores.texto, lineHeight: 23 },
});
