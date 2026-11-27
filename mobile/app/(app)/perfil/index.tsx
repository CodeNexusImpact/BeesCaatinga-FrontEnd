import Botao from '@/components/formulario/botao';
import Input from '@/components/formulario/input';
import Selector from '@/components/formulario/selector';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import ImagemPicker from '@/components/formulario/imagemPicker';
import { useAuth } from '@/hooks/useAuth';
import { atualizarProdutor } from '@/services/produtorService';
import { maskPhone } from '@/utils/masks';
import { voltar } from '@/utils/navegacao';
import { alerta } from '@/utils/alerta';

export default function Index() {
  const router = useRouter();
  const { user, atualizarUsuario } = useAuth();
  const [salvando, setSalvando] = useState(false);

  // Estados baseados nos dados reais do usuário logado
  const [nome, setNome] = useState(user?.nomeCompleto || '');
  const [genero, setGenero] = useState(user?.genero || '');
  const [email, setEmail] = useState(user?.email || '');
  const [empresa, setEmpresa] = useState(user?.nomeDaEmpresa || '');
  const [telefone, setTelefone] = useState(maskPhone(user?.telefone || ''));
  const [endereco, setEndereco] = useState(user?.endereco || '');
  const [foto, setFoto] = useState<string | null>(null);

  // Opções para gênero alinhadas ao backend
  const generoOptions = [
    { label: 'Masculino', value: 'MASCULINO' },
    { label: 'Feminino', value: 'FEMININO' },
    { label: 'Outro', value: 'OUTRO' },
  ];

  const handleSalvar = async () => {
    if (!user?.id || salvando) return;
    if (!nome.trim()) {
      alerta('Erro', 'O nome é obrigatório.');
      return;
    }
    const digitos = telefone.replace(/\D/g, '');
    if (digitos && digitos.length < 10) {
      alerta('Erro', 'Telefone inválido.');
      return;
    }
    setSalvando(true);
    try {
      const atualizado = await atualizarProdutor(user.id, {
        nomeCompleto: nome.trim(),
        genero: genero || undefined,
        nomeDaEmpresa: empresa.trim(),
        telefone: digitos || undefined,
        endereco: endereco.trim(),
        ...(foto ? { caminhoDaFoto: foto } : {}),
      });
      await atualizarUsuario({ ...user, ...atualizado });
      alerta('Sucesso', 'Perfil atualizado com sucesso!');
      voltar(router);
    } catch (error: any) {
      alerta('Erro', error?.response?.data?.message || 'Não foi possível salvar o perfil.');
    } finally {
      setSalvando(false);
    }
  };

  const handleCancelar = () => {
    voltar(router);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Stack.Screen options={{ title: 'Meu Perfil' }} />
      {/* Header */}
      <View style={styles.header}>
        {/* Foto do perfil: POST /upload e caminhoDaFoto no produtor */}
        <ImagemPicker shape="circle" width={140} valorInicial={(user as any)?.fotoUrl ?? user?.caminhoDaFoto ?? null} onImagePicked={(url) => setFoto(url)} />
        <Text style={styles.fotoTexto}>Toque para trocar a foto</Text>
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
        onChangeText={(t) => setTelefone(maskPhone(t))}
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
          title={salvando ? 'Salvando...' : 'Salvar Alterações'}
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
