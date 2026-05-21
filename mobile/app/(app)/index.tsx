import ItemHome from '@/components/itensHome';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, View, Dimensions } from 'react-native';

const prodMel = require('@/assets/images/prodMel.png');
const apiarioColmeia = require('@/assets/images/apiario_colmeia.png');
const rastrear = require('@/assets/images/rastrear.png');

export default function Index() {
  const router = useRouter();
  
  // Criamos um estado para monitorar a largura da tela em tempo real (essencial para Web se o usuário redimensionar o navegador)
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  // Definimos se é mobile baseado no Platform E no tamanho da tela (telas menores que 768px agem como mobile)
  const isMobile = Platform.OS !== 'web' || screenWidth < 768;

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
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Home",
        }}
      />
      <Subtexto style={styles.subtexto}>{"Selecione uma opção para começar."}</Subtexto>
      
      {/* O container pai decide o alinhamento da sobra baseado no dispositivo */}
      <View style={[styles.grid, isMobile ? styles.gridMobile : styles.gridWeb]}>
        {items.map((item, index) => (
          // O item adapta seu tamanho e alinhamento interno de acordo com a plataforma
          <View 
            key={index} 
            style={[
              styles.itemBase, 
              isMobile ? styles.itemMobile : styles.itemWeb
            ]}
          >
            <ItemHome
              title={item.title}
              iconName={item.icon}
              imageSource={item.image}
              onPress={() => router.push(item.route as any)}
            />
          </View>
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
    // Garante que o texto de instrução também acompanhe o alinhamento do grid na Web
    textAlign: Platform.OS === 'web' ? 'center' : 'left', 
  },
  // Estrutura principal do Grid
  grid: {
    paddingTop: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: layout.espacamento.amigavel,
    rowGap: layout.espacamento.amigavel,
    width: '100%', // Ocupa tudo no mobile
  },
  // Mobile: Se sobrar item na última linha, 'center' joga ele pro meio
  gridMobile: {
    justifyContent: 'center', 
  },
  // Web: Limita o tamanho máximo para os ícones não espalharem muito e centraliza o bloco todo na tela
  gridWeb: {
    justifyContent: 'center', // Itens internos centralizados
    maxWidth: 1200,           // Impede que o grid estique demais em monitores ultra-wide
    alignSelf: 'center',      // Centraliza o bloco do grid inteiro na página web
  },
  itemBase: {
    flexGrow: 1, 
  },
  itemMobile: {
    flexBasis: '28%', 
    maxWidth: '31%', 
  },
  // Na Web, fixamos um tamanho confortável para os cards (ex: 160px a 180px) em vez de porcentagem líquida larga.
  // Isso vai fazer com que eles formem linhas perfeitas e centralizadas.
  itemWeb: {
    flexBasis: 160, 
    maxWidth: 180, 
  }
});