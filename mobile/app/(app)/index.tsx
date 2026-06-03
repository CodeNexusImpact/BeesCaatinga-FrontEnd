import ItemHome from '@/components/itensHome';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, View, Dimensions, ScrollView } from 'react-native';
import { useAuth } from '@/hooks/useAuth';

const prodMel = require('@/assets/images/prodMel.png');
const apiarioColmeia = require('@/assets/images/apiario_colmeia.png');
const rastrear = require('@/assets/images/rastrear.png');

export default function Index() {
  const router = useRouter();
  const { user } = useAuth();

  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  const items: Array<{
    title: string;
    icon?: string;
    image?: any;
    route: string;
  }> = [
      { title: "Notificação", icon: "bell", route: "/notificacao" },
      { title: "Meu Perfil", icon: "user", route: "/perfil" },
      { title: "Tutorial", icon: "video", route: "/tutorial" },
      { title: "Apiário e Colmeias", image: apiarioColmeia, route: "/apiario" },
      { title: "Produção de Mel", image: prodMel, route: "/producao" },
      { title: "Vistorias das Colmeias", icon: "clipboardCheck", route: "/vistorias" },
      { title: "Insumos", icon: "package", route: "/insumos" },
      { title: "Rastreabilidade", image: rastrear, route: "/rastreabilidade" },
      { title: "Relatórios", icon: "fileDocument", route: "/relatorio" },
      { title: "Configuração", icon: "settings", route: "/configuracao" },
    ];

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Home",
          headerShown: false, // Esconde o cabeçalho padrão para focar no logo/perfil se houver
        }}
      />

      {/* Exibindo saudação personalizada se o usuário estiver logado */}
      {user?.nomeCompleto && (
        <Subtexto style={styles.saudacao}>Olá, {user.nomeCompleto}!</Subtexto>
      )}
      <Subtexto style={styles.subtexto}>{"Selecione uma opção para começar:"}</Subtexto>

      <View style={[styles.grid]}>
        {items.map((item, index) => (
          <View key={index}>
            <ItemHome
              title={item.title}
              iconName={item.icon}
              imageSource={item.image}
              onPress={() => router.push(item.route as any)}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    paddingHorizontal: layout.espacamento.amigavel,
  },
  saudacao: {
    width: '100%',
    paddingTop: layout.espacamento.amigavel,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: Platform.OS === 'web' ? 'center' : 'left',
  },
  subtexto: {
    width: '100%',
    marginBottom: layout.espacamento.amigavel,
    paddingTop: 8,
    textAlign: Platform.OS === 'web' ? 'center' : 'left',
  },
  grid: {
    display: 'flex',
    paddingTop: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: layout.espacamento.amigavel,
    rowGap: layout.espacamento.amigavel,
    width: '100%',
    justifyContent: 'center',
    maxWidth: 700,
    alignSelf: 'center',
    paddingBottom: 40, // Espaço no final para não colar a rolagem na borda inferior
  },
});