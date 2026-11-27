import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import cores from '@/constants/cores';

interface Props {
  children: React.ReactNode;
  titulo?: string;
  /** Texto de resumo, ex.: "12 registros encontrados". */
  resumo?: string;
}

/**
 * Barra de filtros padrão: os campos quebram linha sozinhos (2 por linha no tablet, 1 no celular),
 * nunca saem da tela.
 */
export default function Filtros({ children, titulo = 'Filtros', resumo }: Props) {
  const itens = React.Children.toArray(children).filter(Boolean);
  return (
    <View style={styles.card} accessibilityRole="search" accessibilityLabel={titulo}>
      {!!titulo && <Text style={styles.titulo}>{titulo}</Text>}
      <View style={styles.grade}>
        {itens.map((filho, i) => (
          // zIndex decrescente: a lista aberta de um seletor fica por cima dos campos seguintes.
          <View key={i} style={[styles.item, { zIndex: 100 - i }]}>
            {filho}
          </View>
        ))}
      </View>
      {!!resumo && <Text style={styles.resumo}>{resumo}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: cores.superficie, borderRadius: 16, borderWidth: 1, borderColor: cores.bordaSuave, padding: 14, gap: 10, zIndex: 50, width: '100%' },
  titulo: { fontSize: 17, fontWeight: 'bold', color: cores.texto },
  grade: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  item: { flexGrow: 1, flexBasis: 220, minWidth: 0, maxWidth: '100%' },
  resumo: { fontSize: 14, color: cores.textoSecundario },
});
