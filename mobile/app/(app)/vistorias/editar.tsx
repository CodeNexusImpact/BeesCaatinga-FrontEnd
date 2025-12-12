import Botao from '@/components/botao';
import Input from '@/components/input';
import Selector from '@/components/selector';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import Checkbox from 'expo-checkbox';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, 
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// --- MOCK DATA (Simula os dados que viriam da API) ---
// Em um app real, você buscaria isso de um banco de dados
const mockApiData: { [key: string]: any } = {
  '1': {
    dataVistoria: '18/09/2025',
    apiario: 'rosa',
    colmeia: '1',
    condicao: 'saudavel',
    pragas: { varroa: false, formiga: false, traca: false, lagartixa: false, outro: false },
    perdas: { alimentacao: true, veneno: false, clima: false, outro: false },
    observacoes: 'Apesar das perdas por alimentação, a colmeia está saudável.',
  },
  '2': {
    dataVistoria: '10/09/2025',
    apiario: 'rosa',
    colmeia: '2',
    condicao: 'manutencao',
    pragas: { varroa: false, formiga: true, traca: false, lagartixa: false, outro: false },
    perdas: { alimentacao: false, veneno: false, clima: false, outro: false },
    observacoes: '',
  },
  '3': {
    dataVistoria: '03/09/2025',
    apiario: 'serra',
    colmeia: '3',
    condicao: 'colheita', // Vamos supor que o valor seja 'colheita'
    pragas: { varroa: false, formiga: false, traca: false, lagartixa: false, outro: false },
    perdas: { alimentacao: false, veneno: false, clima: false, outro: false },
    observacoes: 'Pronta para colher.',
  },
};

