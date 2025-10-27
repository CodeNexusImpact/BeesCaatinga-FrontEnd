import Botao from "@/components/botao";
import Input from "@/components/input";
import { Image } from "expo-image";
import { Link, useNavigation } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { useEffect } from "react";
import cores from "@/constants/cores";
import { styles as formStyle } from "@/styles/forms.styles";
import { useRouter } from "expo-router";


function Login() {

  const router = useRouter();

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={{ display: "flex", height: "100%" }}>
      <View style={styles.conteinerLogo}>
        <Image
          style={styles.image}
          source={require("../assets/images/LogoBeesCaatinga.png")}
        />
      </View>
      <View
        style={formStyle.formStyle}
      >
        <Text style={styles.textoTitulo} >Faça seu Login</Text>
        <Input iconName="user" placeholder="Enter your username" />
        <Input iconName="lock" placeholder="Enter your password" secureTextEntry={true}></Input>
        <Link href="/redefinirSenha" style={{ alignSelf: "flex-end", marginBottom: 20 }}>
          <Text style={{ color: "blue" }}>Esqueceu a senha?</Text>
        </Link>
        <Botao title="Entrar" onPress={() => alert("Button pressed!")} iconName="forward" />
        <Text style={styles.textoSimples} >Ou</Text>
        <Botao 
          title="Cadastra" cor="secundaria" onPress={() => { alert("Cadastro realizado!"); 
          router.push('/cadastro');
          }} 
        />
        <Botao title="Cadastra com o Google" cor="branca" onPress={() => alert("Button pressed!")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    resizeMode: 'contain',
    marginTop: 50,
    marginBottom: 20,
    alignSelf: 'center',
  },
});


export default Login;