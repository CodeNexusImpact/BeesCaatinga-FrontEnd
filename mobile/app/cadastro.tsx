import Botao from "@/components/botao";
import Input from "@/components/input";
import { Image } from "expo-image";
import { useRouter, Link } from "expo-router";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import cores from "@/constants/cores";
import layout from "@/constants/layout";
import { useNavigation } from "expo-router";
// Importamos o useState
import { useEffect, useState } from "react"; 
import { styles as formStyle } from "@/styles/forms.styles";

function Cadastro() {
  const router = useRouter();
  const navigation = useNavigation();

  // --- 1. Criar um estado para cada campo do formulário ---
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [genero, setGenero] = useState(""); // Estado já existia
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // --- 2. Criar um estado para os erros de validação ---
  const [errors, setErrors] = useState({});

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // --- 3. Criar a função de validação ---
  const handleCadastro = () => {
    const validationErrors = {};

    // Validação do nome
    if (!nome.trim()) {
      validationErrors.nome = "O nome é obrigatório.";
    }

    // Validação do email
    if (!email.trim()) {
      validationErrors.email = "O email é obrigatório.";
    } else if (!/\S+@\S+\.\S+/.test(email)) { // Regex simples para email
      validationErrors.email = "O email é inválido.";
    }

    // Validação do telefone
    if (!telefone.trim()) {
      validationErrors.telefone = "O celular é obrigatório.";
    }

    // Validação da data de nascimento
    if (!dataNascimento.trim()) {
      validationErrors.dataNascimento = "A data de nascimento é obrigatória.";
    }
    
    // --- NOVA VALIDAÇÃO ---
    // Validação de gênero
    if (!genero.trim()) {
      validationErrors.genero = "O gênero é obrigatório.";
    }
    // --- FIM DA NOVA VALIDAÇÃO ---

    // Validação da senha
    if (!senha) {
      validationErrors.senha = "A senha é obrigatória.";
    } else if (senha.length < 6) {
      validationErrors.senha = "A senha deve ter no mínimo 6 caracteres.";
    }

    // Validação da confirmação de senha
    if (senha !== confirmarSenha) {
      validationErrors.confirmarSenha = "As senhas não coincidem.";
    }
    
    // Atualiza o estado de erros
    setErrors(validationErrors);

    // --- 4. Verificar se há erros ---
    // Se o objeto de erros estiver vazio, o formulário é válido
    if (Object.keys(validationErrors).length === 0) {
      // Sucesso!
      alert("Cadastro realizado!");
      router.push('/login');
    } else {
      // Existem erros, o alert não será disparado 
      // e as mensagens de erro aparecerão na tela.
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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={formStyle.formStyle}>
          <Text style={styles.textoTitulo}>Faça seu Cadastro</Text>

          {/* --- 5. Conectar os inputs ao estado --- */}
          <Input
            iconName="user"
            placeholder="Digite seu nome completo"
            value={nome}
            onChangeText={setNome} // Atualiza o estado 'nome'
          />
          {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}

          <Input
            iconName="phone"
            placeholder="Digite o número do seu celular"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
          />
          {errors.telefone && <Text style={styles.errorText}>{errors.telefone}</Text>}

          <Input
            iconName="email"
            placeholder="Digite seu email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <Input
            iconName="calendar"
            placeholder="Digite sua data de nascimento"
            value={dataNascimento}
            onChangeText={setDataNascimento}
          />
          {errors.dataNascimento && <Text style={styles.errorText}>{errors.dataNascimento}</Text>}

          <Input
            iconName="human"
            placeholder="Informe seu gênero"
            value={genero}
            onChangeText={setGenero}
          />
          {/* --- NOVA EXIBIÇÃO DE ERRO --- */}
          {errors.genero && <Text style={styles.errorText}>{errors.genero}</Text>}

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

          {/* --- 6. Chamar a função de validação no Botão --- */}
          <Botao
            title="Cadastrar"
            onPress={handleCadastro} // Chama nossa função manual
          />

          <Link href="/login" style={styles.link}>
            <Text style={styles.textoLink}>Já tem conta? Faça login</Text>
          </Link>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  link: {
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 20,
  },
  textoLink: {
    color: "blue",
    fontSize: 16,
  },
  // --- Estilo para os erros ---
  errorText: {
    color: 'red',
    fontSize: 14,
    alignSelf: 'flex-start',
    paddingLeft: 10, // Ajuste conforme o padding do seu Input
    marginBottom: 5,
    marginTop: -5,  // Ajuste para ficar mais próximo do Input
  },
});

export default Cadastro;