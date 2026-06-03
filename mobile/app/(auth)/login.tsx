import Botao from "@/components/botao";
import Input from "@/components/input";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { Text, View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import cores from "@/constants/cores";
import layout from "@/constants/layout";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";


function Login() {
  const [email, setEmail] = useState(__DEV__ ? 'dev@produtor.com' : '');
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
      Alert.alert("Erro", "Por favor, preencha o e-mail e a senha.");
      return;
    }

    setLoading(true);
    try {
      // Chamada real ao backend via AuthContext -> api.ts
      await signIn(email, senha);
      console.log("✅ Login realizado com sucesso para:", email);
    } catch (error: any) {
      console.error("❌ Erro na tentativa de login:", error);
      Alert.alert(
        "Erro de Autenticação", 
        "E-mail ou senha inválidos. Verifique suas credenciais e sua conexão de rede."
      );
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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.conteinerLogo}>
          <Image
            style={styles.image}
            source={require("@/assets/images/LogoBeesCaatinga.png")}
            contentFit='contain'
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.textoTitulo}>Faça seu Login</Text>
          
          <View style={styles.inputWrapper}>
            <Input
              iconName="email"
              placeholder="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.inputField}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Input
              iconName="lock"
              placeholder="Senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={true}
              style={styles.inputField}
            />
          </View>

          <TouchableOpacity 
            onPress={() => router.push("/(auth)/redefinirSenha")} 
            style={styles.esqueceuSenha}
          >
            <Text style={styles.esqueceuSenhaTexto}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator size="large" color={cores.primaria[100]} style={{ marginVertical: 20 }} />
          ) : (
            <Botao title="Entrar" onPress={handleLogin} iconName="forward" />
          )}

          <Text style={styles.textoSimples}>Ou</Text>
          
          <Botao
            title="Cadastrar" 
            cor="secundaria" 
            onPress={() => router.push('/(auth)/cadastro')}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.branco,
  },
  conteinerLogo: {
    height: 250,
    backgroundColor: cores.primaria[100],
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  image: {
    width: "80%",
    height: "80%",
  },
  formContainer: {
    padding: layout.espacamento.social,
    marginTop: -20,
    backgroundColor: cores.branco,
    borderRadius: 30,
    flex: 1,
  },
  textoTitulo: {
    color: cores.texto,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: "center"
  },
  inputWrapper: {
    marginBottom: 16,
    height: 60, // Ajuste para comportar o design do componente Input
  },
  inputField: {
    height: 55,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
  },
  esqueceuSenha: {
    alignSelf: "flex-end", 
    marginBottom: 24
  },
  esqueceuSenhaTexto: {
    color: cores.primaria[100],
    fontWeight: '600',
  },
  textoSimples: {
    color: cores.texto,
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
  },
});

import { TouchableOpacity } from "react-native-gesture-handler";

export default Login;