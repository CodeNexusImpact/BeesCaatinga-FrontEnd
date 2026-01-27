import Botao from '@/components/botao';
import Input from '@/components/input';
import Selector from '@/components/selector';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import Checkbox from 'expo-checkbox';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function CadastrarVistoria() {
  const router = useRouter();

  // --- Estados da Vistoria ---
  const [dataVistoria, setDataVistoria] = useState('18/09/2025');
  const [apiario, setApiario] = useState('');
  const [colmeia, setColmeia] = useState('');
  const [condicao, setCondicao] = useState('manutencao');
  const [observacoes, setObservacoes] = useState('');

  // Estados para os checkboxes
  const [pragas, setPragas] = useState({
    varroa: false,
    formiga: false,
    traca: false,
    lagartixa: false,
    outro: false,
  });

  const [perdas, setPerdas] = useState({
    alimentacao: false,
    veneno: false,
    clima: false,
    outro: false,
  });

  // --- Opções (mock data) ---
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
    { label: 'Em Risco', value: 'risco' },
    { label: 'Perdida', value: 'perdida' },
  ];

  // --- Funções Auxiliares ---
  const setPraga = (key: keyof typeof pragas, value: boolean) => {
    setPragas((prev) => ({ ...prev, [key]: value }));
  };

  const setPerda = (key: keyof typeof perdas, value: boolean) => {
    setPerdas((prev) => ({ ...prev, [key]: value }));
  };

  const handleSalvar = () => {
    console.log('Dados da Vistoria:');
    console.log({
      dataVistoria,
      apiario,
      colmeia,
      condicao,
      pragas,
      perdas,
      observacoes,
    });
    
    // Navega para a tela de listagem 
    router.push('/vistorias/listar');
  };

  // Componente auxiliar para renderizar cada item de checkbox
  const CheckboxItem = ({
    label,
    value,
    onValueChange,
  }: {
    label: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
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
      />

      {/* Colmeia */}
      <Selector
        label="Selecione a Colmeia*"
        options={colmeiaOptions}
        onSelect={setColmeia}
        placeholder="Selecione"
        iconName="beehiveOutline"
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
          <CheckboxItem
            label="Varroa"
            value={pragas.varroa}
            onValueChange={(v) => setPraga('varroa', v)}
          />
          <CheckboxItem
            label="Formiga"
            value={pragas.formiga}
            onValueChange={(v) => setPraga('formiga', v)}
          />
          <CheckboxItem
            label="Traça"
            value={pragas.traca}
            onValueChange={(v) => setPraga('traca', v)}
          />
          <CheckboxItem
            label="Lagartixa"
            value={pragas.lagartixa}
            onValueChange={(v) => setPraga('lagartixa', v)}
          />
          <CheckboxItem
            label="Outro"
            value={pragas.outro}
            onValueChange={(v) => setPraga('outro', v)}
          />
        </View>

        {/* Coluna Perda por */}
        <View style={styles.checkboxColumn}>
          <Text style={styles.checkboxTitle}>Perda por</Text>
          <CheckboxItem
            label="Alimentação"
            value={perdas.alimentacao}
            onValueChange={(v) => setPerda('alimentacao', v)}
          />
          <CheckboxItem
            label="Veneno"
            value={perdas.veneno}
            onValueChange={(v) => setPerda('veneno', v)}
          />
          <CheckboxItem
            label="Clima"
            value={perdas.clima}
            onValueChange={(v) => setPerda('clima', v)}
          />
          <CheckboxItem
            label="Outro"
            value={perdas.outro}
            onValueChange={(v) => setPerda('outro', v)}
          />
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
    paddingTop: layout.espacamento.amigavel,
    padding: layout.espacamento.amigavel,
  },
  // --- Estilos dos Checkboxes ---
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
});