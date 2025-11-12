import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { useRouter } from 'expo-router';

const statusColmeias = [
  { id: 1, nome: 'Colmeia 1', status: 'Saudável' },
  { id: 2, nome: 'Colmeia 2', status: 'Perigo Climático' },
  { id: 3, nome: 'Colmeia 3', status: 'Saudável' },
  { id: 4, nome: 'Colmeia 4', status: 'Manutenção Necessária' },
  { id: 5, nome: 'Colmeia 5', status: 'Saudável' },
  { id: 6, nome: 'Colmeia 6', status: 'Tratamento Necessário' },
  { id: 7, nome: 'Colmeia 7', status: 'Saudável' },
  { id: 8, nome: 'Colmeia 8', status: 'Saudável' },
  { id: 9, nome: 'Colmeia 9', status: 'Saudável' },
  { id: 10, nome: 'Colmeia 10', status: 'Inativa' },
];

// Função de cor para os "pontos" (dots)
const getStatusDotColor = (status: string) => {
  if (status.includes('Saudável')) return cores.sucesso;
  if (status.includes('Perigo')) return cores.perigo;
  if (status.includes('Manutenção')) return cores.perigo;
  if (status.includes('Tratamento')) return '#0800ffff';
  if (status.includes('Inativa')) return cores.primaria;
  return cores.texto;
};


export default function Listar() {
  const router = useRouter();

  // Estado para controlar o card sanfonado (collapsible)
  const [isEstoqueVisivel, setIsEstoqueVisivel] = useState(true);

  // Handler para navegar para detalhes da colmeia
  const handleColmeiaPress = (nomeColmeia: string) => {
    router.push(`/insumos/detalhe?nome=${nomeColmeia}`);
  };
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Card de Status das Colmeias */}
      <View style={styles.statusContainer}>
        {/* Header do Card (Clicável) */}
        <TouchableOpacity 
          style={styles.statusHeader}
          onPress={() => setIsEstoqueVisivel(!isEstoqueVisivel)}
        >
          <View style={styles.headerLeft}>
            <Text style={styles.headerIndex}>1</Text>
            <Text style={styles.headerTitle}>Ferramenta</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerTitle}>Status</Text>
            <Text style={{ color: cores.texto }}>
              {isEstoqueVisivel ? '▲' : '▼'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Conteúdo do Card (Sanfonado) */}
        {isEstoqueVisivel && (
          <View style={styles.statusContent}>


            {/* O resto das colmeias */}
            {statusColmeias.map((colmeia) => (
              <TouchableOpacity
                key={colmeia.nome}
                style={styles.statusRow}
                onPress={() => handleColmeiaPress(colmeia.nome)}
              >
                <Text style={[styles.rowText, styles.colmeiaClicavel]}>
                  {colmeia.nome}
                </Text>
                <Text style={styles.rowStatusText}>{colmeia.status}</Text>
                <View style={[styles.statusDot, { backgroundColor: getStatusDotColor(colmeia.status) }]} />
              </TouchableOpacity>
            ))}
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
  subtituloLista: {
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: layout.espacamento.amigavel,
    marginBottom: layout.espacamento.amigavel,
    color: cores.texto,
  },

  // Estilos para o Card de Status
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
  statusContent: {
    padding: layout.espacamento.amigavel,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: layout.espacamento.amigavel,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  firstRow: {
    borderBottomWidth: 0, 
  },
  rowText: {
    fontSize: 14,
    color: cores.texto,
    flex: 1,
  },
  colmeiaClicavel: {
    color: cores.primaria[100],
    fontWeight: '500',
  },
  rowStatusText: {
    fontSize: 14,
    color: cores.texto,
    flex: 2,
    textAlign: 'left',
    paddingHorizontal: 8,
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  insumoCard: {
    marginBottom: layout.espacamento.amigavel,
  },
});