import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Modal, ActivityIndicator, Alert } from 'react-native';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { getRastreabilidade, RastreabilidadeDTO } from '@/services/rastreabilidadeService';

export default function ListarLotesMel() {
  const router = useRouter();
  const { user } = useAuth();

  // Estados para dados reais
  const [lotes, setLotes] = useState<RastreabilidadeDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isListaVisivel, setIsListaVisivel] = useState(true);
  const [filtroApiario, setFiltroApiario] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);

  const carregarLotes = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const data = await getRastreabilidade(user.id);
      setLotes(data);
    } catch (error) {
      console.error('❌ [LISTAR LOTES] Erro ao carregar:', error);
      Alert.alert('Erro', 'Não foi possível carregar a lista de lotes.');
      setLotes([]); // Garante lista vazia em caso de falha
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      carregarLotes();
    }, [carregarLotes])
  );

  // Filtrar lotes por apiário
  const lotesFiltrados = filtroApiario
    ? lotes.filter(lote => (lote.apiarioId || lote.apiarioId?.toString()) === filtroApiario)
    : lotes;

  // Obter apiários únicos para o filtro
  const apiariosUnicos = ['Todos', ...new Set(lotes.map(lote => (lote.tipoAbelha || lote.apiarioId?.toString())))];

  // Handler para selecionar apiário
  const handleSelecionarApiario = (apiario: string) => {
    if (apiario === 'Todos') {
      setFiltroApiario('');
    } else {
      setFiltroApiario(apiario);
    }
    setModalVisivel(false);
  };

  // Handler para navegar para detalhes do lote
  const handleLotePress = (idLote: number) => {
    router.push(`/rastreabilidade/listar`);
  };

  const handleExportar = () => {
    if (lotesFiltrados.length === 0) {
      Alert.alert('Aviso', 'Não há dados para exportar.');
      return;
    }

    const cabecalho = 'ID,Data,Quantidade,Apiario,Florada,Abelha\n';
    const linhas = lotesFiltrados.map(l =>
      `${l.id},${l.dataProducao},${l.quantidadeProduzida},${l.apiarioId},${l.tipoFlorada},${l.tipoAbelha}`
    ).join('\n');

    console.log('--- EXPORTAÇÃO CSV (RASTREABILIDADE) ---');
    console.log(cabecalho + linhas);
    console.log('----------------------------------------');

    Alert.alert('Sucesso', 'Relatório de rastreabilidade gerado no console!');
  };

  // Texto exibido no seletor
  const textoSeletor = filtroApiario ? filtroApiario : 'Todos os Apiários';

  if (isLoading) {
    return (
      <View style={styles.modalOverlay}>
        <ActivityIndicator size="large" color={cores.primaria[100]} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Stack.Screen options={{ title: 'Listar Lotes' }} />

      {/* Card de Lista de Lotes */}
      <View style={styles.listaContainer}>
        {/* Header do Card (Clicável) */}
        <TouchableOpacity
          style={styles.listaHeader}
          onPress={() => setIsListaVisivel(!isListaVisivel)}
        >
          <View style={styles.headerLeft}>
            <Text style={styles.headerIndex}>1</Text>
            <Text style={styles.headerTitle}>Listar Lotes de Mel</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerTitle}>Visão Geral</Text>
            <Text style={{ color: cores.texto }}>
              {isListaVisivel ? '▲' : '▼'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Conteúdo do Card (Sanfonado) */}
        {isListaVisivel && (
          <View style={styles.listaContent}>

            {/* Seletor de Apiário */}
            <View style={styles.filtroContainer}>
              <Text style={styles.filtroLabel}>Filtrar por Apiário:</Text>

              <TouchableOpacity
                style={styles.seletor}
                onPress={() => setModalVisivel(true)}
              >
                <Text style={styles.seletorTexto}>{textoSeletor}</Text>
                <Text style={styles.seletorSeta}>▼</Text>
              </TouchableOpacity>

              {/* Modal do Seletor */}
              <Modal
                visible={modalVisivel}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisivel(false)}
              >
                <TouchableOpacity
                  style={styles.modalOverlay}
                  activeOpacity={1}
                  onPress={() => setModalVisivel(false)}
                >
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitulo}>Selecionar Apiário</Text>

                    {apiariosUnicos.map((apiario, index) => (
                      <TouchableOpacity
                        key={apiario}
                        style={[
                          styles.opcaoSeletor,
                          index === 0 && styles.primeiraOpcao,
                          index === apiariosUnicos.length - 1 && styles.ultimaOpcao,
                          (apiario === 'Todos' && !filtroApiario) ||
                            (apiario === filtroApiario) ? styles.opcaoSelecionada : null
                        ]}
                        onPress={() => handleSelecionarApiario(apiario)}
                      >
                        <Text style={[
                          styles.opcaoTexto,
                          (apiario === 'Todos' && !filtroApiario) ||
                            (apiario === filtroApiario) ? styles.opcaoTextoSelecionada : null
                        ]}>
                          {apiario === 'Todos' ? 'Todos os Apiários' : apiario}
                        </Text>
                        {(apiario === 'Todos' && !filtroApiario) ||
                          (apiario === filtroApiario) && (
                            <Text style={styles.opcaoCheck}>✓</Text>
                          )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </TouchableOpacity>
              </Modal>
            </View>

            {/* Cabeçalho da Tabela */}
            <View style={styles.tabelaCabecalho}>
              <Text style={[styles.cabecalhoTexto, styles.colunaId]}>Lote de Mel</Text>
              <Text style={[styles.cabecalhoTexto, styles.colunaData]}>Data</Text>
              <Text style={[styles.cabecalhoTexto, styles.colunaQuant]}>Quant</Text>
              <Text style={[styles.cabecalhoTexto, styles.colunaApiario]}>Apiário</Text>
            </View>

            {/* Linhas da Tabela */}
            {lotesFiltrados.map((lote, index) => (
              <TouchableOpacity
                key={`${lote.id}-${index}`}
                style={[
                  styles.loteRow,
                  index === 0 && styles.firstRow
                ]}
                onPress={() => handleLotePress(lote.id!)}
              >
                <Text style={[styles.rowText, styles.colunaId, styles.loteClicavel]}>
                  {lote.id}
                </Text>
                <Text style={[styles.rowText, styles.colunaData]}>
                  {lote.dataProducao}
                </Text>
                <Text style={[styles.rowText, styles.colunaQuant]}>
                  {lote.quantidadeProduzida}
                </Text>
                <Text style={[styles.rowText, styles.colunaApiario]}>
                  {lote.apiarioId || lote.apiarioId}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Mensagem quando não há lotes */}
            {lotesFiltrados.length === 0 && (
              <View style={styles.semDados}>
                <Text style={styles.semDadosTexto}>
                  Nenhum lote encontrado.
                </Text>
              </View>
            )}

            {/* Botão Exportar */}
            <TouchableOpacity style={styles.exportarBotao} onPress={handleExportar}>
              <Text style={styles.exportarTexto}>Exportar CSV</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  scrollContent: {
    padding: layout.espacamento.amigavel,
    paddingBottom: layout.espacamento.social,
  },

  // Estilos para o Card de Lista de Lotes
  listaContainer: {
    backgroundColor: cores.branco,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cores.borda,
    overflow: 'hidden',
    marginBottom: layout.espacamento.amigavel,
  },
  listaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: layout.espacamento.amigavel,
    backgroundColor: '#FFF8E1',
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIndex: {
    backgroundColor: cores.primaria[100],
    color: cores.branco,
    borderRadius: 10,
    width: 20,
    height: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 18,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: cores.texto,
  },
  listaContent: {
    padding: layout.espacamento.amigavel,
  },

  // Estilos do Filtro com Seletor
  filtroContainer: {
    marginBottom: layout.espacamento.amigavel,
  },
  filtroLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 8,
  },
  seletor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: cores.branco,
  },
  seletorTexto: {
    fontSize: 14,
    color: cores.texto,
  },
  seletorSeta: {
    fontSize: 12,
    color: cores.texto,
  },

  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: layout.espacamento.amigavel,
  },
  modalContent: {
    backgroundColor: cores.branco,
    borderRadius: 8,
    width: '100%',
    maxWidth: 300,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
    elevation: 5,
  },
  modalTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.texto,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  opcaoSeletor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  primeiraOpcao: {
    borderTopWidth: 0,
  },
  ultimaOpcao: {
    borderBottomWidth: 0,
  },
  opcaoSelecionada: {
    backgroundColor: cores.primaria[10],
  },
  opcaoTexto: {
    fontSize: 14,
    color: cores.texto,
    flex: 1,
  },
  opcaoTextoSelecionada: {
    color: cores.primaria[100],
    fontWeight: 'bold',
  },
  opcaoCheck: {
    color: cores.primaria[100],
    fontWeight: 'bold',
  },

  // Estilos da Tabela
  tabelaCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: layout.espacamento.amigavel,
    borderBottomWidth: 2,
    borderBottomColor: cores.primaria[100],
    marginBottom: 8,
  },
  cabecalhoTexto: {
    fontSize: 14,
    fontWeight: 'bold',
    color: cores.texto,
  },

  // Linhas da tabela
  loteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  firstRow: {
    borderTopWidth: 0,
  },
  rowText: {
    fontSize: 14,
    color: cores.texto,
  },

  // Colunas com larguras específicas
  colunaId: {
    flex: 1,
    fontWeight: '500',
  },
  colunaData: {
    flex: 1.2,
    textAlign: 'center',
  },
  colunaQuant: {
    flex: 0.8,
    textAlign: 'center',
  },
  colunaApiario: {
    flex: 1.5,
    textAlign: 'left',
    paddingLeft: 8,
  },

  loteClicavel: {
    color: cores.primaria[100],
    fontWeight: '500',
  },

  // Mensagem sem dados
  semDados: {
    padding: 20,
    alignItems: 'center',
  },
  semDadosTexto: {
    fontSize: 14,
    color: cores.texto,
    fontStyle: 'italic',
  },

  // Botão Exportar
  exportarBotao: {
    backgroundColor: cores.primaria[100],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: layout.espacamento.amigavel,
  },
  exportarTexto: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: 'bold',
  },
});