import Botao from "@/components/formulario/botao";
import Input from "@/components/formulario/input";
import ModalSucesso from "@/components/notificacao/modalSucesso";
import Selector from "@/components/formulario/selector";
import cores from "@/constants/cores";
import { cadastrarProdutor } from "@/services/produtorService";
import { styles as formStyle } from "@/styles/forms.styles";
import { Genero, ProdutorCriado } from "@/types/user";
import { maskDate, maskPhone, validateEmail, validatePassword } from "@/utils/masks";
import { Image } from "expo-image";
import { Link, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";

interface ValidationErrors {
  nomeCompleto?: string;
  telefone?: string;
  email?: string;
  dataDeNascimento?: string;
  genero?: string;
  senha?: string;
  confirmarSenha?: string;
}

function Cadastro() {
  const router = useRouter();
  const navigation = useNavigation();

  const [nomeCompleto, setNomeCompleto] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [dataDeNascimento, setDataDeNascimento] = useState("");
  const [genero, setGenero] = useState<Genero | "">("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const generoOptions = [
    { label: 'Masculino', value: 'MASCULINO' },
    { label: 'Feminino', value: 'FEMININO' },
    { label: 'Outro', value: 'OUTRO' },
  ];

  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleModalClose = () => {
    setModalVisible(false);
    router.replace('/(auth)/login');
  };

  const handleCadastro = async () => {
    const validationErrors: ValidationErrors = {};

    if (!nomeCompleto.trim()) validationErrors.nomeCompleto = "O nome completo é obrigatório.";
    
    if (!email.trim()) {
      validationErrors.email = "O email é obrigatório.";
    } else if (!validateEmail(email)) {
      validationErrors.email = "O email é inválido.";
    }

    if (!telefone.trim()) {
      validationErrors.telefone = "O telefone é obrigatório.";
    } else if (telefone.replace(/\D/g, '').length < 10) {
      validationErrors.telefone = "Telefone inválido.";
    }

    if (!dataDeNascimento.trim()) {
      validationErrors.dataDeNascimento = "A data de nascimento é obrigatória.";
    } else if (dataDeNascimento.length < 10) {
      validationErrors.dataDeNascimento = "Data incompleta.";
    }

    if (!genero) validationErrors.genero = "O gênero é obrigatório.";

    if (!senha) {
      validationErrors.senha = "A senha é obrigatória.";
    } else if (!validatePassword(senha)) {
      validationErrors.senha = "Senha muito fraca.";
    }

    if (senha !== confirmarSenha) {
      validationErrors.confirmarSenha = "As senhas não coincidem.";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      
      const produtorData: ProdutorCriado = {
        nomeCompleto,
        telefone,
        email,
        dataDeNascimento, // String no formato dd/MM/yyyy conforme @JsonFormat do Backend
        genero: genero as Genero,
        senha,
      };

      try {
        await cadastrarProdutor(produtorData);
        setModalVisible(true);
      } catch (error: any) {
        console.error("❌ Erro no cadastro:", error.response?.data || error.message);
        const backendMsg = error.response?.data?.message || "Não foi possível realizar o cadastro.";
        Alert.alert("Erro no Cadastro", backendMsg);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ModalSucesso
        visivel={modalVisible}
        mensagem="Cadastro realizado com sucesso! Você será redirecionado para a tela de login."
        aoFechar={handleModalClose}
      />
      <View style={styles.conteinerLogo}>
        <Image
          style={styles.image}
          source={require("@/assets/images/LogoBeesCaatinga.png")}
          contentFit='contain'
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
            placeholder="Nome Completo"
            value={nomeCompleto}
            onChangeText={setNomeCompleto}
          />
          {errors.nomeCompleto && <Text style={styles.errorText}>{errors.nomeCompleto}</Text>}

          <Input
            iconName="phone"
            placeholder="Telefone (DDD + Número)"
            value={telefone}
            onChangeText={(text) => setTelefone(maskPhone(text))}
            keyboardType="phone-pad"
            maxLength={15}
          />
          {errors.telefone && <Text style={styles.errorText}>{errors.telefone}</Text>}

          <Input
            iconName="email"
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <Input
            iconName="calendar"
            placeholder="Data de Nascimento (dd/MM/yyyy)"
            value={dataDeNascimento}
            onChangeText={(text) => setDataDeNascimento(maskDate(text))}
            keyboardType="numeric"
            maxLength={10}
          />
          {errors.dataDeNascimento && <Text style={styles.errorText}>{errors.dataDeNascimento}</Text>}

          <Selector options={generoOptions} onSelect={(value) => setGenero(value as Genero)} iconName="human" />
          {errors.genero && <Text style={styles.errorText}>{errors.genero}</Text>}

          <Input
            iconName="lock"
            placeholder="Senha"
            secureTextEntry={true}
            value={senha}
            onChangeText={setSenha}
          />
          {errors.senha && <Text style={styles.errorText}>{errors.senha}</Text>}

          <Input
            iconName="lock"
            placeholder="Confirme sua Senha"
            secureTextEntry={true}
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />
          {errors.confirmarSenha && <Text style={styles.errorText}>{errors.confirmarSenha}</Text>}

          {loading ? (
            <ActivityIndicator size="large" color={cores.primaria} style={{ marginTop: 20 }} />
          ) : (
            <Botao title="Finalizar Cadastro" onPress={handleCadastro} />
          )}

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
    textAlign: 'center'
  },
  conteinerLogo: {
    height: '25%',
    backgroundColor: cores.primaria,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: "70%",
    height: '70%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40
  },
  link: {
    alignSelf: "center",
    marginTop: 15,
  },
  textoLink: {
    color: cores.primaria,
    fontSize: 16,
    fontWeight: 'bold'
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    marginTop: -5,
    marginLeft: 10
  },
});

export default Cadastro;