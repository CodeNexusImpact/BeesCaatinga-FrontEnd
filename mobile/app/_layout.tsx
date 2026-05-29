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
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      // Se não estiver logado e não estiver nas telas de login, vai para o login
      router.replace('/login');
    } else if (session && inAuthGroup) {
      // Se estiver logado e tentar acessar o login, vai para a home absoluta
      router.replace('/');
    }
  }, [session, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: temaCores.branco }}>
        <ActivityIndicator size="large" color={temaCores.primaria} />
        <Text style={{ marginTop: 10, color: temaCores.texto }}>{"Carregando sessão..."}</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: temaCores.branco }
    }}>
      <Stack.Screen name="(app)" />
      <Stack.Screen name="(auth)" />
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
