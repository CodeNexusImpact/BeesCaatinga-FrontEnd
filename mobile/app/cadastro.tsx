import Botao from "@/components/botao";
import Input from "@/components/input";
import { Image } from "expo-image";
import { useRouter, Link } from "expo-router";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import cores from "@/constants/cores";
import { useNavigation } from "expo-router";
// Importamos o useState e useEffect
import { useEffect, useState } from "react";
import { styles as formStyle } from "@/styles/forms.styles";
import Selector from "@/components/seletor";

// --- DEFINIR A INTERFACE PARA OS ERROS ---
interface ValidationErrors {
  nome?: string;
  telefone?: string;
  email?: string;
  dataNascimento?: string;
  genero?: string;
  senha?: string;
  confirmarSenha?: string;
}

function Cadastro() {
  const router = useRouter();
  const navigation = useNavigation();

  // --- Estados dos campos (sem mudança) ---
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [genero, setGenero] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const generoOptions = [
    { label: 'Masculino', value: 'masculino' },
    { label: 'Feminino', value: 'feminino' },
    { label: 'Outro', value: 'outro' },];

  // --- USAR A INTERFACE NO useState ---
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleCadastro = () => {
    const validationErrors: ValidationErrors = {};

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

    // Validação de gênero
    if (!genero.trim()) {
      validationErrors.genero = "O gênero é obrigatório.";
    }

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

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      alert("Cadastro realizado!");
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
          contentFit='cover'
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={formStyle.formStyle}>
          <Text style={styles.textoTitulo}>Faça seu Cadastro</Text>

          <Input
            iconName="user"
            placeholder="Digite seu nome completo"
            value={nome}
            onChangeText={setNome}
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

          <Selector options={generoOptions} onSelect={setGenero} iconName="human"></Selector>

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

          <Botao
            title="Cadastrar"
            onPress={handleCadastro}
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
  errorText: {
    color: 'red',
    fontSize: 14,
    alignSelf: 'flex-start',
    paddingLeft: 10,
    marginBottom: 5,
    marginTop: -5,
  },
});

export default Cadastro;