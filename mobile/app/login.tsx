import Botao from "@/components/botao";
import Input from "@/components/input";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";



function Index() { 

  return (
    <View>
      <View>
        <Image
        style={styles.image}
        source= {require("../assets/images/LogoBeesCaatinga.png")}
      />
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          margin: 20,
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