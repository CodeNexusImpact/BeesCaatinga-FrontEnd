import Botao from '@/components/botao';
import Icon from '@/components/icon';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import fonts from '@/constants/fonts';
import layout from '@/constants/layout';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Tutorial() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Subtexto style={styles.subtexto}>Primeiros Passos</Subtexto>

      <View style={styles.card}>
        <Icon name="video" size={100} color={cores.primaria} />
        <Text style={styles.cardTitle}>Tutorial</Text>
      </View>

      <Botao
        title="Pular tutorial"
        onPress={() => router.push('/home')}
        cor="primaria"
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: layout.espacamento.amigavel,
  },

  subtexto: {
    width: '100%',
    paddingTop: layout.espacamento.amigavel, 
    marginBottom: layout.espacamento.amigavel, 
  },

  cardTitle: {
    fontSize: fonts.size.p,
    fontFamily: fonts.family.body,
    color: cores.texto,
    marginTop: layout.espacamento.texto,
  },

  button: {
    width: '50%',
    marginTop: layout.espacamento.colega,
  },

  card: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',
    height: '40%',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    marginTop: layout.espacamento.amigavel,
  },
});