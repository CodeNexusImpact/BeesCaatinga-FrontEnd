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
import { listarProdutores } from "@/services/produtorService";


function Login() {

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      // 1. Pega a lista de todos os produtores da API
      const produtores = await listarProdutores();

      // 2. Procura um usuário com o email fornecido
      const foundUser = produtores.find(p => p.email.toLowerCase() === email.toLowerCase());

      // 3. Validação temporária (INSEGURA)
      // O backend não retorna a senha, então esta validação de senha falhará.
      // O login funcionará se o email for encontrado.
      // Em um cenário real, o backend deve ter um endpoint /login que valide a senha.
      if (foundUser) {
        // A lógica de `signIn` do AuthContext será usada para criar a sessão
        await signIn(email, senha);
        // O Expo Router fará o redirecionamento automático
      } else {
        Alert.alert("Erro de Login", "Credenciais inválidas. Tente novamente.");
      }

    } catch (error) {
      Alert.alert("Erro de Login", "Não foi possível conectar ao servidor. Tente novamente.");
      console.error("Login falhou:", error);
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    router.push('/(auth)/cadastro'); // Navega para a tela de cadastro
  }

  const navigation = useNavigation();
  const router = useRouter();
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

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