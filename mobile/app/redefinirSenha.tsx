import Botao from "@/components/botao";
import Input from "@/components/input";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import cores from "@/constants/cores";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { styles as formStyle } from "@/styles/forms.styles";

function RedefinirSenha() {
  
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

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
        <Input iconName="lock" placeholder="Digite sua senha" secureTextEntry={true} />
        <Input iconName="lock" placeholder="Confirme sua senha" secureTextEntry={true} />
        
        <Botao 
          title="Recuperar Senha" 
          onPress={() => { 
            alert("Senha redefinida com Sucesso!"); 
            router.push('/login');
          }} 
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
});

export default RedefinirSenha;