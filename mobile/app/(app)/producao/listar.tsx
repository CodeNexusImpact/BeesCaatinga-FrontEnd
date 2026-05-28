import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import GenericCard, { CardField } from '@/components/genericCard';
import ModalConfirmacao from '@/components/modalConfirmacao';
import ModalSucesso from '@/components/modalSucesso';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { getProducoes, deletarProducao } from '@/services/producaoService';
import { useAuth } from '@/hooks/useAuth';
import type { ProducaoRetornoDTO } from '@/types/producao';

const getStatusColor = (status: string) => {
  if (status === 'EM_ESTOQUE') return cores.sucesso;
  if (status === 'VENDIDO') return cores.alerta;
  return cores.texto;
};

const formatStatus = (status: string) => {
  return status === 'EM_ESTOQUE' ? 'Em Estoque' : 'Vendido';
};

const formatQualidade = (qualidade: string) => {
  return qualidade === 'APROVADO' ? 'Aprovado' : 'Não Avaliado';
};

const formatDate = (dateStr: string) => {
  if (!dateStr || dateStr.includes('x')) return '—';
  const [ano, mes, dia] = dateStr.split('-');
  return `${dia}/${mes}/${ano}`;
};

export default function Visualizar() {
  const router = useRouter();
  const { user } = useAuth();

  const [producoes, setProducoes] = useState<ProducaoRetornoDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalConfirmacaoVisivel, setModalConfirmacaoVisivel] = useState(false);
  const [modalSucessoVisivel, setModalSucessoVisivel] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null);

  const carregarProducoes = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const data = await getProducoes(user.id);
      setProducoes(data);
    } catch (error) {
      console.error('Erro ao carregar produções:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      carregarProducoes();
    }, [carregarProducoes])
  );

  const handleEdit = (id: number) => {
    router.push(`/producao/editar?id=${id}`);
  }

  const handleDelete = (id: number) => {
    setIdParaExcluir(id);
    setModalConfirmacaoVisivel(true);
  };

  const confirmarExclusao = async () => {
    if (idParaExcluir !== null && user?.id) {
      try {
        await deletarProducao(idParaExcluir, user.id);
        setProducoes(prev => prev.filter(p => p.id !== idParaExcluir));
        setModalConfirmacaoVisivel(false);

        setTimeout(() => {
          setModalSucessoVisivel(true);
        }, 350);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível excluir a produção.');
        console.error(error);
        setModalConfirmacaoVisivel(false);
      }
    }
  };

  const cancelarExclusao = () => {
    setModalConfirmacaoVisivel(false);
    setIdParaExcluir(null);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Listar' }} />
      <View style={styles.container}>
        <Subtexto style={styles.subtexto}>Minhas Produções</Subtexto>

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={cores.primaria} />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {producoes.length === 0 ? (
              <Subtexto style={styles.semDados}>Nenhuma produção encontrada.</Subtexto>
            ) : (
              producoes.map((p) => {
                const fields: CardField[] = [
                  { label: 'Tipo', value: p.tipoProducao },
                  { label: 'Quantidade', value: `${p.quantidade}` }, // DTO não tem unidadeMedida
                  {
                    label: 'Status',
                    value: formatStatus(p.statusProduto),
                    valueStyle: { color: getStatusColor(p.statusProduto) },
                  },
                  { label: 'Extração', value: formatDate(p.dataColeta) },
                  { label: 'Venda', value: formatDate(p.dataVenda || '') },
                  { label: 'Apiário', value: p.nomeApiario },
                  { label: 'Colmeia', value: p.nomeColmeia },
                  { label: 'Qualidade', value: formatQualidade(p.statusQualidade) },
                ];

                return (
                  <GenericCard
                    key={p.id}
                    id={p.id}
                    fields={fields}
                    actions={[
                      { iconName: 'delete', onPress: () => handleDelete(p.id) },
                      { iconName: 'edit', onPress: () => handleEdit(p.id) },
                    ]}
                  />
                );
              })
            )}
          </ScrollView>
        )}

        <ModalSucesso
          visivel={modalSucessoVisivel}
          mensagem="Produção excluída com sucesso!"
          aoFechar={() => setModalSucessoVisivel(false)}
        />
      </View>

      <ModalConfirmacao
        visivel={modalConfirmacaoVisivel}
        titulo="Deseja mesmo apagar esta produção?"
        mensagem="Entenda que esta ação não poderá ser desfeita."
        aoConfirmar={confirmarExclusao}
        aoCancelar={cancelarExclusao}
        aoFechar={cancelarExclusao}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    padding: layout.espacamento.amigavel,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtexto: {
    width: '100%',
    paddingTop: layout.espacamento.amigavel,
    marginBottom: layout.espacamento.amigavel,
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: layout.espacamento.social,
  },
  semDados: {
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.6,
  },
});