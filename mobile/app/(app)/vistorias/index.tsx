import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import Subtexto from '@/components/subTexto';
import Botao from '@/components/formulario/botao';

export default function Index() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Vistorias' }} />

      <Subtexto style={styles.subtexto}>Gerencie suas vistorias</Subtexto>

      <View style={styles.botoesContainer}>
        <View style={styles.botaoCard}>
          <Botao
            title="Cadastrar Vistoria"
            cor="secundaria"
            iconName="add"
            onPress={() => router.push('/vistorias/cadastrar')}
            style={styles.botao}
            textStyle={styles.botaoTexto}
          />
        </View>

        <View style={styles.botaoCard}>
          <Botao
            title="Listar as Vistorias"
            cor="secundaria"
            iconName="clipboardCheck"
            onPress={() => router.push('/vistorias/listar')}
            style={styles.botao}
            textStyle={styles.botaoTexto}
          />
        </View>

        <View style={styles.botaoCard}>
          <Botao
            title="Tabela de Vistorias"
            cor="secundaria"
            iconName="fileDocument"
            onPress={() => router.push('/vistorias/tabela')}
            style={styles.botao}
            textStyle={styles.botaoTexto}
          />
        </View>

        <View style={styles.botaoCard}>
          <Botao
            title="Dashboard de Vistorias"
            cor="secundaria"
            iconName="fileDocument"
            onPress={() => router.push('/vistorias/dashboard')}
            style={styles.botao}
            textStyle={styles.botaoTexto}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.cores.base[10],
  },
  subtexto: {
    fontSize: 16,
    color: cores.cores.base[80],
    textAlign: 'center',
    paddingHorizontal: layout.espacamento.amigavel,
    paddingTop: layout.espacamento.amigavel,
    paddingBottom: layout.espacamento.colega,
    fontWeight: '600',
  },
  botoesContainer: {
    padding: layout.espacamento.amigavel,
    gap: layout.espacamento.colega,
  },
  botaoCard: {
    backgroundColor: cores.cores.base[10],
    borderRadius: layout.borderRadius.r25,
    padding: layout.espacamento.amigavel,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
    elevation: 3,
    borderWidth: 1,
    borderColor: cores.cores.base[40],
  },
  botao: {
    marginBottom: layout.espacamento.texto,
  },
  botaoTexto: {
    fontSize: 16,
    fontWeight: '600',
  },
});