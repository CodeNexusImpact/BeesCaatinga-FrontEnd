import Botao from "@/components/botao";
import Input from "@/components/input";
import { Image } from "expo-image";
import { Link, useNavigation } from "expo-router";
import { Text, View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import cores from "@/constants/cores";
import { styles as formStyle } from "@/styles/forms.styles";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";


function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      // O signIn agora faz a chamada real ao backend /login
      await signIn(email, senha);
      // O redirecionamento automático é feito pelo RootLayout (_layout.tsx)
    } catch (error: any) {
      const message = error.response?.data?.message || "E-mail ou senha inválidos. Tente novamente.";
      Alert.alert("Erro de Login", message);
      console.error("Login falhou:", error);
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    router.push('/(auth)/cadastro');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ display: "flex", height: "100%" }}>
        <View style={styles.conteinerLogo}>
          <Image
            style={styles.image}
            source={require("@/assets/images/LogoBeesCaatinga.png")}
            contentFit='contain'

          />
        </View>
        <View
          style={formStyle.formStyle}
        >
          <Text style={styles.textoTitulo} >Faça seu Login</Text>
          <Input
            iconName="email"
            placeholder="Digite seu email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            iconName="lock"
            placeholder="Digite sua senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={true}
          />
          <Link href="/(auth)/redefinirSenha" style={{ alignSelf: "flex-end", marginBottom: 20 }}>
            <Text style={{ color: "blue" }}>Esqueceu a senha?</Text>
          </Link>

          {loading ? (
            <ActivityIndicator size="large" color={cores.primaria} />
          ) : (
            <Botao title="Entrar" onPress={handleLogin} iconName="forward" />
          )}

          <Text style={styles.textoSimples}>Ou</Text>
          <Botao
            title="Cadastrar" cor="secundaria" onPress={goToRegister}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  textoTitulo: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: "center"
  },
  textoSimples: {
    color: '#000',
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
  conteinerLogo: {
    height: '30%',
    backgroundColor: cores.primaria,
    alignItems: 'center',
  },
  image: {
    width: "100%",
    height: "100%",
    alignSelf: 'center',
  },
});


export default Login;