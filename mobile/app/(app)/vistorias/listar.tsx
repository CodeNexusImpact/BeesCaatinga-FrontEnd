import Botao from '@/components/botao';
import Selector from '@/components/selector';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { getVistorias, deletarVistoria, Vistoria } from '@/services/vistoriaService';

// --- Importar os Modais ---
import ModalConfirmacao from '@/components/modalConfirmacao';
import ModalSucesso from '@/components/modalSucesso';

// ---  Importar o GenericCard ---
import GenericCard, { CardField } from '@/components/genericCard';

export default function ListarVistorias() {
  const router = useRouter();

  // Estados de Dados ---
  const [vistorias, setVistorias] = useState<Vistoria[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de Filtro ---
  const [apiario, setApiario] = useState('');
  const [colmeia, setColmeia] = useState('');
  const [filtroTempo, setFiltroTempo] = useState('mes');

  //  Estados dos Modais --- 
  const [modalConfirmacaoVisivel, setModalConfirmacaoVisivel] = useState(false);
  const [modalSucessoVisivel, setModalSucessoVisivel] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null);

  // --- Opções (Idealmente viriam da API também)
  const apiarioOptions = [
    { label: 'Rosa do Sertão', value: '1' },
    { label: 'Vale das Abelhas', value: '2' },
  ];
  const colmeiaOptions = [
    { label: 'Colmeia 1', value: '1' },
    { label: 'Colmeia 2', value: '2' },
  ];

  const carregarVistorias = async () => {
    try {
      setLoading(true);
      const produtorId = 1; // Padrão mock-api
      const dados = await getVistorias(produtorId);
      setVistorias(dados);
    } catch (error) {
      console.error('Erro ao carregar vistorias:', error);
      Alert.alert('Erro', 'Não foi possível carregar as vistorias.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarVistorias();
    }, [])
  );

  // Funções de Navegação --- 
  const handleEdit = (id: number) => {
    router.push(`/vistorias/editar?id=${id}`);
  };

  // Funções de Exclusão --- 
  const handleDelete = (id: number) => {
    setIdParaExcluir(id);
    setModalConfirmacaoVisivel(true);
  };

  const confirmarExclusao = async () => {
    if (idParaExcluir !== null) {
      try {
        await deletarVistoria(idParaExcluir);
        setModalConfirmacaoVisivel(false);
        setModalSucessoVisivel(true);
        carregarVistorias();
      } catch (error) {
        console.error('Erro ao excluir vistoria:', error);
        Alert.alert('Erro', 'Não foi possível excluir a vistoria.');
        setModalConfirmacaoVisivel(false);
      }
    }
  };

  const cancelarExclusao = () => {
    setModalConfirmacaoVisivel(false);
    setIdParaExcluir(null);
  };

  const handleGerarRelatorio = () => {
    console.log('Gerar Relatório...');
  };

  const getCorStatus = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'saudavel':
      case 'excelente': return cores.sucesso;
      case 'manutencao': return cores.alerta;
      case 'risco': return cores.perigo;
      case 'perdida': return cores.preto;
      default: return cores.secundaria;
    }
  };

  const getLabelStatus = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'saudavel': return 'Saudável';
      case 'excelente': return 'Excelente';
      case 'manutencao': return 'Manutenção';
      case 'risco': return 'Em Risco';
      case 'perdida': return 'Perdida';
      default: return status;
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Listar' }} />
      <View style={styles.container}>
        
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* 👇 Área de Filtros */}
          <View style={styles.filtroWrapper}>
            <View style={styles.filtroContainer}>
              <Text style={styles.filtroTitulo}>Filtros</Text>
              <Selector
                label="Selecione o Apiário*"
                options={apiarioOptions}
                onSelect={setApiario}
                placeholder="Selecione"
                iconName="home"
              />
              <Selector
                label="Selecione a Colmeia"
                options={colmeiaOptions}
                onSelect={setColmeia}
                placeholder="Selecione"
                iconName="beehiveOutline"
              />
              <View style={styles.botoesRow}>
                <Botao
                  title="Mês"
                  onPress={() => setFiltroTempo('mes')}
                  cor={filtroTempo === 'mes' ? 'primaria' : 'secundaria'}
                  style={styles.botaoMetade}
                />
                <Botao
                  title="Estação"
                  onPress={() => setFiltroTempo('estacao')}
                  cor={filtroTempo === 'estacao' ? 'primaria' : 'secundaria'}
                  style={styles.botaoMetade}
                />
              </View>
            </View>
          </View>

          <Text style={styles.resumoTexto}>
            Resumo Geral do status atual da suas colmeias
          </Text>

          {/* --- Botão de Ordenar --- */}
          <TouchableOpacity style={styles.ordemButton}>
            <Text style={styles.ordemButtonText}>Ordem Data</Text>
            <MaterialCommunityIcons
              name="arrow-up"
              size={16}
              color={cores.preto}
            />
          </TouchableOpacity>

          {/*Lista de Vistorias --- */}
          <View style={styles.listaContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={cores.primaria} />
            ) : vistorias.length === 0 ? (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhuma vistoria encontrada.</Text>
            ) : (
              vistorias.map((vistoria) => {
                const fields: CardField[] = [
                  {
                    label: 'Status',
                    value: getLabelStatus(vistoria.condicaoVistoria),
                    valueStyle: { color: getCorStatus(vistoria.condicaoVistoria) },
                  },
                  {
                    label: 'Local',
                    value: `Colmeia ${vistoria.colmeiaId} - Apiário ${vistoria.apiarioId}`,
                  },
                  { label: 'Data', value: vistoria.data },
                ];
                
                if (vistoria.observacoes) {
                  fields.push({
                    label: 'Obs',
                    value: vistoria.observacoes,
                  });
                }

                return (
                  <GenericCard
                    key={vistoria.id}
                    id={vistoria.id!}
                    fields={fields}
                    actions={[
                      {
                        iconName: 'delete',
                        onPress: () => handleDelete(vistoria.id!),
                      },
                      {
                        iconName: 'edit',
                        onPress: () => handleEdit(vistoria.id!),
                      },
                    ]}
                  />
                );
              })
            )}
          </View>

          {/* --- Botão Gerar Relatório  --- */}
          <Botao
            title="Gerar Relatório"
            onPress={handleGerarRelatorio}
            cor="primaria"
            style={styles.footerButton}
          />
        </ScrollView>

        <ModalSucesso
          visivel={modalSucessoVisivel}
          mensagem="Vistoria excluída com sucesso!"
          aoFechar={() => setModalSucessoVisivel(false)}
        />
      </View>

      <ModalConfirmacao
        visivel={modalConfirmacaoVisivel}
        titulo="Deseja mesmo apagar esta vistoria?"
        mensagem="Esta ação não pode ser desfeita."
        aoConfirmar={confirmarExclusao}
        aoCancelar={cancelarExclusao}
        aoFechar={cancelarExclusao}
      />
    </>
  );
}

