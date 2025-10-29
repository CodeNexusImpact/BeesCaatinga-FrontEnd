import Botao from '@/components/botao';
import Input from '@/components/input';
import Selector from '@/components/selector';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Subtexto from '@/components/subTexto';

export default function CadastrarProducao() {
  const router = useRouter();

  const [tipoProduto, setTipoProduto] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [medida, setMedida] = useState('');
  const [apiario, setApiario] = useState('');
  const [colmeia, setColmeia] = useState('');
  const [dataColeta, setDataColeta] = useState('');

  // Opções fixas (substitua por dados dinâmicos depois, se necessário)
  const tipoProdutoOptions = [
    { label: 'Mel de Jandaíra', value: 'jandaira' },
    { label: 'Mel de Marmeleiro', value: 'marmeleiro' },
    { label: 'Mel de Pajeú', value: 'pajeu' },
    { label: 'Mel de Umbu', value: 'umbu' },
  ];

  const medidaOptions = [
    { label: 'Kg', value: 'kg' },
    { label: 'g', value: 'g' },
    { label: 'L', value: 'l' },
    { label: 'mL', value: 'ml' },
  ];

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

  // Conversão fixa só para exibição (pode ser calculada depois)
  const conversao = '1,43 L';

  return (
    
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Subtexto style={styles.subtexto}>Cadastre um novo produto.</Subtexto>


      {/* Conversão (somente leitura) */}
      <Input
        label="Conversão para litro"
        value={conversao}
        editable={false}
        style={styles.conversaoInput}
      />
      
      {/* Quantidade + Medida */}
      <View style={styles.row}>
        <Input
          label="Adicione a Quantidade"
          value={quantidade}
          onChangeText={(text) => {
            const cleaned = text.replace(/[^0-9.,]/g, '');
            setQuantidade(cleaned);
          }}
          keyboardType="decimal-pad"
          style={styles.inputMetade}
        />
        <Selector
          label="Medida"
          options={medidaOptions}
          onSelect={setMedida}
          placeholder="Selecione o tipo de Medida"
          style={styles.inputMetade}
        />
      </View>

      {/* Tipo de Mel */}
      <Selector
        label="Tipo de Mel"
        options={tipoProdutoOptions}
        onSelect={setTipoProduto}
        placeholder="Selecione o tipo de Mel"
        iconName="honeycomb"
      />

      {/* Apiário */}
      <Selector
        label="Apiário"
        options={apiarioOptions}
        onSelect={setApiario}
        placeholder="Selecione o Apiário"
        iconName="home"
      />

      {/* Colmeia */}
      <Selector
        label="Colmeia"
        options={colmeiaOptions}
        onSelect={setColmeia}
        placeholder="Selecione a Colmeia"
        iconName="beehiveOutline"
      />

      {/* Data Coleta — editável com ícone de calendário */}
      <Input
        label="Data de Coleta"
        value={dataColeta}
        onChangeText={setDataColeta}
        placeholder="dd/mm/aaaa"
        iconName="calendar" 
      />

      {/* Botão */}
      <Botao
        title="Cadastrar"
        onPress={() => {
          console.log({
            tipoProduto,
            quantidade,
            medida,
            apiario,
            colmeia,
            dataColeta,
          });
          router.push('/visualizarListarProducao');
        }}
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
  subtexto: {
      width: '100%',
      paddingTop: layout.espacamento.amigavel, 
      marginBottom: layout.espacamento.amigavel, 
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
  conversaoInput: {
    backgroundColor: '#FFF8E1',
    borderColor: '#FFECB3',
  },
  button: {
    marginTop: layout.espacamento.social,
  },
});