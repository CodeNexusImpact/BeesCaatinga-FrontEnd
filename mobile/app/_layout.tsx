import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { Text, ActivityIndicator, View } from 'react-native';
import temaCores from "@/constants/cores";
import { useEffect } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function RootLayout() {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // 1. Não navega enquanto estiver carregando o estado inicial do SecureStore
    if (isLoading) return;

    // 2. Verifica se o usuário está dentro das pastas de autenticação
    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      // Caso 1: Usuário não está logado e tenta acessar área protegida -> Vai para Login
      console.log("🛡️ Rota Protegida: Redirecionando para Login");
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      // Caso 2: Usuário está logado mas está nas telas de auth -> Vai para Home
      console.log("🛡️ Usuário Autenticado: Redirecionando para Home");
      router.replace('/(app)');
    }
  }, [session, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: temaCores.branco }}>
        <ActivityIndicator size="large" color={temaCores.primaria[100]} />
        <Text style={{ marginTop: 10, color: temaCores.texto }}>{"Iniciando BeesCaatinga..."}</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function LayoutWrapper() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <RootLayout />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