export default function EditarVistoria() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Pega o 'id' da URL 

  // Estado de carregamento
  const [isLoading, setIsLoading] = useState(true);

  // --- Estados do Formulário (começam vazios) ---
  const [dataVistoria, setDataVistoria] = useState('');
  const [apiario, setApiario] = useState('');
  const [colmeia, setColmeia] = useState('');
  const [condicao, setCondicao] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [pragas, setPragas] = useState({
    varroa: false, formiga: false, traca: false, lagartixa: false, outro: false,
  });
  const [perdas, setPerdas] = useState({
    alimentacao: false, veneno: false, clima: false, outro: false,
  });

  // --- Opções
  const apiarioOptions = [
    { label: 'Rosa do Sertão', value: 'rosa' },
    { label: 'Vale das Abelhas', value: 'vale' },
    { label: 'Serra do Mel', value: 'serra' },
  ];
  const colmeiaOptions = [
    { label: 'Colmeia 1', value: '1' },
    { label: 'Colmeia 2', value: '2' },
    { label: 'Colmeia 3', value: '3' },
  ];
  const condicaoOptions = [
    { label: 'Manutenção Necessária', value: 'manutencao' },
    { label: 'Saudável', value: 'saudavel' },
    { label: 'Agendar Colheita', value: 'colheita' }, 
    { label: 'Em Risco', value: 'risco' },
    { label: 'Perdida', value: 'perdida' },
  ];

  // Roda quando o componente é montado ou o 'id' muda
  useEffect(() => {
    if (id) {
      console.log('Carregando dados para Vistoria ID:', id);
      setIsLoading(true);
      // --- Simulação de busca na API ---
      // TODO: Substituir isso por uma busca real no seu banco de dados
      setTimeout(() => {
        const vistoriaId = Array.isArray(id) ? id[0] : id; // Garante que id é string
        const dados = mockApiData[vistoriaId];
        
        if (dados) {
          setDataVistoria(dados.dataVistoria);
          setApiario(dados.apiario);
          setColmeia(dados.colmeia);
          setCondicao(dados.condicao);
          setPragas(dados.pragas);
          setPerdas(dados.perdas);
          setObservacoes(dados.observacoes);
        } else {
          console.error('Vistoria não encontrada!');
          // Talvez redirecionar de volta
          router.back();
        }
        setIsLoading(false);
      }, 500); // Meio segundo de delay para simular a rede
    }
  }, [id]);

  // --- Funções Auxiliares
  const setPraga = (key: keyof typeof pragas, value: boolean) => {
    setPragas((prev) => ({ ...prev, [key]: value }));
  };
  const setPerda = (key: keyof typeof perdas, value: boolean) => {
    setPerdas((prev) => ({ ...prev, [key]: value }));
  };

  // --- Ação de Salvar
  const handleSalvar = () => {
    console.log(`--- ATUALIZANDO Vistoria ID: ${id} ---`);
    console.log({
      dataVistoria,
      apiario,
      colmeia,
      condicao,
      pragas,
      perdas,
      observacoes,
    });
    // TODO: Enviar dados atualizados para a API
    
    // Navega de volta para a lista
    if (router.canGoBack()) {
      router.back();
    }
  };

  // Componente auxiliar
  const CheckboxItem = ({ label, value, onValueChange }: {
    label: string; value: boolean; onValueChange: (value: boolean) => void;
  }) => (
    <View style={styles.checkboxContainer}>
      <Checkbox
        style={styles.checkbox}
        value={value}
        onValueChange={onValueChange}
        color={value ? cores.primaria : undefined}
      />
      <Text style={styles.checkboxLabel}>{label}</Text>
    </View>
  );

  // --- Renderização do Carregamento ---
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={cores.primaria} />
        <Text style={styles.loadingText}>Carregando vistoria...</Text>
      </View>
    );
  }

  // --- Renderização do Formulário 
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Stack.Screen options={{ title: 'Editar' }} />
      {/* Data da Vistoria */}
      <Input
        label="Data da Vistoria:"
        value={dataVistoria}
        onChangeText={setDataVistoria}
        placeholder="dd/mm/aaaa"
        iconName="calendar"
      />

      {/* Apiário */}
      <Selector
        label="Selecione o Apiário*"
        options={apiarioOptions}
        onSelect={setApiario}
        placeholder="Selecione"
        iconName="home"
        value={apiario}
      />

      {/* Colmeia */}
      <Selector
        label="Selecione a Colmeia*"
        options={colmeiaOptions}
        onSelect={setColmeia}
        placeholder="Selecione"
        iconName="beehiveOutline"
        value={colmeia} 
      />

      {/* Condição */}
      <Selector
        label="Condição:"
        options={condicaoOptions}
        onSelect={setCondicao}
        placeholder="Selecione a condição da colmeia"
        value={condicao} 
      />

      {/* Seção de Checkboxes */}
      <View style={styles.checkboxSection}>
        {/* Coluna Pragas */}
        <View style={styles.checkboxColumn}>
          <Text style={styles.checkboxTitle}>Pragas</Text>
          <CheckboxItem label="Varroa" value={pragas.varroa} onValueChange={(v) => setPraga('varroa', v)} />
          <CheckboxItem label="Formiga" value={pragas.formiga} onValueChange={(v) => setPraga('formiga', v)} />
          <CheckboxItem label="Traça" value={pragas.traca} onValueChange={(v) => setPraga('traca', v)} />
          <CheckboxItem label="Lagartixa" value={pragas.lagartixa} onValueChange={(v) => setPraga('lagartixa', v)} />
          <CheckboxItem label="Outro" value={pragas.outro} onValueChange={(v) => setPraga('outro', v)} />
        </View>

        {/* Coluna Perda por */}
        <View style={styles.checkboxColumn}>
          <Text style={styles.checkboxTitle}>Perda por</Text>
          <CheckboxItem label="Alimentação" value={perdas.alimentacao} onValueChange={(v) => setPerda('alimentacao', v)} />
          <CheckboxItem label="Veneno" value={perdas.veneno} onValueChange={(v) => setPerda('veneno', v)} />
          <CheckboxItem label="Clima" value={perdas.clima} onValueChange={(v) => setPerda('clima', v)} />
          <CheckboxItem label="Outro" value={perdas.outro} onValueChange={(v) => setPerda('outro', v)} />
        </View>
      </View>

      {/* Observações */}
      <Input
        value={observacoes}
        onChangeText={setObservacoes}
        placeholder="Observações (opcional):"
        multiline={true}
        numberOfLines={5}
        style={styles.textArea}
      />

      {/* Botão */}
      <Botao
        title="Salvar"
        onPress={handleSalvar}
        cor="primaria"
        style={styles.button}
      />
    </ScrollView>
  );
}

// --- ESTILOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  contentContainer: {
    padding: layout.espacamento.amigavel,
    gap: layout.espacamento.colega,
  },
  button: {
    marginTop: layout.espacamento.social,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
    padding: layout.espacamento.amigavel,
  },
  checkboxSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: layout.espacamento.amigavel,
    marginTop: layout.espacamento.texto,
    backgroundColor: cores.branco,
    padding: layout.espacamento.colega,
    borderRadius: layout.borderRadius.r25,
    borderWidth: 1,
    borderColor: cores.cores.base[20],
  },
  checkboxColumn: {
    flex: 1,
    gap: layout.espacamento.colega,
  },
  checkboxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.preto,
    marginBottom: layout.espacamento.amigavel,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.espacamento.amigavel,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: layout.borderRadius.r25,
  },
  checkboxLabel: {
    fontSize: 15,
    color: cores.preto,
  },
  // --- Estilos para o Loading ---
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: cores.fundo,
    gap: layout.espacamento.colega,
  },
  loadingText: {
    fontSize: 16,
    color: cores.placeholder,
  },
});