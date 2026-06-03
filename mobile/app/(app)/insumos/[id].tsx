import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack, useFocusEffect } from 'expo-router';
import GenericCard, { CardField } from '@/components/genericCard';
import ModalConfirmacao from '@/components/modalConfirmacao';
import ModalSucesso from '@/components/modalSucesso';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { getInsumos, deletarInsumo } from '@/services/insumoService';
import { InsumoRetornoDTO } from '@/types/insumos';

export default function InsumoDetalhe() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [insumo, setInsumo] = useState<InsumoRetornoDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalConfirmacaoVisivel, setModalConfirmacaoVisivel] = useState(false);
  const [modalSucessoVisivel, setModalSucessoVisivel] = useState(false);

  /**
   * Busca detalhada do item via ID real.
   */
  const carregarInsumo = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const insumos = await getInsumos(id);
      const data = Array.isArray(insumos)
        ? insumos.find((item) => String(item.id) === String(id))
        : insumos;
      if (!data) throw new Error('Insumo não encontrado.');
      setInsumo(data);
    } catch (error) {
      console.error('❌ [DETALHE INSUMO] Erro ao carregar:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do registro.');
      router.back();
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      carregarInsumo();
    }, [carregarInsumo])
  );

  const handleEdit = () => {
    router.push({ pathname: '/insumos/editar', params: { id } });
  };

  const handleDelete = () => {
    setModalConfirmacaoVisivel(true);
  };

  const confirmarExclusao = async () => {
    if (!id) return;
    try {
      await deletarInsumo(id, undefined as any);
      setModalConfirmacaoVisivel(false);
      setModalSucessoVisivel(true);
    } catch (error) {
      console.error('❌ [DETALHE INSUMO] Erro ao excluir:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao excluir o registro do banco.');
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return cores.texto;
    if (status === 'DISPONIVEL') return '#4CAF50';
    if (status === 'ESTOQUE_BAIXO') return '#F44336';
    if (status === 'EM_USO') return '#2196F3';
    return cores.texto;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={cores.primaria[100]} />
      </View>
    );
  }

  if (!insumo) return null;

  /**
   * MAPEAMENTO DE CHAVES REAIS (db.json)
   * dataInsumo, nome, tipoInsumo, quantidade, unidadeMedida, dataValidade, observacoes
   */
  const fields: CardField[] = [
    { label: 'Data de Entrada', value: insumo.dataInsumo || '—' },
    { label: 'Nome do Insumo', value: insumo.nome || '—' },
    { label: 'Tipo do Insumo', value: insumo.tipoInsumo || '—' },
    {
      label: 'Quantidade em Estoque',
      value: `${insumo.quantidade ?? 0} ${insumo.unidadeMedida ?? ''}`.trim() || '0'
    },
    { label: 'Validade', value: insumo.dataValidade || '—' },
    {
      label: 'Status Atual',
      value: (insumo.statusInsumo || 'DISPONIVEL').replace('_', ' '),
      valueStyle: { color: getStatusColor(insumo.statusInsumo), fontWeight: 'bold' },
    },
    { label: 'Observações', value: insumo.observacoes || '—' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Visualizar Insumo' }} />

      <View style={styles.content}>
        <Subtexto style={styles.titulo}>Informações do Registro</Subtexto>

        <GenericCard
          id={insumo.id}
          fields={fields}
          actions={[
            { iconName: 'edit', onPress: handleEdit },
            { iconName: 'delete', onPress: handleDelete },
          ]}
        />
      </View>

      <ModalConfirmacao
        visivel={modalConfirmacaoVisivel}
        titulo="Deseja mesmo apagar este insumo?"
        mensagem="Entenda que esta ação não poderá ser desfeita no banco de dados."
        aoConfirmar={confirmarExclusao}
        aoCancelar={() => setModalConfirmacaoVisivel(false)}
        aoFechar={() => setModalConfirmacaoVisivel(false)}
      />

      <ModalSucesso
        visivel={modalSucessoVisivel}
        mensagem="Registro excluído com sucesso!"
        aoFechar={() => {
          setModalSucessoVisivel(false);
          router.back();
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: layout.espacamento.amigavel },
  titulo: { fontSize: 18, fontWeight: 'bold', marginBottom: layout.espacamento.amigavel, color: cores.texto },
});
