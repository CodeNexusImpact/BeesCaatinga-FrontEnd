import Botao from '@/components/botao';
import Input from '@/components/input';
import Selector from '@/components/selector';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import Checkbox from 'expo-checkbox';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function CadastrarInsumo() {
  const router = useRouter();

  // --- Estados do Insumo ---
  const [dataInsumo, setDataInsumo] = useState('18/09/2025');
  const [nomeInsumo, setNomeInsumo] = useState('');
  const [tipoInsumo, setTipoInsumo] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [unidadeMedida, setUnidadeMedida] = useState('');
  const [dataValidade, setDataValidade] = useState('18/09/2025');
  const [semValidade, setSemValidade] = useState(false); // Estado para o checkbox
  const [observacoes, setObservacoes] = useState('');

  // --- Opções (Mock Data) ---
  const nomeInsumoOptions = [
    { label: 'Cera de Abelha', value: 'cera' },
    { label: 'Xarope de Açúcar', value: 'xarope' },
    { label: 'Alimentador Boardman', value: 'alimentador_boardman' },
    { label: 'Medicamento (Oxitetraciclina)', value: 'medicamento_oxi' },
  ];

  const tipoInsumoOptions = [
    { label: 'Alimentação', value: 'alimentacao' },
    { label: 'Medicamento', value: 'medicamento' },
    { label: 'Equipamento', value: 'equipamento' },
    { label: 'Outro', value: 'outro' },
  ];

  const unidadeMedidaOptions = [
    { label: 'Kg', value: 'kg' },
    { label: 'g', value: 'g' },
    { label: 'L', value: 'l' },
    { label: 'mL', value: 'ml' },
    { label: 'Unidade(s)', value: 'un' },
  ];

  // Componente auxiliar para o Checkbox
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
      <Stack.Screen options={{ title: 'Cadastrar Apiário' }} />
      {/* Data de Entrada */}
      <Input
        label="Data de Entrada:"
        value={dataInsumo}
        onChangeText={setDataInsumo}
        placeholder="dd/mm/aaaa"
        iconName="calendar"
      />
      {/* Quantidade + Unidade de Medida (baseado no seu código de produção) */}
      <View style={styles.row}>
        <Input
          label="Quantidade*"
          value={quantidade}
          onChangeText={(text) => {
            const cleaned = text.replace(/[^0-9.,]/g, '');
            setQuantidade(cleaned);
          }}
          keyboardType="decimal-pad"
          style={styles.inputMetade}
          placeholder="0,0"
        />
        <Selector
          label="Unidade medida"
          options={unidadeMedidaOptions}
          onSelect={setUnidadeMedida}
          placeholder="Selecione o tipo de medida"
          style={styles.inputMetade}
        />
      </View>
      {/* Nome do insumo */}
      <Selector
        label="Nome do insumo*"
        options={nomeInsumoOptions}
        onSelect={setNomeInsumo}
        placeholder="Selecione nome do insumo"
        iconName="sprayBottle" // Ícone de exemplo (spray-bottle)
      />

      {/* Tipo de insumo */}
      <Selector
        label="Tipo de insumo*"
        options={tipoInsumoOptions}
        onSelect={setTipoInsumo}
        placeholder="Selecione tipo de insumo"
        iconName="beehiveOutline" // Ícone de exemplo
      />



      {/* Data de validade */}
      <Input
        label="Data de validade:"
        value={semValidade ? 'Não se aplica' : dataValidade}
        onChangeText={setDataValidade}
        placeholder="dd/mm/aaaa"
        iconName="calendar"
        editable={!semValidade} // Desabilita se o checkbox estiver marcado
        style={semValidade ? styles.inputDisabled : {}}
      />
      {/* Checkbox para "Não se aplica" */}
      <CheckboxItem
        label="Não se aplica / Sem validade"
        value={semValidade}
        onValueChange={setSemValidade}
      />

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
        onPress={() => {
          console.log({
            dataInsumo,
            nomeInsumo,
            tipoInsumo,
            quantidade,
            unidadeMedida,
            dataValidade: semValidade ? 'N/A' : dataValidade,
            observacoes,
          });
          // Redireciona para a listagem de insumos
          router.push('/insumos/cadastrar');
        }}
        cor="primaria"
        style={styles.button}
      />
    </ScrollView>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  contentContainer: {
    padding: layout.espacamento.amigavel,
    gap: layout.espacamento.colega,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: layout.espacamento.amigavel,
    zIndex: 10,
    position: 'relative',
  },
  inputMetade: {
    flex: 1,
  },
  button: {
    marginTop: layout.espacamento.social,
  },
  // Estilo para o Input de observações
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
    padding: layout.espacamento.amigavel,
  },
  // Estilo para o Input desabilitado
  inputDisabled: {
    backgroundColor: cores.cores.base[10], // Um cinza claro
    borderColor: cores.cores.base[20],
  },
  // Estilos para o Checkbox
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.espacamento.amigavel,
    marginTop: -layout.espacamento.texto, // Puxa para perto do Input acima
    paddingLeft: layout.espacamento.texto,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: layout.borderRadius.r25,
  },
  checkboxLabel: {
    fontSize: 15,
    color: cores.texto,
  },
});