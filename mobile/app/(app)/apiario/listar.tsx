import React, { useMemo } from 'react';
import { EstadoVazio } from '@/components/graficos';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator, useWindowDimensions, FlatList } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import cores from '@/constants/cores';
import layout from '@/constants/layout';
import Subtexto from '@/components/subTexto';
import Botao from '@/components/formulario/botao';
import Mapa from '@/components/mapa/mapa';
import ApiarioList from '@/components/apiario/apiarioList';

import { useApiarios } from '@/hooks/useApiarios';
import type { LocalizacaoMapa } from '@/types/mapa/mapaLocalizacao';


export default function Index() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const { apiarios, loading } = useApiarios();

  // Marcadores dos apiários com coordenadas registradas.
  const localizacoes = useMemo<LocalizacaoMapa[]>(
    () =>
      (apiarios ?? [])
        .filter((a) => Number(a.latitude) || Number(a.longitude))
        .map((a) => ({
          id: a.id,
          latitude: Number(a.latitude),
          longitude: Number(a.longitude),
          nome: a.nome,
          descricao: [a.cidade, a.estado].filter(Boolean).join(' - '),
          tipo: 'apiario',
        })),
    [apiarios],
  );
  const regiao = localizacoes.length
    ? { latitude: localizacoes[0].latitude, longitude: localizacoes[0].longitude, latitudeDelta: 0.2, longitudeDelta: 0.2 }
    : undefined;

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando Apiários...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height: height }]}>
      <Stack.Screen options={{ title: 'Meus Apiários' }} />
      <Subtexto style={styles.subtexto}>Apiarios</Subtexto>

      <View style={{
        flexDirection: width > 600 ? 'row' : 'column',
        padding: layout.espacamento.amigavel,
        gap: layout.espacamento.colega,
        alignItems: 'center',
      }}>

        <Mapa localizacoes={localizacoes} regiaoPadrao={regiao} />
        <View style={{
          flex: 1,
          height: width > 600 ? '90%' : '30%',
          width: width > 600 ? '50%' : '90%'
        }}>
          <FlatList
            data={apiarios}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ApiarioList apiario={item} />
            )}
            ListEmptyComponent={() => (
              <EstadoVazio mensagem="Nenhum apiário cadastrado ainda." acao={{ titulo: 'Cadastrar primeiro apiário', onPress: () => router.push('/apiario/cadastrar') }} />
            )}
          />
        </View>

      </View>

    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.cores.base[10],
    height: '100%',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#666'
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
});