import { Stack, Redirect } from 'expo-router';
import Header from '@/components/header';
import BottomMenu from '@/components/bottomMenu';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import temaCores from '@/constants/cores';

export default function Layout() {
  const { session, isLoading } = useAuth();

  // Enquanto a sessão está sendo carregada, mostramos um indicador
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: temaCores.branco }}>
        <ActivityIndicator size="large" color={temaCores.primaria} />
      </View>
    );
  }

  // Se não houver sessão, redirecionamos para o login
  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            header: ({ options }) => <Header title={options.title || 'BeesCaatinga'} />,
          }} />
      </View>
      <View style={{ height: 60 }}>
        <BottomMenu />
      </View>
    </View>
  );
}
