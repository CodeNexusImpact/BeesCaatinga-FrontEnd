import Botao from "@/components/botao";
import Input from "@/components/input";
import { Image } from "expo-image";
import { useRouter, Link } from "expo-router";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import cores from "@/constants/cores";
import layout from "@/constants/layout";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { styles as formStyle } from "@/styles/forms.styles";

function Cadastro() {
  
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
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={formStyle.formStyle}>
          <Text style={styles.textoTitulo}>Faça seu Cadastro</Text>
          
          <Input iconName="user" placeholder="Digite seu nome completo" />
          <Input iconName="phone" placeholder="Digite o número do seu celular" />
          <Input iconName="email" placeholder="Digite seu email" />
          <Input iconName="calendar" placeholder="Digite sua data de nascimento" />
          <Input iconName="human" placeholder="Informe seu gênero" />   
          <Input iconName="lock" placeholder="Digite sua senha" secureTextEntry={true} />
          <Input iconName="lock" placeholder="Confirme sua senha" secureTextEntry={true} />
          
          <Botao 
            title="Cadastrar" 
            onPress={() => { 
              alert("Cadastro realizado!"); 
              router.push('/login');
            }} 
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
});

export default Cadastro;