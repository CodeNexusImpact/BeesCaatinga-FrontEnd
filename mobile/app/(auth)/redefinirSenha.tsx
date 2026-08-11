import Botao from "@/components/formulario/botao";
import Input from "@/components/formulario/input";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, View, StyleSheet, Platform, useWindowDimensions, ScrollView, TouchableOpacity, Alert } from "react-native";
import Icon from '@/components/icon';
import cores from "@/constants/cores";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { styles as formStyle } from "@/styles/forms.styles";
import layout from "@/constants/layout";

interface RedefinirErrors {
  senha?: string;
  confirmarSenha?: string;
}

function RedefinirSenha() {
  const router = useRouter();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isWebPC = Platform.OS === 'web' && width > 768;

  // --- Estados dos campos ---
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [errors, setErrors] = useState<RedefinirErrors>({});

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleRedefinir = () => {
    const validationErrors: RedefinirErrors = {};

    if (!senha) {
      validationErrors.senha = "A nova senha é obrigatória.";
    } else if (senha.length < 6) {
      validationErrors.senha = "A senha deve ter no mínimo 6 caracteres.";
    }

    if (senha !== confirmarSenha) {
      validationErrors.confirmarSenha = "As senhas não coincidem.";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      alert("Senha redefinida com Sucesso!");
      router.push('/login');
    }
  };

  return (
    <View style={styles.container}>

      <View style={[styles.mainWrapper, isWebPC && styles.mainWrapperWeb]}>
        <View style={[styles.conteinerLogo, isWebPC && styles.conteinerLogoWeb]}>
          <Image
            style={styles.image}
            source={require("@/assets/images/LogoBeesCaatinga.png")}
          />
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={[formStyle.formStyle, isWebPC && styles.formContainerWeb]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Icon name="back" size={30} color={cores.primaria[100]} />
            </TouchableOpacity>
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
        </ScrollView>
      </View>
    </View>
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
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainerWeb: {
    padding: 40,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  textoTitulo: {
    color: '#000',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  conteinerLogo: {
    height: 250,
    backgroundColor: cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conteinerLogoWeb: {
    flex: 1,
    height: '100%',
  },
  image: {
    width: "70%",
    height: Platform.OS === 'web' ? 150 : 200,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    alignSelf: 'flex-start',
    paddingLeft: 10,
    marginBottom: 5,
    marginTop: -5,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 40,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 5,
  },
});

export default RedefinirSenha;