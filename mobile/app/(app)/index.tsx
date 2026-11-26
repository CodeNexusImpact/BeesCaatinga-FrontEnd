import ItemHome from '@/components/home/itensHome';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';

const prodMel = require('@/assets/images/prodMel.png');
const apiarioColmeia = require('@/assets/images/apiario_colmeia.png');
const rastrear = require('@/assets/images/rastrear.png');

/** Passos na ordem do trabalho no campo: apiário → vistoria → produção → lote. */
const PASSOS: { title: string; descricao: string; icon?: any; image?: any; route: string }[] = [
  { title: 'Apiários e Colmeias', descricao: 'Cadastre onde ficam suas caixas', image: apiarioColmeia, route: '/apiario' },
  { title: 'Vistorias', descricao: 'Anote como estão as colmeias', icon: 'clipboardCheck', route: '/vistorias' },
  { title: 'Produção de Mel', descricao: 'Registre o mel colhido', image: prodMel, route: '/producao' },
  { title: 'Lotes', descricao: 'Rastreie o mel até a venda', image: rastrear, route: '/rastreabilidade' },
  { title: 'Insumos', descricao: 'Controle cera, xarope e remédios', icon: 'package', route: '/insumos' },
  { title: 'Relatórios', descricao: 'Veja resumos e gere PDF', icon: 'fileDocument', route: '/relatorio' },
  { title: 'Mapa', descricao: 'Veja seus apiários no mapa', icon: 'map', route: '/mapa' },
];

const OUTROS: { title: string; icon: any; route: string }[] = [
  { title: 'Como usar', icon: 'video', route: '/tutorial' },
  { title: 'Meu Perfil', icon: 'user', route: '/perfil' },
  { title: 'Avisos', icon: 'bell', route: '/notificacao' },
  { title: 'Configurações', icon: 'settings', route: '/configuracao' },
];

export default function Index() {
  const router = useRouter();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const colunas = width >= 720 ? 3 : 2;
  const largura = `${100 / colunas - 3}%` as const;
  const primeiroNome = user?.nomeCompleto?.split(' ')[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Stack.Screen options={{ title: 'Home', headerShown: false }} />

      {user?.nomeCompleto && <Text style={styles.saudacao}>Olá, {user.nomeCompleto}!</Text>}
      <Text style={styles.subtexto}>
        {primeiroNome ? `${primeiroNome}, siga` : 'Siga'} os passos na ordem do trabalho no campo. Toque em um cartão para começar.
      </Text>

      <View style={styles.grid}>
        {PASSOS.map((item, i) => (
          <View key={item.route} style={{ width: largura }}>
            <ItemHome numero={i + 1} title={item.title} descricao={item.descricao} iconName={item.icon} imageSource={item.image} onPress={() => router.push(item.route as any)} />
          </View>
        ))}
      </View>

      <Text style={styles.secao}>Mais opções</Text>
      <View style={styles.grid}>
        {OUTROS.map((item) => (
          <View key={item.route} style={{ width: largura }}>
            <ItemHome compacto title={item.title} iconName={item.icon} onPress={() => router.push(item.route as any)} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: layout.espacamento.colega, paddingBottom: 40, maxWidth: 820, width: '100%', alignSelf: 'center' },
  saudacao: { fontSize: 22, fontWeight: 'bold', color: cores.texto, marginTop: 4 },
  subtexto: { fontSize: 17, color: cores.textoSecundario, marginTop: 4, marginBottom: 16, lineHeight: 24 },
  secao: { fontSize: 18, fontWeight: 'bold', color: cores.texto, marginTop: 24, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 14 },
});
