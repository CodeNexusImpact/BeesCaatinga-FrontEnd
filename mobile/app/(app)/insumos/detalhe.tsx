import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import GenericCard, { CardField } from '@/components/genericCard';
import ModalConfirmacao from '@/components/modalConfirmacao';
import ModalSucesso from '@/components/modalSucesso';
import Subtexto from '@/components/subTexto';
import Selector from '@/components/selector';
import Input from '@/components/input'; 
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { useRouter, Stack } from 'expo-router';

const insumos = [
  {
    id: 1, dataEntrada: '03/08/2025', nome: 'Cera de Abelha', tipo: 'Material de Colmeia',
    quantidade: '500', unidadeMedida: 'metros', status: 'ativo no estoque', observacoes: 'Não informado',
  },
  {
    id: 2, dataEntrada: '01/07/2025', nome: 'Alimentador Boardman', tipo: 'Equipamento',
    quantidade: '20', unidadeMedida: 'unidades', status: 'ativo no estoque', observacoes: 'Comprado na feira',
  },
];
const optionsNomeInsumo = [
  { label: 'Todos os Nomes', value: '' },
  { label: 'Cera de Abelha', value: 'Cera de Abelha' },
  { label: 'Alimentador Boardman', value: 'Alimentador Boardman' },
];
const optionsTipoInsuo = [
  { label: 'Todos os Tipos', value: '' },
  { label: 'Material de Colmeia', value: 'Material de Colmeia' },
  { label: 'Equipamento', value: 'Equipamento' },
];
const getStatusColor = (status: string) => {
  if (status.toLowerCase().includes('ativo')) return cores.primaria[100];
  if (status.toLowerCase().includes('baixo estoque')) return cores.alerta[100];
  if (status.toLowerCase().includes('fora de estoque')) return cores.perigo[100];
  return cores.texto;
};

export default function Detalhe() {
  const router = useRouter();

  const [modalConfirmacaoVisivel, setModalConfirmacaoVisivel] = useState(false);
  const [modalSucessoVisivel, setModalSucessoVisivel] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null);
  const [filtros, setFiltros] = useState({
    dataEntrada: '',
    nomeInsumo: '',
    tipoInsumo: ''
  });

  const handleEdit = (id: number) => {
    router.push({ pathname: '/insumos/editar', params: { id: id.toString() } });
  };
  const handleViewDetails = (id: number) => {
    router.push({ pathname: '/insumos/detalhe', params: { id: id.toString() } });
  };
  const handleDelete = (id: number) => {
    setIdParaExcluir(id);
    setModalConfirmacaoVisivel(true);
  };

  // 5. Funções de 'exclusão' e 'filtro' preenchidas
  const confirmarExclusao = () => {
    if (idParaExcluir !== null) console.log('Insumo excluído com ID:', idParaExcluir);
    setModalConfirmacaoVisivel(false);
    setTimeout(() => setModalSucessoVisivel(true), 350);
  };
  const cancelarExclusao = () => {
    setModalConfirmacaoVisivel(false);
    setIdParaExcluir(null);
  };
  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };
  const insumosFiltrados = insumos.filter(insumo => {
    return (
      (!filtros.dataEntrada || insumo.dataEntrada.includes(filtros.dataEntrada)) &&
      (!filtros.nomeInsumo || insumo.nome.toLowerCase() === filtros.nomeInsumo.toLowerCase()) &&
      (!filtros.tipoInsumo || insumo.tipo.toLowerCase() === filtros.tipoInsumo.toLowerCase())
    );
  });

  return (
    <>
    <Stack.Screen options={{ title: 'Cadastrar Apiário' }} />
      <View style={styles.container}>
        <Subtexto style={styles.filtroTitulo}>Filtros</Subtexto>

        <Input
          placeholder="Data de entrada*"
          value={filtros.dataEntrada}
          onChangeText={(value) => handleFiltroChange('dataEntrada', value)}
          iconName="calendar"
          style={styles.selector} 
        />

        <Selector
          placeholder="Nome do insumo*: Selecione"
          options={optionsNomeInsumo}
          value={filtros.nomeInsumo}
          onSelect={(value) => handleFiltroChange('nomeInsumo', value)}
          style={styles.selector}
        />

        <Selector
          placeholder="Tipo do insumo*: Selecione"
          options={optionsTipoInsuo}
          value={filtros.tipoInsumo}
          onSelect={(value) => handleFiltroChange('tipoInsumo', value)}
          style={styles.selector}
        />

        <Subtexto style={styles.subtituloLista}>Listagem do insumo selecionado</Subtexto>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {insumosFiltrados.map((insumo) => {
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

        <ModalSucesso
          visivel={modalSucessoVisivel}
          mensagem="Insumo excluído com sucesso!"
          aoFechar={() => setModalSucessoVisivel(false)}
        />
      </View>

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
  filtroTitulo: {
    width: '100%',
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: layout.espacamento.amigavel,
  },
  selector: {
    marginBottom: layout.espacamento.amigavel,
  },
  subtituloLista: {
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: layout.espacamento.amigavel,
    marginBottom: layout.espacamento.amigavel,
    color: cores.texto,
  },
  scrollContent: {
    paddingBottom: layout.espacamento.social,
  },
});