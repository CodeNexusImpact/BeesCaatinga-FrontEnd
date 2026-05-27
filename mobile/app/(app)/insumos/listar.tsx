import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Text } from 'react-native';
import { useRouter, useFocusEffect, Stack } from 'expo-router';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { getInsumos } from '@/services/insumoService';
import { useAuth } from '@/hooks/useAuth';
import { InsumoRetornoDTO } from '@/types/insumos';
import Subtexto from '@/components/subTexto';

export default function ListarInsumos() {
  const router = useRouter();
  const { session } = useAuth();

  const [insumos, setInsumos] = useState<InsumoRetornoDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  /**
   * Ciclo de Vida: Recarrega sempre que focar na tela.
   * Espelho: Produção/Visualizar
   */
  const carregarInsumos = useCallback(async () => {
    setIsLoading(true);
    try {
      const produtorId = session || '1';
      const data = await getInsumos({ userId: produtorId });
      setInsumos(data);
    } catch (error) {
      console.error('❌ [LISTAR INSUMOS] Erro:', error);
      Alert.alert('Erro', 'Não foi possível carregar os insumos.');
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useFocusEffect(
    useCallback(() => {
      carregarInsumos();
    }, [carregarInsumos])
  );

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getStatusDotColor = (status?: string) => {
    if (status === 'DISPONIVEL') return '#4CAF50';
    if (status === 'ESTOQUE_BAIXO') return '#F44336';
    if (status === 'EM_USO') return '#2196F3';
    return cores.texto;
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={cores.primaria[100]} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Listagem de Insumos' }} />
      <Subtexto style={styles.subtexto}>Gerenciamento de Estoque</Subtexto>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {insumos.length === 0 ? (
          <Subtexto style={styles.semDados}>Nenhum insumo encontrado no banco.</Subtexto>
        ) : (
          insumos.map((insumo) => (
            <View key={insumo.id} style={styles.statusContainer}>
              <TouchableOpacity 
                style={styles.statusHeader}
                onPress={() => toggleExpand(insumo.id)}
              >
                <View style={styles.headerLeft}>
                  <Text style={styles.headerIndex}>{insumo.id}</Text>
                  <Text style={styles.headerTitle}>{insumo.nome}</Text>
                </View>
                <View style={styles.headerRight}>
                  <Text style={styles.headerTitle}>Status</Text>
                  <Text style={{ color: cores.texto }}>
                    {expandedIds.includes(insumo.id) ? '▲' : '▼'}
                  </Text>
                </View>
              </TouchableOpacity>

              {expandedIds.includes(insumo.id) && (
                <View style={styles.statusContent}>
                  <View style={styles.statusRow}>
                    <View style={styles.infoCol}>
                      <Text style={styles.label}>Tipo:</Text>
                      <Text style={styles.value}>{insumo.tipoInsumo}</Text>
                    </View>
                    <View style={styles.infoCol}>
                      <Text style={styles.label}>Quantidade:</Text>
                      <Text style={styles.value}>{insumo.quantidade} {insumo.unidadeMedida}</Text>
                    </View>
                    <View style={[styles.statusDot, { backgroundColor: getStatusDotColor(insumo.statusInsumo) }]} />
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.btnDetalhes}
                    onPress={() => router.push(`/insumos/${insumo.id}`)}
                  >
                    <Text style={styles.btnDetalhesText}>Ver Detalhes Completos</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: layout.espacamento.social,
  },
  subtexto: {
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: layout.espacamento.amigavel,
    color: cores.texto,
  },
  statusContainer: {
    backgroundColor: cores.branco,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cores.borda,
    overflow: 'hidden',
    marginBottom: layout.espacamento.amigavel,
  },
  statusHeader: {
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
    width: 24,
    height: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 22,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: cores.texto,
  },
  statusContent: {
    padding: layout.espacamento.amigavel,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: layout.espacamento.amigavel,
  },
  infoCol: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#666',
  },
  value: {
    fontSize: 14,
    color: cores.texto,
    fontWeight: '500',
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: 10,
  },
  btnDetalhes: {
    marginTop: 10,
    padding: 10,
    backgroundColor: cores.fundo,
    borderRadius: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: cores.borda,
  },
  btnDetalhesText: {
    color: cores.primaria[100],
    fontWeight: 'bold',
    fontSize: 13,
  },
  semDados: {
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.6,
  },
});
