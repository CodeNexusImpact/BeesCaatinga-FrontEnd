import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Botao from '@/components/formulario/botao';
import Input from '@/components/formulario/input';
import Icon from '@/components/icon';
import TelaAuth from '@/components/auth/telaAuth';
import cores from '@/constants/cores';
import { recuperacaoDisponivel, redefinirSenha, solicitarCodigo } from '@/services/recuperacaoService';
import { alerta } from '@/utils/alerta';
import { mensagemDeErro } from '@/utils/erros';
import { validatePassword } from '@/utils/masks';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REGRA_SENHA = 'A senha precisa ter 8 ou mais caracteres, com letra maiúscula, minúscula, número e símbolo (ex.: Mel@2026).';

/**
 * Recuperar senha em 2 passos: 1) e-mail → código de 6 dígitos; 2) código + nova senha.
 * Sem serviço de e-mail no servidor, mostra aviso para falar com o suporte.
 */
export default function RedefinirSenha() {
  const router = useRouter();
  const [disponivel, setDisponivel] = useState<boolean | null>(null);
  const [passo, setPasso] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [erros, setErros] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    recuperacaoDisponivel().then(setDisponivel);
  }, []);

  const pedirCodigo = async () => {
    if (!EMAIL.test(email.trim())) return setErros({ email: 'Informe um e-mail válido, ex.: maria@email.com' });
    setErros({});
    setEnviando(true);
    try {
      setAviso(await solicitarCodigo(email));
      setPasso(2);
    } catch (e: any) {
      if (e?.response?.status === 503) setDisponivel(false);
      else alerta('Erro', mensagemDeErro(e, 'Não foi possível enviar o código. Tente novamente.'));
    } finally {
      setEnviando(false);
    }
  };

  const trocarSenha = async () => {
    const novos: Record<string, string> = {};
    if (!/^\d{6}$/.test(codigo.trim())) novos.codigo = 'O código tem 6 números. Confira o e-mail recebido.';
    if (!validatePassword(senha)) novos.senha = REGRA_SENHA;
    if (senha !== confirmar) novos.confirmar = 'As senhas não são iguais.';
    setErros(novos);
    if (Object.keys(novos).length) return;
    setEnviando(true);
    try {
      await redefinirSenha(email, codigo, senha);
      alerta('Senha alterada', 'Pronto! Entre com a sua nova senha.');
      router.replace({ pathname: '/login', params: { email: email.trim().toLowerCase() } });
    } catch (e: any) {
      if (e?.response?.status === 400) setErros({ codigo: mensagemDeErro(e, 'Código inválido ou vencido. Peça um novo código.') });
      else alerta('Erro', mensagemDeErro(e, 'Não foi possível trocar a senha.'));
    } finally {
      setEnviando(false);
    }
  };

  if (disponivel === null) {
    return (
      <TelaAuth titulo="Recuperar senha">
        <ActivityIndicator size="large" color={cores.primaria} />
      </TelaAuth>
    );
  }

  if (!disponivel) {
    return (
      <TelaAuth titulo="Recuperar senha">
        <View style={styles.aviso} testID="recuperacao-indisponivel">
          <Icon name="info" size={32} color={cores.secundaria} />
          <Text style={styles.texto}>Recuperação por e-mail ainda não está disponível. Fale com o suporte da Code Nexus Impact.</Text>
        </View>
        <Botao title="Voltar para entrar" iconName="back" onPress={() => router.replace('/login')} cor="primaria" />
      </TelaAuth>
    );
  }

  return (
    <TelaAuth titulo="Recuperar senha" subtitulo={passo === 1 ? 'Passo 1 de 2: informe seu e-mail' : 'Passo 2 de 2: código e nova senha'}>
      {passo === 1 ? (
        <>
          <Input label="E-mail do cadastro" iconName="email" placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" erro={erros.email} dica="Enviaremos um código de 6 números." />
          <Botao title={enviando ? 'Enviando...' : 'Enviar código'} onPress={enviando ? () => {} : pedirCodigo} cor="primaria" />
        </>
      ) : (
        <>
          {!!aviso && <Text style={styles.ok}>{aviso}</Text>}
          <Input label="Código recebido" iconName="lock" placeholder="000000" value={codigo} onChangeText={(t) => setCodigo(t.replace(/\D/g, '').slice(0, 6))} keyboardType="number-pad" maxLength={6} erro={erros.codigo} dica={`Enviado para ${email}`} />
          <Input label="Nova senha" iconName="lock" placeholder="Nova senha" value={senha} onChangeText={setSenha} secureTextEntry erro={erros.senha} dica="8 ou mais caracteres, com maiúscula, minúscula, número e símbolo." />
          <Input label="Confirme a nova senha" iconName="lock" placeholder="Confirme a nova senha" value={confirmar} onChangeText={setConfirmar} secureTextEntry erro={erros.confirmar} />
          <Botao title={enviando ? 'Salvando...' : 'Trocar senha'} onPress={enviando ? () => {} : trocarSenha} cor="primaria" />
          <TouchableOpacity onPress={() => setPasso(1)} style={styles.link} accessibilityRole="link">
            <Text style={styles.linkTexto}>Não recebeu? Pedir outro código</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity onPress={() => router.replace('/login')} style={styles.link} accessibilityRole="link">
        <Text style={styles.linkTexto}>Voltar para entrar</Text>
      </TouchableOpacity>
    </TelaAuth>
  );
}

const styles = StyleSheet.create({
  aviso: { flexDirection: 'row', gap: 12, backgroundColor: cores.destaque, borderRadius: 12, padding: 14, alignItems: 'flex-start' },
  texto: { flex: 1, fontSize: 16, color: cores.texto, lineHeight: 23 },
  ok: { fontSize: 15, color: cores.sucesso, fontWeight: '600' },
  link: { alignSelf: 'center', minHeight: 44, justifyContent: 'center' },
  linkTexto: { color: cores.secundaria, fontWeight: 'bold', fontSize: 16, textDecorationLine: 'underline' },
});
