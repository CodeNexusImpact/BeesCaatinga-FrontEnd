import Botao from "@/components/botao";
import Input from "@/components/input";
import ModalSucesso from "@/components/modalSucesso";
import Selector from "@/components/selector";
import cores from "@/constants/cores";
import { cadastrarProdutor } from "@/services/produtorService";
import { styles as formStyle } from "@/styles/forms.styles";
import { Genero, ProdutorCriado } from "@/types/user";
import { maskDate, maskPhone, validateEmail, validatePassword } from "@/utils/masks";
import { Image } from "expo-image";
import { Link, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

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

  // --- Estados dos campos ---
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [genero, setGenero] = useState<Genero | "">("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // --- Estado do modal ---
  const [modalVisible, setModalVisible] = useState(false);

  const generoOptions = [
    { label: 'Masculino', value: 'MASCULINO' },
    { label: 'Feminino', value: 'FEMININO' },
    { label: 'Outro', value: 'OUTRO' },];

  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleModalClose = () => {
    setModalVisible(false);
    router.push('/(auth)/login');
  };

  const handleCadastro = async () => {
    const validationErrors: ValidationErrors = {};

    // Validação do nome
    if (!nome.trim()) {
      validationErrors.nome = "O nome é obrigatório.";
    }

    // Validação do email
    if (!email.trim()) {
      validationErrors.email = "O email é obrigatório.";
    } else if (!validateEmail(email)) {
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
    } else if (!validatePassword(senha)) {
      validationErrors.senha = "A senha deve ter 8+ caracteres, com maiúscula, minúscula, número e caractere especial.";
    }

    // Validação da confirmação de senha
    if (senha !== confirmarSenha) {
      validationErrors.confirmarSenha = "As senhas não coincidem.";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const produtorData: ProdutorCriado = {
        nomeCompleto: nome,
        telefone: telefone,
        email: email,
        dataDeNascimento: dataNascimento,
        genero: genero as Genero,
        senha: senha,
      };

      try {
        await cadastrarProdutor(produtorData);
        setModalVisible(true);
      } catch (error) {
        console.error("Erro no cadastro:", error);
        Alert.alert("Erro", "Não foi possível realizar o cadastro. Tente novamente.");
      }

    } else {
      console.log("Erros de validação:", validationErrors);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ModalSucesso
        visivel={modalVisible}
        mensagem="Cadastro realizado com sucesso! Você será redirecionado para a tela de login."
        aoFechar={handleModalClose}
      />
      <View style={styles.conteinerLogo}>
        <Image
          style={styles.image}
          source={require("@/assets/images/LogoBeesCaatinga.png")}
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
            onChangeText={(text) => setTelefone(maskPhone(text))}
            keyboardType="phone-pad"
            maxLength={15}
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
            placeholder="Digite sua data de nascimento (dd/MM/yyyy)"
            value={dataNascimento}
            onChangeText={(text) => setDataNascimento(maskDate(text))}
            keyboardType="numeric"
            maxLength={10}
          />
          {errors.dataNascimento && <Text style={styles.errorText}>{errors.dataNascimento}</Text>}

          <Selector options={generoOptions} onSelect={(value) => setGenero(value as Genero)} iconName="human"></Selector>

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

          <Link href="/(auth)/login" style={styles.link}>
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
    height: '30%',
    backgroundColor: cores.primaria,
    alignItems: 'center',
  },
  image: {
    width: "100%",
    height: '100%',
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