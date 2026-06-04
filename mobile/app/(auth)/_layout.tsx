import { Stack } from 'expo-router';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';

export default function AuthLayout() {
  // Pegamos a largura da tela em tempo real para ajudar no comportamento responsivo
  const { width } = useWindowDimensions();
  const isWebPC = width > 420; // Define se está em uma tela de computador

  return (
    <View style={styles.backgroundCanvas}>
      {/* O EFEITO DOS HEXÁGONOS DE FUNDO ENTRARÁ AQUI NO FUTURO.
        Ele vai rodar por trás do card de autenticação.
      */}

      <View style={[styles.authCard, isWebPC && styles.authCardWeb]}>
        <Stack
          screenOptions={{
            headerShown: false,
            // Removemos o fundo branco padrão do contentStyle para o Card controlar a cor
            contentStyle: { backgroundColor: 'transparent' }, 
          }}
        >
          <Stack.Screen name="login" />
          <Stack.Screen name="cadastro" />
          <Stack.Screen name="redefinirSenha" />
        </Stack>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // O fundo infinito da tela (onde o efeito do mouse vai acontecer)
  backgroundCanvas: {
    flex: 1,
    backgroundColor: '#121212', // Fundo escuro para destacar os hexágonos
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // O container que segura suas telas de login/cadastro
  authCard: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1e1e1e', // Cor interna do "card" das telas
    overflow: 'hidden', // Garante que as transições do Stack não vazem as bordas arredondadas
  },

  // Estilos aplicados APENAS quando a tela for grande (PC / Web)
  authCardWeb: {
    maxWidth: 420,
    maxHeight: 640, // Altura máxima opcional para parecer um celular no centro
    height: '90%',  // Não colar totalmente no topo/base da tela do PC
    borderRadius: 16,
    
    // Sombreamento elegante para o PC
    ...Platform.select({
      web: {
        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.5)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
      }
    }),
  },
});