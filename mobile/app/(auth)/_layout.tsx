import { Stack } from 'expo-router';
import { StyleSheet, View, useWindowDimensions, Platform } from 'react-native';

export default function AuthLayout() {
  const { width } = useWindowDimensions();
  const isWebPC = width > 420; // Define se está no computador

  return (
    <View style={styles.backgroundCanvas}>
      {/* O efeito dos hexágonos entrará aqui por trás */}

      <View style={[styles.authCard, isWebPC && styles.authCardWeb]}>
        <Stack
          screenOptions={{
            headerShown: false,
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
  backgroundCanvas: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    // Garante que o fundo web não crie rolagem externa na página inteira
    ...Platform.select({
      web: {
        overflow: 'hidden',
        height: '100%',
      }
    })
  },
  
  authCard: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1e1e1e',
    overflow: 'hidden',
  },

  authCardWeb: {
    maxWidth: 1000,
    width: '95%',
    height: 'auto',
    minHeight: 600,
    maxHeight: '90%',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#fff', // Fundo branco para o card no PC
    
    ...Platform.select({
      web: {
        boxShadow: '0px 20px 60px rgba(0, 0, 0, 0.6)',
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