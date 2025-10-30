import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import GenericCard, { CardField } from '@/components/genericCard';
import ModalConfirmacao from '@/components/modalConfirmacao';
import ModalSucesso from '@/components/modalSucesso';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { useRouter } from 'expo-router';

const producoes = [
  {
    id: 26,
    tipoProduto: 'Mel de Jandaíra',
    quantidade: '20 L',
    status: 'Em estoque',
    dataExtracao: '01/05/2025',
    dataVenda: 'xx/xx/xxxx',
    nomeApiario: 'BeesCaatinga',
    nomeColmeia: 'Colmeia A1',
    statusQualidade: 'Não avaliado',
  },
  {
    id: 27,
    tipoProduto: 'Mel de Umbu',
    quantidade: '15 kg',
    status: 'Vendido',
    dataExtracao: '10/04/2025',
    dataVenda: '15/04/2025',
    nomeApiario: 'Rosa do Sertão',
    nomeColmeia: 'Colmeia B3',
    statusQualidade: 'Aprovado',
  },
];

const getStatusColor = (status: string) => {
  if (status.toLowerCase().includes('em estoque')) return cores.primaria[100];
  if (status.toLowerCase().includes('vendido')) return cores.primaria[50];
  if (status.toLowerCase().includes('fora de estoque')) return cores.perigo[100];
  return cores.texto;
};

export default function Visualizar() {
  const router = useRouter();

  // Estados para o modal e toast
  const [modalConfirmacaoVisivel, setModalConfirmacaoVisivel] = useState(false);
  const [modalSucessoVisivel, setModalSucessoVisivel] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null);
  const handleEdit = (id: number) => {
    router.push(`/producao/editar?id=${id}`);
  }

  const handleDelete = (id: number) => {
    setIdParaExcluir(id);
    setModalConfirmacaoVisivel(true); // ✅ Abre só o modal de confirmação
  };

  const confirmarExclusao = () => {
    if (idParaExcluir !== null) {
      console.log('Produção excluída com ID:', idParaExcluir);
      // Aqui você faria a exclusão real
    }
    setModalConfirmacaoVisivel(true); // ✅ Fecha o modal de confirmação
    setModalSucessoVisivel(true);      // ✅ Mostra o modal de sucesso
  };

  const cancelarExclusao = () => {
    setModalConfirmacaoVisivel(false); // ✅ Fecha o modal
  };
  return (
    <><View style={styles.container}>
      <Subtexto style={styles.subtexto}>Minhas Produções</Subtexto>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {producoes.map((p) => {
          const fields: CardField[] = [
            { label: 'Tipo', value: p.tipoProduto },
            { label: 'Quantidade', value: p.quantidade },
            {
              label: 'Status',
              value: p.status,
              valueStyle: { color: getStatusColor(p.status) },
            },
            { label: 'Extração', value: p.dataExtracao },
            { label: 'Venda', value: p.dataVenda || '—' },
            { label: 'Apiário', value: p.nomeApiario },
            { label: 'Colmeia', value: p.nomeColmeia },
            { label: 'Qualidade', value: p.statusQualidade },
          ];

          return (
            <GenericCard
              key={p.id}
              id={p.id}
              fields={fields}
              actions={[
                { iconName: 'delete', onPress: () => handleDelete(p.id) },
                { iconName: 'edit', onPress: () => handleEdit(p.id) },
              ]} />
          );
        })}
      </ScrollView>

    </View>
    <ModalConfirmacao
        visivel={modalConfirmacaoVisivel}
        titulo="Deseja mesmo apagar esta produção?"
        mensagem="Entenda que esta ação não poderá ser desfeita."
        aoConfirmar={confirmarExclusao}
        aoCancelar={cancelarExclusao}
        aoFechar={cancelarExclusao}
        />

        <ModalSucesso
        visivel={modalSucessoVisivel}
        mensagem="Produção excluída com sucesso!"
        aoFechar={() => setModalSucessoVisivel(false)}
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
  },
  scrollContent: {
    paddingBottom: layout.espacamento.social,
  },
});