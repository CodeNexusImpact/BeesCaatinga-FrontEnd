import Botao from '@/components/botao';
import Input from '@/components/input';
import Selector from '@/components/selector';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { maskDate } from '@/utils/masks';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export default function CadastrarLoteMel() {
  const router = useRouter();

  // Estados
  const [dataProducao, setDataProducao] = useState('');
  const [quantidadeProduzida, setQuantidadeProduzida] = useState('');
  const [apiario, setApiario] = useState('');
  const [nomeFlorada, setNomeFlorada] = useState('');
  const [localidadeProducao, setLocalidadeProducao] = useState('');
  const [tipoAbelhas, setTipoAbelhas] = useState('');

  const handleSubmit = () => {
    // Redireciona para a listagem após cadastro
    router.push('/producao/listar');
  };

  const handleDateChange = (text: string) => {
    setDataProducao(maskDate(text));
  };

  // Opções
  const apiarioOptions = [
    { label: 'Apiário Norte', value: 'norte' },
    { label: 'Apiário Sul', value: 'sul' },
    { label: 'Apiário Leste', value: 'leste' },
    { label: 'Apiário Oeste', value: 'oeste' },
  ];

  const tipoAbelhasOptions = [
    { label: 'Apis mellifera', value: 'apis_mellifera' },
    { label: 'Abelhas Jataí', value: 'jatai' },
    { label: 'Abelhas Mandaçaia', value: 'mandacaia' },
    { label: 'Abelhas Uruçu', value: 'urucu' },
  ];

  const floradaOptions = [
    { label: 'Eucalipto', value: 'eucalipto' },
    { label: 'Laranjeira', value: 'laranjeira' },
    { label: 'Assa-peixe', value: 'assa_peixe' },
    { label: 'Silvestre', value: 'silvestre' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Stack.Screen options={{ title: 'Cadastrar' }} />
      <Subtexto style={styles.subtitulo}>Preencha os dados do lote de mel para gerar um ID.</Subtexto>

      {/* Data de Produção/Extração */}
      <Input
        label="Data de Produção/Extração"
        value={dataProducao}
        onChangeText={handleDateChange}
        placeholder="dd/mm/aaaa"
        iconName="calendar"
        maxLength={10}
      />

      {/* Quantidade Produzida */}
      <Input
        label="Quantidade Produzida (kg)"
        value={quantidadeProduzida}
        onChangeText={(text) => {
          const cleaned = text.replace(/[^0-9.,]/g, '');
          setQuantidadeProduzida(cleaned);
        }}
        keyboardType="decimal-pad"
        placeholder="0,0"
      />

      {/* Apiário */}
      <Selector
        label="Selecione o apiário"
        options={apiarioOptions}
        onSelect={setApiario}
        placeholder="Selecione o apiário"
        iconName="beehiveOutline"
      />

      {/* Nome da Florada */}
      <Selector
        label="Nome da florada"
        options={floradaOptions}
        onSelect={setNomeFlorada}
        placeholder="Selecione a florada"
        iconName="flower"
      />

      {/* Localidade da Produção */}
      <Input
        label="Localidade da produção"
        value={localidadeProducao}
        onChangeText={setLocalidadeProducao}
        placeholder="Digite a localidade"
        iconName="map"
      />

      {/* Tipo de Abelhas */}
      <Selector
        label="Tipo de Abelhas"
        options={tipoAbelhasOptions}
        onSelect={setTipoAbelhas}
        placeholder="Selecione o tipo de abelhas"
        iconName="bee"
      />

      {/* Botão Cadastrar */}
      <Botao
        title="Cadastrar"
        onPress={handleSubmit}
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
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.texto,
    textAlign: 'center',
    marginBottom: layout.espacamento.texto,
  },
  subtitulo: {
    fontSize: 16,
    color: cores.texto,
    textAlign: 'center',
    marginBottom: layout.espacamento.amigavel,
    lineHeight: 20,
  },
  button: {
    marginTop: layout.espacamento.social,
  },
});