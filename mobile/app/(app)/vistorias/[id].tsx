import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import Botao from '@/components/botao';
import { getVistoriaById, deletarVistoria, Vistoria } from '@/services/vistoriaService';
import ModalConfirmacao from '@/components/modalConfirmacao';

export default function DetalhesVistoria() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [vistoria, setVistoria] = useState<Vistoria | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalConfirmacaoVisivel, setModalConfirmacaoVisivel] = useState(false);

  const carregarVistoria = useCallback(async () => {
    if (id) {
      try {
        setLoading(true);
        const vistoriaId = Array.isArray(id) ? id[0] : id;
        const dados = await getVistoriaById(vistoriaId);
        setVistoria(dados);
      } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
        Alert.alert('Erro', 'Vistoria não encontrada.');
        router.back();
      } finally {
        setLoading(false);
      }
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      carregarVistoria();
    }, [carregarVistoria])
  );

  const handleEdit = () => {
    router.push(`/vistorias/editar?id=${id}`);
  };

  const handleDelete = async () => {
    setModalConfirmacaoVisivel(true);
  };

  const confirmarExclusao = async () => {
    if (id) {
      try {
        const vistoriaId = Array.isArray(id) ? id[0] : id;
        await deletarVistoria(vistoriaId);
        router.push('/vistorias/listar');
      } catch (error) {
        console.error('Erro ao excluir:', error);
        Alert.alert('Erro', 'Não foi possível excluir a vistoria.');
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }

  if (!vistoria) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Stack.Screen options={{ title: 'Detalhes da Vistoria' }} />
      
      <View style={styles.card}>
        <Text style={styles.label}>Data:</Text>
        <Text style={styles.value}>{vistoria.data}</Text>

        <Text style={styles.label}>Condição:</Text>
        <Text style={[styles.value, { color: (vistoria.condicaoVistoria?.toLowerCase() === 'saudavel' || vistoria.condicaoVistoria?.toLowerCase() === 'excelente') ? cores.sucesso : cores.alerta }]}>
            {vistoria.condicaoVistoria?.toUpperCase()}
        </Text>

        <Text style={styles.label}>Apiário ID:</Text>
        <Text style={styles.value}>{vistoria.apiarioId}</Text>

        <Text style={styles.label}>Colmeia ID:</Text>
        <Text style={styles.value}>{vistoria.colmeiaId}</Text>

        <Text style={styles.label}>Observações:</Text>
        <Text style={styles.value}>{vistoria.observacoes || 'Nenhuma'}</Text>
      </View>

      <View style={styles.acoes}>
        <Botao title="Editar" onPress={handleEdit} cor="secundaria" iconName="edit" />
        <Botao title="Excluir" onPress={handleDelete} cor="complementarNegativa" iconName="delete" />
      </View>

      <ModalConfirmacao
        visivel={modalConfirmacaoVisivel}
        titulo="Apagar Vistoria?"
        mensagem="Tem certeza que deseja remover este registro?"
        aoConfirmar={confirmarExclusao}
        aoCancelar={() => setModalConfirmacaoVisivel(false)}
        aoFechar={() => setModalConfirmacaoVisivel(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  contentContainer: { padding: layout.espacamento.amigavel, gap: layout.espacamento.colega },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: cores.branco,
    padding: layout.espacamento.amigavel,
    borderRadius: layout.borderRadius.r25,
    borderWidth: 1,
    borderColor: cores.cores.base[20],
  },
  label: { fontSize: 14, color: cores.placeholder, marginBottom: 4 },
  value: { fontSize: 18, color: cores.texto, marginBottom: 16, fontWeight: '500' },
  acoes: { gap: layout.espacamento.amigavel, marginTop: 20 }
});