import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import Input from '@/components/input';
import Botao from '@/components/botao';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { useRouter } from 'expo-router';

export default function CadastrarProducao() {
  const router = useRouter();
  
  // Estados para os campos (opcional, mas recomendado)
  const [quantidade, setQuantidade] = useState('2.0');
  const [conversao, setConversao] = useState('1,43 L');

  // Suposição dos nomes dos ícones (ajuste conforme seu AppIcons)
  const iconSeta = 'chevron-down';
  const iconCalendario = 'calendar';

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Campo Tipo Produto (Simulando Dropdown) */}
      <Input
        label="Tipo Produto"
        value="Mel"
        editable={false}
        iconRightName={iconSeta}
      />

      {/* Linha para Quantidade e Medida */}
      <View style={styles.row}>
        <Input
          label="Quantidade"
          value={quantidade}
          onChangeText={setQuantidade}
          keyboardType="numeric"
          style={styles.inputMetade} // Estilo para dividir a linha
        />
        <Input
          label="Medida"
          value="Kg"
          editable={false}
          iconRightName={iconSeta}
          style={styles.inputMetade} // Estilo para dividir a linha
        />
      </View>

      {/* Campo Conversão */}
      <Input
        label="Conversão para litro"
        value={conversao}
        editable={false}
        style={styles.conversaoInput} // Estilo customizado
      />

      {/* Campo Apiário (Simulando Dropdown) */}
      <Input
        label="Apiário"
        value="Rosa do Sertão"
        editable={false}
        iconRightName={iconSeta}
      />

      {/* Campo Colmeia (Simulando Dropdown) */}
      <Input
        label="Colmeia"
        value="Colmeia 1"
        editable={false}
        iconRightName={iconSeta}
      />

      {/* Campo Data Coleta (Simulando DatePicker) */}
      <Input
        label="Data Coleta"
        value="18/09/2025"
        editable={false}
        iconRightName={iconCalendario}
      />

      {/* Botão Cadastrar */}
      <Botao
        title="Cadastrar"
        onPress={() => { /* Lógica de cadastro */ }}
        cor="primaria"
        style={styles.button}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo, // Assumindo que cores.fundo é o seu branco/cinza claro
  },
  contentContainer: {
    padding: layout.espacamento.amigavel,
    // Adiciona espaço vertical entre cada Input
    gap: layout.espacamento.colega, 
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // Adiciona espaço entre os inputs da linha
    gap: layout.espacamento.amigavel, 
  },
  inputMetade: {
    flex: 1, // Faz com que os inputs dividam o espaço
  },
  conversaoInput: {
    backgroundColor: '#FFF8E1', // Um amarelo/bege claro
    borderColor: '#FFECB3',
  },
  button: {
    // Adiciona um espaço extra acima do botão
    marginTop: layout.espacamento.social,
  },
});