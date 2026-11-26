import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Botao from '@/components/formulario/botao';
import Icon from '@/components/icon';
import cores from '@/constants/cores';
import layout from '@/constants/layout';

export interface OpcaoMenu {
  titulo: string;
  descricao?: string;
  icone: string;
  rota: string;
}

interface Props {
  titulo: string;
  descricao: string;
  principal: OpcaoMenu;
  opcoes: OpcaoMenu[];
}

/** Tela de módulo: uma ação principal em destaque e as demais em linhas grandes (ícone + texto). */
export default function MenuModulo({ titulo, descricao, principal, opcoes }: Props) {
  const router = useRouter();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Stack.Screen options={{ title: titulo }} />
      <Text style={styles.descricao}>{descricao}</Text>
      <Botao title={principal.titulo} iconName={principal.icone} onPress={() => router.push(principal.rota as any)} cor="primaria" />
      <Text style={styles.secao}>Outras opções</Text>
      {opcoes.map((o) => (
        <TouchableOpacity
          key={o.rota}
          style={styles.linha}
          onPress={() => router.push(o.rota as any)}
          accessibilityRole="button"
          accessibilityLabel={o.titulo}
          accessibilityHint={o.descricao}
        >
          <View style={styles.icone}>
            <Icon name={o.icone} size={28} color={cores.secundaria} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.linhaTitulo}>{o.titulo}</Text>
            {!!o.descricao && <Text style={styles.linhaDescricao}>{o.descricao}</Text>}
          </View>
          <Icon name="setaDireita" size={24} color={cores.textoSecundario} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: layout.espacamento.colega, gap: 12, paddingBottom: 40, maxWidth: 720, width: '100%', alignSelf: 'center' },
  descricao: { fontSize: 17, color: cores.textoSecundario, lineHeight: 24, marginBottom: 4 },
  secao: { fontSize: 18, fontWeight: 'bold', color: cores.texto, marginTop: 12 },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 68,
    backgroundColor: cores.branco,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: cores.cores.base[20],
  },
  icone: { width: 44, height: 44, borderRadius: 22, backgroundColor: cores.cores.primaria[10], alignItems: 'center', justifyContent: 'center' },
  linhaTitulo: { fontSize: 17, fontWeight: 'bold', color: cores.texto },
  linhaDescricao: { fontSize: 14, color: cores.textoSecundario },
});
