import Botao from '@/components/botao';
import Input from '@/components/input';
import Selector from '@/components/selector';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, Alert } from 'react-native';
import Checkbox from 'expo-checkbox';

// Dados mockados - na prática viria de uma API
const lotesMock = [
  { id: 'A001', dataProducao: '20/08/2025', quantidade: 20, apiario: 'Apiário A', notas: 'Lote de verão', status: 'ativo' },
  { id: 'A002', dataProducao: '21/08/2025', quantidade: 25, apiario: 'Apiário B', notas: '', status: 'ativo' },
  { id: 'A003', dataProducao: '22/08/2025', quantidade: 18, apiario: 'Apiário A', notas: 'Colheita matinal', status: 'inativo' },
];

const apiariosDisponiveis = [
  { label: 'Apiário A', value: 'apiario_a' },
  { label: 'Apiário B', value: 'apiario_b' },
  { label: 'Apiário C', value: 'apiario_c' },
];

export default function EditarLote() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const idLote = params.id as string;

  // Estados do formulário
  const [id, setId] = useState('');
  const [dataProducao, setDataProducao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [apiario, setApiario] = useState('');
  const [notas, setNotas] = useState('');
  const [isAtivo, setIsAtivo] = useState(true);

  // Carregar dados do lote ao montar o componente
  useEffect(() => {
    if (idLote) {
      const lote = lotesMock.find(l => l.id === idLote);
      if (lote) {
        setId(lote.id);
        setDataProducao(lote.dataProducao);
        setQuantidade(lote.quantidade.toString());
        setApiario(lote.apiario);
        setNotas(lote.notas);
        setIsAtivo(lote.status === 'ativo');
      } else {
        Alert.alert('Erro', 'Lote não encontrado');
        router.back();
      }
    }
  }, [idLote]);

  // Função para salvar edições
  const handleSalvar = () => {
    // Validações
    if (!id || !dataProducao || !quantidade || !apiario) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }

    if (isNaN(Number(quantidade)) || Number(quantidade) <= 0) {
      Alert.alert('Atenção', 'Quantidade deve ser um número positivo');
      return;
    }

    // Aqui faria a chamada API para atualizar
    console.log('Salvando lote:', {
      id,
      dataProducao,
      quantidade: Number(quantidade),
      apiario,
      notas,
      status: isAtivo ? 'ativo' : 'inativo'
    });

    Alert.alert('Sucesso', 'Lote atualizado com sucesso!');
    router.back();
  };

  // Função para apagar lote
  const handleApagar = () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja apagar este lote? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Apagar', 
          style: 'destructive',
          onPress: () => {
            console.log('APAGAR LOTE:', id);
            // Aqui faria a chamada API para apagar
            router.back();
          }
        }
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Stack.Screen options={{ title: 'Editar' }} />
      {/* ID do Lote (readonly) */}
      <Input
        label="ID do Lote"
        value={id}
        onChangeText={() => {}}
        placeholder="ID do lote"
        editable={false}
        style={styles.inputDisabled}
      />

      {/* Data de Produção */}
      <Input
        label="Data de Produção"
        value={dataProducao}
        onChangeText={setDataProducao}
        placeholder="DD/MM/AAAA"
        keyboardType="numbers-and-punctuation"
        iconName="calendar"
      />

      {/* Quantidade */}
      <Input
        label="Quantidade (kg)"
        value={quantidade}
        onChangeText={(text) => {
          const cleaned = text.replace(/[^0-9.,]/g, '');
          setQuantidade(cleaned);
        }}
        placeholder="Quantidade em kg"
        keyboardType="decimal-pad"
      />

      {/* Apiário */}
      <Selector
        label="Apiário"
        options={apiariosDisponiveis}
        onSelect={setApiario}
        placeholder="Selecione o apiário"
        value={apiario}
      />

      {/* Observações */}
      <View style={styles.observacoesSection}>
        <Text style={styles.observacoesLabel}>Observações(opcional)</Text>
        <View style={styles.observacoesInputContainer}>
          <Input
            value={notas}
            onChangeText={setNotas}
            placeholder=""
            multiline={true}
            numberOfLines={6}
            style={styles.observacoesInput}
            textAlignVertical="top"
            label=""
          />
        </View>
      </View>

      {/* Botão Salvar */}
      <Botao
        title="Salvar Alterações"
        onPress={handleSalvar}
        cor="primaria"
        style={styles.button}
      />

      {/* Botão Apagar */}
      <Botao
        title="Apagar Lote"
        onPress={handleApagar}
        cor="secundaria"
        style={styles.buttonDelete}
      />

     
    </ScrollView>
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
    paddingBottom: 50,
  },
  inputDisabled: {
    backgroundColor: '#f5f5f5',
    color: '#999',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: layout.espacamento.amigavel,
  },
  inputStatus: {
    flex: 1,
  },
  checkboxContainer: {
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 120,
  },
  checkboxLabel: {
    fontSize: 14,
    color: cores.primaria,
  },
  observacoesSection: {
    marginTop: 8,
  },
  observacoesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.preto,
    marginBottom: 8,
    marginLeft: 4,
  },
  observacoesInputContainer: {
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  observacoesInput: {
    height: 140,
    textAlignVertical: 'top',
    textAlign: 'left',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: 20,
  },
  button: {
    marginTop: layout.espacamento.social,
  },
  buttonDelete: {
    marginTop: layout.espacamento.amigavel,
  },
  historicoContainer: {
    backgroundColor: cores.branco,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cores.borda,
    overflow: 'hidden',
    marginTop: layout.espacamento.amigavel,
  },
  historicoHeader: {
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
  historicoContent: {
    padding: layout.espacamento.amigavel,
  },
  semHistorico: {
    fontSize: 14,
    color: cores.texto,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});