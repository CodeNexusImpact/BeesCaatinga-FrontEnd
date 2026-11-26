import { Stack, Redirect } from 'expo-router';
import Header from '@/components/header';
import BottomMenu from '@/components/bottomMenu';
import BannerSincronizacao from '@/components/bannerSincronizacao';
import { useEffect } from 'react';
import { setDensidadeMel } from '@/utils/mel';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import temaCores from '@/constants/cores';

export default function Layout() {
  const { session, isLoading, user } = useAuth();
  const densidadeServidor = Number((user as any)?.densidadeMel);

  // Densidade do mel do produtor (backend) tem prioridade sobre a salva no aparelho.
  useEffect(() => {
    if (densidadeServidor) setDensidadeMel(densidadeServidor);
  }, [densidadeServidor]);

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
      <BannerSincronizacao />
      <View style={{ height: 64 }}>
        <BottomMenu />
      </View>
    </View>
  );
}
