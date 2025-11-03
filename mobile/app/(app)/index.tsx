import ItemHome from '@/components/itensHome';
import cores from '@/constants/cores';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Subtexto from '@/components/subTexto';
import layout from '@/constants/layout';

const prodMel = require('@/assets/images/prodMel.png');
const apiarioColmeia = require('@/assets/images/apiario_colmeia.png');
const rastrear = require('@/assets/images/rastrear.png');

export default function Index() {
  const router = useRouter();

  const items: Array<{
    title: string;
    icon?: string;
    image?: any;
    route: string;
  }> = [
      { title: "Notificações", icon: "bell", route: "/notificacoes" },
      { title: "Meu Perfil", icon: "user", route: "/perfil" },
      { title: "Tutorial", icon: "video", route: "/tutorial" },

      { title: "Apiário e Colmeias", image: apiarioColmeia, route: "/apiario" },
      { title: "Vistorias das Colmeias", icon: "clipboardCheck", route: "/vistorias" },
      { title: "Insumos", icon: "package", route: "/insumos" },

      // ROTAS DA PRODUÇÃO CORRIGIDAS:
      { title: "Produção de Mel", image: prodMel, route: "/producao" }, 

      { title: "Rastreabilidade", image: rastrear, route: "/rastreabilidade" },
      
      { title: "Relatórios", icon: "fileDocument", route: "/relatorio" },
      { title: "Configurações", icon: "settings", route: "/configuracoes" },
    ];

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Home",
        }}
      />
      <Subtexto style={styles.subtexto}>Selecione uma opção para começar.</Subtexto>
      <View style={styles.grid}>
        {items.map((item, index) => (
          <ItemHome
            key={index}
            title={item.title}
            iconName={item.icon}
            imageSource={item.image}
            onPress={() => router.push(item.route as any)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    paddingHorizontal: layout.espacamento.amigavel,
  },
  subtexto: {
    width: '100%',
    marginBottom: layout.espacamento.amigavel,
    paddingTop: layout.espacamento.amigavel,
  },
  grid: {
    paddingTop: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});