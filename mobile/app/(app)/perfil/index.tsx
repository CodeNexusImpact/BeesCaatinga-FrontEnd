import Botao from '@/components/botao';
import Input from '@/components/input';
import Selector from '@/components/selector';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from '@/components/icon';

export default function Index() {
  const router = useRouter();

  // Estados
  const [nome, setNome] = useState('xxxxx xxxxxx');
  const [genero, setGenero] = useState('');
  const [email, setEmail] = useState('exemplo@email.com');
  const [empresa, setEmpresa] = useState('');
  const [celular, setCelular] = useState('(xx) x xxxx-xxxx');
  const [endereco, setEndereco] = useState('Rua xxxx, xxxx, xx, xxxxxx');

  // Opções para gênero
  const generoOptions = [
    { label: 'Masculino', value: 'masculino' },
    { label: 'Feminino', value: 'feminino' },
    { label: 'Outro', value: 'outro' },
    { label: 'Prefiro não informar', value: 'nao_informar' },
  ];

  const handleSalvar = () => {
    console.log({
      nome,
      genero,
      email,
      empresa,
      celular,
      endereco,
    });
    // Lógica para salvar as alterações do perfil
    router.back();
  };

  const handleCancelar = () => {
    router.back();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Atualize seu perfil</Text>
        
        {/* Foto do Perfil */}
        <TouchableOpacity style={styles.fotoContainer}>
          <View style={styles.fotoPlaceholder}>
            <Icon name="camera" size={40} color={cores.preto} />
            <Text style={styles.fotoTexto}>Foto: Perfil</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Campos do formulário */}
      <Input
        label="Nome"
        value={nome}
        onChangeText={setNome}
        placeholder="Digite seu nome completo"
  
      />

      <Selector
        label="Gênero"
        options={generoOptions}
        onSelect={setGenero}
        placeholder="Selecione seu gênero"

      />

      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="seu@email.com"
        keyboardType="email-address"
     
      />

      <Input
        label="Empresa"
        value={empresa}
        onChangeText={setEmpresa}
        placeholder="(Opcional)"
    
      />

      <Input
        label="Celular"
        value={celular}
        onChangeText={setCelular}
        placeholder="(00) 0 0000-0000"
        keyboardType="phone-pad"
  
      />

      <Input
        label="Endereço"
        value={endereco}
        onChangeText={setEndereco}
        placeholder="Rua, número, bairro, cidade"
    
      />

      {/* Botões */}
      <View style={styles.botoesContainer}>
        <Botao
          title="Salvar Alterações"
          onPress={handleSalvar}
          cor="primaria"
          tamanho="grande"
          style={styles.botaoSalvar}
        />
        
        <Botao
          title="Cancelar"
          onPress={handleCancelar}
          cor="branca"
          tamanho="grande"
          style={styles.botaoCancelar}
          textStyle={styles.textoCancelar}
        />
      </View>
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
  header: {
    alignItems: 'center',
    marginBottom: layout.espacamento.colega,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: layout.espacamento.amigavel,
    textAlign: 'center',
  },
  fotoContainer: {
    alignItems: 'center',
    marginBottom: layout.espacamento.colega,
  },
  fotoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 60,
    backgroundColor: cores.branco,
    borderWidth: 2,
    borderColor: cores.preto,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: layout.espacamento.amigavel,
  },
  fotoTexto: {
    fontSize: 10,
    color: cores.preto,
    textAlign: 'center',
    marginTop: 2,
  },
 
  botoesContainer: {
    gap: layout.espacamento.texto,
    marginTop: layout.espacamento.social,
  },
  botaoSalvar: {
  },
  botaoCancelar: {
    borderWidth: 1,
    borderColor: cores.preto,
  },
  textoCancelar: {
    color: cores.texto,
  },
});