// --- Estilos --- 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  contentContainer: {
    padding: layout.espacamento.amigavel,
    gap: layout.espacamento.colega,
    overflow: 'visible', // ⚠️ IMPORTANTE: evita cortar dropdowns
  },
  filtroWrapper: {
    position: 'relative', // necessário para zIndex funcionar
    zIndex: 999, // força estar acima de tudo
    marginBottom: layout.espacamento.texto,
  },
  filtroContainer: {
    backgroundColor: cores.cores.base[5],
    padding: layout.espacamento.amigavel,
    borderRadius: layout.borderRadius.r25,
    gap: layout.espacamento.amigavel,
    borderWidth: 1,
    borderColor: cores.cores.base[10],
  },
  filtroTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.preto,
  },
  botoesRow: {
    flexDirection: 'row',
    gap: layout.espacamento.amigavel,
  },
  botaoMetade: {
    flex: 1,
  },
  resumoTexto: {
    fontSize: 14,
    color: cores.placeholder,
    textAlign: 'center',
    paddingHorizontal: layout.espacamento.social,
  },
  ordemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: layout.espacamento.texto,
    backgroundColor: cores.primaria,
    borderRadius: layout.borderRadius.r1000,
    paddingVertical: layout.espacamento.texto,
    paddingHorizontal: layout.espacamento.colega,
    alignSelf: 'center',
  },
  ordemButtonText: {
    color: cores.preto,
    fontWeight: 'bold',
  },
  listaContainer: {
    gap: layout.espacamento.colega,
  },
  footerButton: {
    marginTop: layout.espacamento.amigavel,
  },
});