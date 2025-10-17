import Botao from "@/components/botao";
import Input from "@/components/input";
import { Image } from "expo-image";
import { Link, useNavigation } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { useEffect } from "react";
import cores from "@/constants/cores";
import layout from "@/constants/layout";


function Index() {

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
        <Text style={styles.textoTitulo} >Faça seu Login</Text>
        <Input iconName="user" placeholder="Enter your username" />
        <Input iconName="lock" placeholder="Enter your password" secureTextEntry={true}></Input>
        <Link href="/login" style={{ alignSelf: "flex-end", marginBottom: 20 }}>
          <Text style={{ color: "blue" }}>Esqueceu a senha?</Text>
        </Link>
        <Botao title="Entrar" onPress={() => alert("Button pressed!")} />
        <Text style={styles.textoSimples} >Ou</Text>
        <Botao title="Cadastra" onPress={() => alert("Button pressed!")} />
        <Botao title="Cadastra com o Google" onPress={() => alert("Button pressed!")} />
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


export default Index;