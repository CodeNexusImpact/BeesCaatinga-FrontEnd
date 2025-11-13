import Botao from "@/components/botao";
import Input from "@/components/input";
import { Image } from "expo-image";
import { Link, useNavigation } from "expo-router";
import { Text, View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
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

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      // Chama a função de login encapsulada no useAuth (que é a nossa lógica estática)
      await signIn(email, senha);

      // O Expo Router fará o redirecionamento automático para (app) 
      // porque o session state no AuthProvider mudou!

    } catch (error) {
      // Em caso de falha de validação ou erro de API (no futuro)
      Alert.alert("Erro de Login", "Credenciais inválidas. Tente novamente.");
      console.error("Login falhou:", error);
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    router.push('/cadastro'); // Navega para a tela de cadastro
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
            iconName="user"
            placeholder="Enter your username"
            value={email}
            onChangeText={setEmail} />
          <Input
            iconName="lock"
            placeholder="Enter your password"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={true}></Input>
          <Link href="/redefinirSenha" style={{ alignSelf: "flex-end", marginBottom: 20 }}>
            <Text style={{ color: "blue" }}>Esqueceu a senha?</Text>
          </Link>
          <Botao title="Entrar" onPress={() => handleLogin()} iconName="forward" />
          <Text style={styles.textoSimples}>Ou</Text>
          <Botao
            title="Cadastra" cor="secundaria" onPress={() => {
              router.push('/cadastro');
            }}
          />
          <Botao title="Cadastra com o Google" cor="branca" onPress={goToRegister} />
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
  },
  textoSimples: {
    color: '#000',
    fontSize: 16,
  },
  conteinerLogo: {
    height: 'auto',
    backgroundColor: cores.primaria,
    alignItems: 'center',
  },
  image: {
    width: "100%",
    height: 200,
    marginTop: 50,
    marginBottom: 20,
    alignSelf: 'center',
  },
});


export default Login;