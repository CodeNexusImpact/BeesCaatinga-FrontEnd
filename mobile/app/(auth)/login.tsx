import Botao from "@/components/formulario/botao";
import Input from "@/components/formulario/input";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { Text, View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView, TouchableOpacity, useWindowDimensions } from "react-native";
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
  const { width } = useWindowDimensions();
  const isWebPC = Platform.OS === 'web' && width > 768;

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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.mainWrapper, isWebPC && styles.mainWrapperWeb]}>
        <View style={[styles.conteinerLogo, isWebPC && styles.conteinerLogoWeb]}>
          <Image
            style={styles.image}
            source={require("@/assets/images/LogoBeesCaatinga.png")}
            contentFit='contain'
          />
        </View>

        <ScrollView 
          style={[styles.scrollArea, isWebPC && styles.scrollAreaWeb]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.formContainer, isWebPC && styles.formContainerWeb]}>
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
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.branco,
  },
  mainWrapper: {
    flex: 1,
  },
  mainWrapperWeb: {
    flexDirection: 'row',
  },
  conteinerLogo: {
    height: 250,
    backgroundColor: cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  conteinerLogoWeb: {
    flex: 1,
    height: '100%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  image: {
    width: "80%",
    height: "80%",
  },
  scrollArea: {
    flex: 1,
  },
  scrollAreaWeb: {
    flex: 1.2,
    backgroundColor: cores.branco,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    padding: layout.espacamento.social,
    marginTop: -20,
    backgroundColor: cores.branco,
    borderRadius: 30,
  },
  formContainerWeb: {
    marginTop: 0,
    borderRadius: 0,
    padding: 50,
  },
  textoTitulo: {
    color: cores.texto,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: "center"
  },
  inputWrapper: {
    marginBottom: 20,
    height: 60,
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

export default Login;