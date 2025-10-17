import Botao from "@/components/botao";
import Input from "@/components/input";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import cores from "@/constants/cores";
import layout from "@/constants/layout";
import {useNavigation } from "expo-router";
import { useEffect } from "react";

function Cadastro() {
  
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
      navigation.setOptions({ headerShown: false });
    }, [navigation]);

  return (
    <View style={{ display: "flex", height: "100%" }}>
      <View style={{ backgroundColor: cores.primaria, alignItems: "center" }}>
        <Image
          style={styles.image}
          source={require("../assets/images/LogoBeesCaatinga.png")}
        />
      </View>
      <View
        style={{
          display: "flex",
          padding: layout.espacamento.colega,
          justifyContent: "flex-start",
          alignItems: "center",
          height: "100%",
          
        }}
      >
        <Text style={styles.textoTitulo}>Faça seu Cadastro</Text>
        <Input iconName="user" placeholder="Digite seu nome completo" />
        <Input iconName="phone" placeholder="Digite o número do seu celular" />
        <Input iconName="email" placeholder="Digite seu email" />
        <Input iconName="calendar" placeholder="Digite sua data de nascimento" />
        <Input iconName="human" placeholder="Informe seu gênero" />   
        <Input iconName="lock" placeholder="Digite sua senha" secureTextEntry={true} />
        <Input iconName="lock" placeholder="Confirme sua senha" secureTextEntry={true} />
        
        <Botao 
          title="Cadastrar" onPress={() => { alert("Cadastro realizado!"); 
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
  },
  textoSimples: {
    color: '#000',
    fontSize: 16,
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

export default Cadastro;