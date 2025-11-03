import { Stack } from "expo-router";
import { AuthProvider } from '@/context/AuthContext'; // Importe SÓ o Provedor do Contexto
import { useAuth } from '@/hooks/useAuth';
import { Text, ActivityIndicator, View } from 'react-native';
import cores from "@/constants/cores";


export function RootLayout() {
  const { session, isLoading } = useAuth();
  if (isLoading) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
        <Text>{"Carregando sessão..."}</Text>
      </View>
    );
  }
  return <View style={{ flex: 1 }} id='rootView'>
    <Stack screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: cores.branco, justifyContent: 'center' }
    }} >
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

    </Stack>
  </View>
}

// O Layout que engloba o Provedor de Autenticação
export default function LayoutWrapper() {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
}

