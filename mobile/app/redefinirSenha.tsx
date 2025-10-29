import Botao from "@/components/botao";
import Input from "@/components/input";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import cores from "@/constants/cores";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react"; 
import { styles as formStyle } from "@/styles/forms.styles";

interface RedefinirErrors {
  senha?: string;
  confirmarSenha?: string;
}

function RedefinirSenha() {
  const router = useRouter();
  const navigation = useNavigation();

  // --- Estados dos campos ---
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // --- 2. USAR A INTERFACE NO useState ---
  const [errors, setErrors] = useState<RedefinirErrors>({});

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // --- 3. Função de validação ---
  const handleRedefinir = () => {
    // Tipar a variável interna
    const validationErrors: RedefinirErrors = {};

    // Validação da senha
    if (!senha) {
      validationErrors.senha = "A nova senha é obrigatória.";
    } else if (senha.length < 6) {
      validationErrors.senha = "A senha deve ter no mínimo 6 caracteres.";
    }

    // Validação da confirmação de senha
    if (senha !== confirmarSenha) {
      validationErrors.confirmarSenha = "As senhas não coincidem.";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      alert("Senha redefinida com Sucesso!");
      router.push('/login');
    } else {
      console.log("Erros de validação:", validationErrors);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.conteinerLogo}>
        <Image
          style={styles.image}
          source={require("../assets/images/LogoBeesCaatinga.png")}
        />
      </View>
      <View style={formStyle.formStyle}>
        <Text style={styles.textoTitulo}>Recuperar Senha</Text>

        <Input
          iconName="lock"
          placeholder="Digite sua senha"
          secureTextEntry={true}
          value={senha}
          onChangeText={setSenha}
        />
        {errors.senha && <Text style={styles.errorText}>{errors.senha}</Text>}

        <Input
          iconName="lock"
          placeholder="Confirme sua senha"
          secureTextEntry={true}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />
        {errors.confirmarSenha && <Text style={styles.errorText}>{errors.confirmarSenha}</Text>}

        <Botao
          title="Recuperar Senha"
          onPress={handleRedefinir}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textoTitulo: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  conteinerLogo: {
    height: 'auto',
    backgroundColor: cores.primaria,
    alignItems: 'center',
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: 'contain',
    marginTop: 50,
    marginBottom: 20,
    alignSelf: 'center',
  },
  // --- Estilo para o texto de erro ---
  errorText: {
    color: 'red',
    fontSize: 14,
    alignSelf: 'flex-start',
    paddingLeft: 10,
    marginBottom: 5,
    marginTop: -5,
  },
});

export default RedefinirSenha;