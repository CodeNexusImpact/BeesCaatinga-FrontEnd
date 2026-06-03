import Botao from '@/components/botao';
import Input from '@/components/input';
import Selector from '@/components/selector';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import Icon from '@/components/icon';
import { useAuth } from '@/hooks/useAuth';

export default function Index() {
  const router = useRouter();
  const { user } = useAuth();

  // Estados baseados nos dados reais do usuário logado
  const [nome, setNome] = useState(user?.nomeCompleto || '');
  const [genero, setGenero] = useState(user?.genero || '');
  const [email, setEmail] = useState(user?.email || '');
  const [empresa, setEmpresa] = useState(user?.nomeDaEmpresa || '');
  const [telefone, setTelefone] = useState(user?.telefone || '');
  const [endereco, setEndereco] = useState(user?.endereco || '');

  // Opções para gênero alinhadas ao backend
  const generoOptions = [
    { label: 'Masculino', value: 'MASCULINO' },
    { label: 'Feminino', value: 'FEMININO' },
    { label: 'Outro', value: 'OUTRO' },
  ];

  const handleSalvar = () => {
    Alert.alert('Info', 'Funcionalidade de salvamento em manutenção.');
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
        <Text style={styles.title}>Meu Perfil</Text>
        {/* Foto do Perfil */}
        <TouchableOpacity style={styles.fotoContainer}>
          <View style={styles.fotoPlaceholder}>
            <Icon name="camera" size={40} color={cores.preto} />
            <Text style={styles.fotoTexto}>Foto do Perfil</Text>
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
        value={genero}
      />

      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="seu@email.com"
        keyboardType="email-address"
        editable={false} // Email geralmente é login, travado por segurança
      />

      <Input
        label="Empresa"
        value={empresa}
        onChangeText={setEmpresa}
        placeholder="(Opcional)"
      />

      <Input
        label="Celular"
        value={telefone}
        onChangeText={setTelefone}
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
    borderRadius: 40,
    backgroundColor: cores.branco,
    borderWidth: 2,
    borderColor: cores.preto,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
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
  botaoCancelar: {
    borderWidth: 1,
    borderColor: cores.preto,
  },
  textoCancelar: {
    color: cores.texto,
  },
});
