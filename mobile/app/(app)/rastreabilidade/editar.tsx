import Input from '@/components/formulario/input';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { useAuth } from '@/hooks/useAuth';
import { getRastreabilidadeById, RastreabilidadeDTO } from '@/services/rastreabilidadeService';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from 'react-native';

const formatarData = (iso?: string) => {
  if (!iso) return '';
  const [ano, mes, dia] = iso.split('-');
  return dia && mes && ano ? `${dia}/${mes}/${ano}` : iso;
};

/**
 * Detalhes do lote (rastreabilidade).
 * A API atual expõe apenas cadastro e listagem de lotes (POST/GET /lotes/{produtorId}),
 * portanto esta tela é somente leitura até existirem PUT/DELETE no backend.
 */
export default function DetalheLote() {
  const router = useRouter();
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [lote, setLote] = useState<RastreabilidadeDTO | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!id || !user?.id) return;
    let ativo = true;
    getRastreabilidadeById(user.id, id)
      .then((dados) => {
        if (!ativo) return;
        if (!dados) {
          Alert.alert('Erro', 'Lote não encontrado.');
          router.back();
          return;
        }
        setLote(dados);
      })
      .catch(() => {
        if (ativo) {
          Alert.alert('Erro', 'Não foi possível carregar o lote.');
          router.back();
        }
      })
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, [id, user?.id, router]);

  if (carregando || !lote) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Stack.Screen options={{ title: 'Detalhes do Lote' }} />
      <Subtexto>Lotes registrados não podem ser alterados para preservar a rastreabilidade.</Subtexto>
      <Input label="ID do Lote" value={String(lote.id ?? '')} onChangeText={() => {}} editable={false} />
      <Input label="Data de Produção" value={formatarData(lote.dataProducao)} onChangeText={() => {}} editable={false} iconName="calendar" />
      <Input label="Quantidade (kg)" value={String(lote.quantidadeProduzida ?? '')} onChangeText={() => {}} editable={false} />
      <Input label="Apiário" value={lote.nomeApiario ?? ''} onChangeText={() => {}} editable={false} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: layout.espacamento.amigavel,
    gap: layout.espacamento.colega,
    paddingBottom: 50,
  },
});
