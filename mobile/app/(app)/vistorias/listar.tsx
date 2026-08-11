import Botao from '@/components/formulario/botao';
import Selector from '@/components/formulario/selector';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import React, { useState, useCallback, useMemo } from 'react';
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
import { useAuth } from '@/hooks/useAuth';

// --- Importar os Modais ---
import ModalConfirmacao from '@/components/notificacao/modalConfirmacao';
import ModalSucesso from '@/components/notificacao/modalSucesso';

import GenericCard from '@/components/genericCard';
import type { CardField } from '@/components/genericCard';

export default function ListarVistorias() {
  const router = useRouter();
  const { user } = useAuth();

  // Estados de Dados ---
  const [vistorias, setVistorias] = useState<Vistoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordemCrescente, setOrdemCrescente] = useState(false);

  // Estados de Filtro ---
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');
  const [estado, setEstado] = useState('');

  //  Estados dos Modais --- 
  const [modalConfirmacaoVisivel, setModalConfirmacaoVisivel] = useState(false);
  const [modalSucessoVisivel, setModalSucessoVisivel] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null);

  // --- Opções
  const mesOptions = [
    { label: 'Janeiro', value: '01' }, { label: 'Fevereiro', value: '02' }, { label: 'Março', value: '03' },
    { label: 'Abril', value: '04' }, { label: 'Maio', value: '05' }, { label: 'Junho', value: '06' },
    { label: 'Julho', value: '07' }, { label: 'Agosto', value: '08' }, { label: 'Setembro', value: '09' },
    { label: 'Outubro', value: '10' }, { label: 'Novembro', value: '11' }, { label: 'Dezembro', value: '12' },
  ];
  
  const anoOptions = [
    { label: '2024', value: '2024' },
    { label: '2025', value: '2025' },
    { label: '2026', value: '2026' },
  ];

  const carregarVistorias = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const dados = await getVistorias(user.id);
      setVistorias(dados);
    } catch (error) {
      console.error('Erro ao carregar vistorias:', error);
      Alert.alert('Erro', 'Não foi possível carregar as vistorias.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      carregarVistorias();
    }, [carregarVistorias])
  );

  // Lógica de Ordenação
  const vistoriasOrdenadas = useMemo(() => {
    return [...vistorias].sort((a, b) => {
        const parseDate = (d: string) => {
            const parts = d.includes('/') ? d.split('/') : d.split('-');
            if (d.includes('/')) return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
            return new Date(d).getTime();
        };
        const dataA = parseDate(a.data);
        const dataB = parseDate(b.data);
        return ordemCrescente ? dataA - dataB : dataB - dataA;
    });
  }, [vistorias, ordemCrescente]);

  const toggleOrdem = () => {
    setOrdemCrescente(!ordemCrescente);
  };

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
    if (idParaExcluir !== null && user?.id) {
      try {
        await deletarVistoria(idParaExcluir, user.id);
        setModalConfirmacaoVisivel(false);
        setModalSucessoVisivel(true);
        carregarVistorias(); // Recarrega a lista
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

  const handleBuscar = () => {
    carregarVistorias();
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
          {/* 👇 Área de Filtros Simplificada */}
          <View style={styles.filtroWrapper}>
            <View style={styles.filtroContainer}>
              <Text style={styles.filtroTitulo}>Filtros</Text>
              
              <View style={styles.botoesRow}>
                <Selector
                  label="Mês"
                  options={mesOptions}
                  onSelect={setMes}
                  placeholder="Selecione"
                  style={{flex: 1}}
                />
                <Selector
                  label="Ano"
                  options={anoOptions}
                  onSelect={setAno}
                  placeholder="Selecione"
                  style={{flex: 1}}
                />
              </View>

              <Botao
                title="Buscar"
                onPress={handleBuscar}
                cor="primaria"
                iconName="magnify"
              />
            </View>
          </View>

          <Text style={styles.resumoTexto}>
            Resumo Geral do status atual da suas colmeias
          </Text>

          {/* --- Botão de Ordenar --- */}
          <TouchableOpacity style={styles.ordemButton} onPress={toggleOrdem}>
            <Text style={styles.ordemButtonText}>Ordem Data</Text>
            <MaterialCommunityIcons
              name={ordemCrescente ? "arrow-up" : "arrow-down"}
              size={16}
              color={cores.preto}
            />
          </TouchableOpacity>

          {/*Lista de Vistorias --- */}
          <View style={styles.listaContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={cores.primaria} />
            ) : vistoriasOrdenadas.length === 0 ? (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhuma vistoria encontrada.</Text>
            ) : (
              vistoriasOrdenadas.map((vistoria) => {
                // ENRIQUECIMENTO DO MAPEAMENTO DO CARD
                const fields: CardField[] = [
                  {
                    label: 'Status',
                    value: getLabelStatus(vistoria.condicaoVistoria),
                    valueStyle: { color: getCorStatus(vistoria.condicaoVistoria) },
                  },
                  {
                    label: 'Local',
                    value: `Apiário ${vistoria.apiarioId} | Colmeia ${vistoria.colmeiaId}`,
                  },
                  { label: 'Data', value: vistoria.data },
                  {
                    label: 'Pragas',
                    value: vistoria.pragas?.length ? vistoria.pragas.join(', ') : 'Nenhuma',
                  },
                  {
                    label: 'Perdas',
                    value: vistoria.perdas?.length ? vistoria.perdas.join(', ') : 'Nenhuma',
                  },
                  {
                    label: 'Obs',
                    value: vistoria.observacoes || 'Nenhuma',
                  },
                ];

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  contentContainer: {
    padding: layout.espacamento.amigavel,
    gap: layout.espacamento.colega,
    overflow: 'visible',
  },
  filtroWrapper: {
    position: 'relative',
    zIndex: 999,
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
    zIndex: 10, // Garante que o conteúdo (dropdown) fique por cima do botão abaixo
    elevation: 10, // Necessário para Android
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