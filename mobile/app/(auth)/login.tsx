import Botao from "@/components/formulario/botao";
import Input from "@/components/formulario/input";
import TelaAuth from "@/components/auth/telaAuth";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Text, View, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import cores from "@/constants/cores";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { alerta } from '@/utils/alerta';


function Login() {
  // E-mail pré-preenchido ao voltar da recuperação de senha (/login?email=...).
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState(emailParam || (__DEV__ ? 'dev@produtor.com' : ''));
  const [senha, setSenha] = useState(__DEV__ ? 'dev123' : '');
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleLogin = async () => {
    if (!email || !senha) {
      alerta("Erro", "Por favor, preencha o e-mail e a senha.");
      return;
    }

    setLoading(true);
    try {
      await signIn(email, senha);
    } catch (error: any) {
      alerta(
        "Erro de Autenticação",
        error?.message || "E-mail ou senha inválidos. Verifique suas credenciais e sua conexão de rede."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <TelaAuth titulo="Entrar" subtitulo="Use o e-mail e a senha do seu cadastro.">
      <Input
        label="E-mail"
        iconName="email"
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <Input label="Senha" iconName="lock" placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry autoComplete="current-password" onSubmitEditing={handleLogin} />
      <TouchableOpacity onPress={() => router.push("/(auth)/redefinirSenha")} style={styles.esqueceuSenha} accessibilityRole="link">
        <Text style={styles.esqueceuSenhaTexto}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      {loading ? (
        <View>
          <ActivityIndicator size="large" color={cores.primaria} style={{ marginVertical: 12 }} />
          <Text style={styles.textoSimples}>Conectando ao servidor... na primeira vez pode levar até 1 minuto.</Text>
        </View>
      ) : (
        <Botao title="Entrar" onPress={handleLogin} iconName="forward" />
      )}

      <Text style={styles.textoSimples}>Ainda não tem conta?</Text>
      <Botao title="Cadastrar" cor="branca" onPress={() => router.push('/(auth)/cadastro')} />
    </TelaAuth>
  );
}

const styles = StyleSheet.create({
  esqueceuSenha: { alignSelf: 'flex-end', minHeight: 44, justifyContent: 'center' },
  esqueceuSenhaTexto: { color: cores.secundaria, fontWeight: 'bold', fontSize: 16, textDecorationLine: 'underline' },
  textoSimples: { color: cores.textoSecundario, fontSize: 16, textAlign: 'center' },
});

export default Login;
