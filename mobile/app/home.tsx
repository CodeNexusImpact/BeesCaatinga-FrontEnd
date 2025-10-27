import ItemHome from '@/components/itensHome';
import cores from '@/constants/cores';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Subtexto from '@/components/subTexto';

const prodMel = require('../assets/images/prodMel.png');
const apiarioColmeia = require('../assets/images/apiario_colmeia.png');
const rastrear = require('../assets/images/rastrear.png');

export default function HomePage() {
  const router = useRouter();

  const items: Array<{
    title: string;
    icon?: string;
    image?: any;
    route: string; // altere para string
  }> = [
    { title: "Notificações", icon: "bell", route: "/notificacoes" },
    { title: "Meu Perfil", icon: "user", route: "/perfil" },
    { title: "Tutorial", icon: "video", route: "/tutorial" },
    
    { title: "Apiário e Colmeias", image: apiarioColmeia, route: "/apiario" },
    { title: "Vistorias das Colmeias", icon: "clipboardCheck", route: "/vistorias" },
    { title: "Insumos", icon: "package", route: "/insumos" },
    { title: "Produção de Mel", image: prodMel, route: "/producao" },
    { title: "Rastreabilidade", image: rastrear, route: "/rastreabilidade" },
    
    { title: "Relatórios", icon: "fileDocument", route: "/relatorios" },
    { title: "Configurações", icon: "settings", route: "/configuracoes" },
  ];

  return (
    <View style={styles.container}>
      <Subtexto>Selecione uma opção para começar.</Subtexto>
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
    padding: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});