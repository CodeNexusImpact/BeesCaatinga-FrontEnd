import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import GenericCard, { CardField } from '@/components/genericCard'; 
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { useRouter } from 'expo-router';
import Subtexto from '@/components/subTexto';


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

// Função para definir cor do status
const getStatusColor = (status: string) => {
  if (status.toLowerCase().includes('em estoque')) return cores.primaria[100];
  if (status.toLowerCase().includes('vendido')) return cores.primaria[50];
  if (status.toLowerCase().includes('fora de estoque')) return cores.perigo[100];
  return cores.texto;
};

export default function VisualizarListarProducao() {
  const router = useRouter();

  const handleEdit = (id: number) => {
    console.log('Editar produção ID:', id);
    router.push(`/editarProducao?id=${id}`);
  };

  const handleDelete = (id: number) => {
    console.log('Deletar produção ID:', id);
  };

  return (
    <View style={styles.container}>
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
              id={p.id} // ✅ Passa o ID como prop
              fields={fields}
              actions={[
                { iconName: 'delete', onPress: () => handleDelete(p.id) },
                { iconName: 'edit', onPress: () => handleEdit(p.id) },
              ]}
            />
          );
        })}
      </ScrollView>
    </View>
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