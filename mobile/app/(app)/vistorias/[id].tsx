import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import Botao from '@/components/formulario/botao';
import { getVistoriaById, deletarVistoria } from '@/services/vistoriaService';
import { useAuth } from '@/hooks/useAuth';
import ModalConfirmacao from '@/components/notificacao/modalConfirmacao';
import { voltar } from '@/utils/navegacao';

type Vistoria = Awaited<ReturnType<typeof getVistoriaById>>;

export default function DetalhesVistoria() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [vistoria, setVistoria] = useState<Vistoria | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalConfirmacaoVisivel, setModalConfirmacaoVisivel] = useState(false);

  const carregarVistoria = useCallback(async () => {
    if (id) {
      const vistoriaId = Array.isArray(id) ? id[0] : id;

      // Trava de segurança imediata: Impede que rotas reservadas sejam tratadas como ID
      if (!vistoriaId || ['dashboard', 'cadastrar', 'listar', 'tabela'].includes(vistoriaId)) {
        return;
      }

      try {
        setLoading(true);
        if (!user?.id) return;
        const dados = await getVistoriaById(user.id, vistoriaId);
        setVistoria(dados);
      } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
        Alert.alert('Erro', 'Vistoria não encontrada.');
        voltar(router);
      } finally {
        setLoading(false);
      }
    }
  }, [id, user?.id]);

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
    if (id && vistoria) {
      try {
        const vistoriaId = Array.isArray(id) ? id[0] : id;
        if (!user?.id) return;
        await deletarVistoria(vistoriaId, user.id);
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
        <Text style={styles.value}>{vistoria.dataVistoria}</Text>

        <Text style={styles.label}>Condição:</Text>
        <Text style={[styles.value, { color: (vistoria.condicao?.toLowerCase() === 'saudavel' || vistoria.condicao?.toLowerCase() === 'excelente') ? cores.sucesso : cores.alerta }]}>
            {vistoria.condicao?.toUpperCase()}
        </Text>

        <Text style={styles.label}>Pragas Identificadas:</Text>
        <Text style={styles.value}>
            {vistoria.pragasIdentificadas && vistoria.pragasIdentificadas.length > 0 ? vistoria.pragasIdentificadas.join(', ') : 'Nenhuma'}
        </Text>

        <Text style={styles.label}>Perdas Registradas:</Text>
        <Text style={styles.value}>
            {vistoria.perdasIdentificadas && vistoria.perdasIdentificadas.length > 0 ? vistoria.perdasIdentificadas.join(', ') : 'Nenhuma'}
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
        <Botao title="Excluir" onPress={handleDelete} cor="terciaria" iconName="delete" />
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
  value: { fontSize: 16, color: cores.texto, marginBottom: 16, fontWeight: '500' },
  acoes: { gap: layout.espacamento.amigavel, marginTop: 20 }
});

