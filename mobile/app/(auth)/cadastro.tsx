import Botao from "@/components/formulario/botao";
import Input from "@/components/formulario/input";
import ModalSucesso from "@/components/notificacao/modalSucesso";
import Selector from "@/components/formulario/selector";
import cores from "@/constants/cores";
import { cadastrarProdutor } from "@/services/produtorService";
import { Genero, ProdutorCriado } from "@/types/user";
import { maskDate, maskPhone, validateEmail, validatePassword } from "@/utils/masks";
import TelaAuth from '@/components/auth/telaAuth';
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import { alerta } from '@/utils/alerta';

interface ValidationErrors {
  nomeCompleto?: string;
  telefone?: string;
  email?: string;
  dataDeNascimento?: string;
  genero?: string;
  senha?: string;
  confirmarSenha?: string;
}

const generoOptions = [
  { label: 'Masculino', value: 'MASCULINO' },
  { label: 'Feminino', value: 'FEMININO' },
  { label: 'Outro', value: 'OUTRO' },
];

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
      validationErrors.senha = "A senha precisa ter 8 ou mais caracteres, com letra maiúscula, minúscula, número e símbolo (ex.: Mel@2026).";
    }

    if (senha !== confirmarSenha) {
      validationErrors.confirmarSenha = "As senhas não coincidem.";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      
      const produtorData: ProdutorCriado = {
        nomeCompleto,
        telefone: telefone.replace(/\D/g, ''),
        email,
        dataDeNascimento, 
        genero: genero as Genero,
        senha,
      };

      try {
        await cadastrarProdutor(produtorData);
        setModalVisible(true);
      } catch (error: any) {
        console.error("❌ Erro no cadastro:", error.response?.data || error.message);
        const backendMsg = error.response?.data?.message || "Não foi possível realizar o cadastro.";
        alerta("Erro no Cadastro", backendMsg);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <TelaAuth titulo="Criar conta" subtitulo="Preencha seus dados. Leva menos de 2 minutos.">
      <ModalSucesso
        visivel={modalVisible}
        mensagem="Cadastro realizado com sucesso! Você será levado para a tela de entrar."
        aoFechar={handleModalClose}
      />
      <Input label="Nome completo" iconName="user" placeholder="Nome Completo" value={nomeCompleto} onChangeText={setNomeCompleto} erro={errors.nomeCompleto} autoComplete="name" />
      <Input
        label="Telefone com DDD"
        iconName="phone"
        placeholder="Telefone (DDD + Número)"
        value={telefone}
        onChangeText={(text) => setTelefone(maskPhone(text))}
        keyboardType="phone-pad"
        maxLength={15}
        erro={errors.telefone}
        dica="Ex.: (83) 9 8765-4321"
      />
      <Input label="E-mail" iconName="email" placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" erro={errors.email} autoComplete="email" />
      <Input
        label="Data de nascimento"
        iconName="calendar"
        placeholder="dd/mm/aaaa"
        value={dataDeNascimento}
        onChangeText={(text) => setDataDeNascimento(maskDate(text))}
        keyboardType="numeric"
        maxLength={10}
        erro={errors.dataDeNascimento}
        dica="Ex.: 15/03/1980"
      />
      <View style={{ zIndex: 10 }}>
        <Selector label="Gênero" options={generoOptions} onSelect={(value) => setGenero(value as Genero)} iconName="human" value={genero} />
        {errors.genero && <Text style={styles.errorText}>{errors.genero}</Text>}
      </View>
      <Input label="Senha" iconName="lock" placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} erro={errors.senha} dica="8 ou mais caracteres, com maiúscula, minúscula, número e símbolo. Ex.: Mel@2026" />
      <Input label="Confirme a senha" iconName="lock" placeholder="Confirme sua Senha" secureTextEntry value={confirmarSenha} onChangeText={setConfirmarSenha} erro={errors.confirmarSenha} />

      {loading ? (
        <ActivityIndicator size="large" color={cores.primaria} style={{ marginTop: 8 }} />
      ) : (
        <Botao title="Finalizar Cadastro" onPress={handleCadastro} />
      )}
      <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.link} accessibilityRole="link">
        <Text style={styles.textoLink}>Já tem conta? Entrar</Text>
      </TouchableOpacity>
    </TelaAuth>
  );
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
  textoTitulo: {
    color: cores.texto,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center'
  },
  conteinerLogo: {
    height: '25%',
    backgroundColor: cores.primaria,
    alignItems: 'center',
    justifyContent: 'center'
  },
  conteinerLogoWeb: {
    flex: 1,
    height: '100%',
  },
  image: {
    width: "70%",
    height: '70%',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewWeb: {
    flex: 1.2,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  formContainerWeb: {
    padding: 40,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  link: {
    alignSelf: "center",
    marginTop: 15,
  },
  textoLink: {
    color: cores.primaria[100],
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