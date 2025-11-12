import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import GenericCard, { CardField } from '@/components/genericCard';
import ModalConfirmacao from '@/components/modalConfirmacao';
import ModalSucesso from '@/components/modalSucesso';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { useRouter } from 'expo-router';

// 1. Dados mock atualizados para Insumos
const insumos = [
  {
    id: 1,
    dataEntrada: '03/08/2025',
    nome: 'Cera de Abelha',
    tipo: 'Material de Colmeia',
    quantidade: '500',
    unidadeMedida: 'metros',
    status: 'ativo no estoque',
    observacoes: 'Não informado',
  },
  {
    id: 2,
    dataEntrada: '01/07/2025',
    nome: 'Alimentador Boardman',
    tipo: 'Equipamento',
    quantidade: '20',
    unidadeMedida: 'unidades',
    status: 'ativo no estoque',
    observacoes: 'Comprado na feira local',
  },
  {
    id: 3,
    dataEntrada: '15/06/2025',
    nome: 'Xarope de Açúcar',
    tipo: 'Alimentação',
    quantidade: '10',
    unidadeMedida: 'litros',
    status: 'baixo estoque',
    observacoes: 'Urgente',
  },
];

// 2. Função de cor de status adaptada para insumos
const getStatusColor = (status: string) => {
  if (status.toLowerCase().includes('ativo')) return cores.primaria[100];
  if (status.toLowerCase().includes('baixo estoque')) return cores.alerta[100];
  if (status.toLowerCase().includes('fora de estoque')) return cores.perigo[100];
  return cores.texto;
};

// 3. Nome do componente alterado (opcional, mas recomendado)
export default function ListarInsumos() {
  const router = useRouter();

  const [modalConfirmacaoVisivel, setModalConfirmacaoVisivel] = useState(false);
  const [modalSucessoVisivel, setModalSucessoVisivel] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null);

  const handleEdit = (id: number) => {
    // 4. Rota de edição atualizada
    router.push(`/insumos/editar?id=${id}`);
  };

  // 5. Novo handler para a ação de "saída" do insumo
  const handleTransfer = (id: number) => {
    console.log('Registrar saída/uso do insumo com ID:', id);
    // Exemplo de navegação:
    // router.push(`/insumo/registrar-saida?id=${id}`);
  };

  const handleDelete = (id: number) => {
    setIdParaExcluir(id);
    setModalConfirmacaoVisivel(true);
  };

  const confirmarExclusao = () => {
    if (idParaExcluir !== null) {
      // 6. Mensagem de console
      console.log('Insumo excluído com ID:', idParaExcluir);
    }
    setModalConfirmacaoVisivel(false);

    setTimeout(() => {
      setModalSucessoVisivel(true);
    }, 350);
  };

  const cancelarExclusao = () => {
    setModalConfirmacaoVisivel(false);
    setIdParaExcluir(null);
  };

  return (
    <>
      <View style={styles.container}>
        <Subtexto style={styles.subtexto}>Listagem do insumo selecionado</Subtexto>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* 8. Mapeando a lista de insumos */}
          {insumos.map((insumo) => {
            // 9. Campos do card atualizados 
            const fields: CardField[] = [
              { label: 'Data de entrada', value: insumo.dataEntrada },
              { label: 'Nome do insumo', value: insumo.nome },
              { label: 'Tipo do insumo', value: insumo.tipo },
              { label: 'Quantidade em estoque', value: insumo.quantidade },
              { label: 'Unidade de medida', value: insumo.unidadeMedida },
              {
                label: 'Status',
                value: insumo.status,
                valueStyle: { color: getStatusColor(insumo.status) },
              },
              { label: 'Observações', value: insumo.observacoes || '—' },
            ];

            return (
              <GenericCard
                key={insumo.id}
                id={insumo.id}
                fields={fields}
                actions={[
                  { iconName: 'edit', onPress: () => handleEdit(insumo.id) },
                  { iconName: 'delete', onPress: () => handleDelete(insumo.id) },
                ]}
              />
            );
          })}
        </ScrollView>

        {/* 11. Mensagem do modal de sucesso */}
        <ModalSucesso
          visivel={modalSucessoVisivel}
          mensagem="Insumo excluído com sucesso!"
          aoFechar={() => setModalSucessoVisivel(false)}
        />
      </View>

      {/* 12. Mensagens do modal de confirmação  */}
      <ModalConfirmacao
        visivel={modalConfirmacaoVisivel}
        titulo="Deseja mesmo apagar este insumo?"
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
  subtexto: {
    width: '100%',
    paddingTop: layout.espacamento.amigavel,
    marginBottom: layout.espacamento.amigavel,
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: layout.espacamento.social,
  },
});